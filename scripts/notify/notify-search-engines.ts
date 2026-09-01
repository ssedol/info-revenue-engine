import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isCliEntry } from "../shared/cli";

const siteOrigin = "https://cert-insight.online";
const siteHost = "cert-insight.online";
const sitemapUrl = `${siteOrigin}/sitemap.xml`;
const indexNowEndpoint = "https://searchadvisor.naver.com/indexnow";
const indexNowKey = "7f83157c808f500dec593857dc39b8fe";
const indexNowKeyLocation = `${siteOrigin}/${indexNowKey}.txt`;
const publishedPath = "data/sources/certifications/published/certifications.json";

type CertificationRecord = {
  slug: string;
  updatedAt: string;
  [key: string]: unknown;
};

type PublishedCertifications = {
  certifications: CertificationRecord[];
};

export function stripVolatileFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripVolatileFields);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "fetchedAt" && key !== "updatedAt")
        .map(([key, child]) => [key, stripVolatileFields(child)]),
    );
  }
  return value;
}

export function findChangedCertifications(
  previous: CertificationRecord[],
  current: CertificationRecord[],
): CertificationRecord[] {
  const previousBySlug = new Map(
    previous.map((certification) => [certification.slug, JSON.stringify(stripVolatileFields(certification))]),
  );

  return current.filter((certification) =>
    previousBySlug.get(certification.slug) !== JSON.stringify(stripVolatileFields(certification)),
  );
}

export function buildNotificationUrls(certifications: CertificationRecord[]): string[] {
  if (certifications.length === 0) {
    return [];
  }
  return [
    siteOrigin,
    `${siteOrigin}/certifications`,
    `${siteOrigin}/schedules`,
    ...certifications.map(({ slug }) => `${siteOrigin}/certifications/${slug}`),
  ];
}

export function buildIndexNowPayload(urlList: string[]) {
  return {
    host: siteHost,
    key: indexNowKey,
    keyLocation: indexNowKeyLocation,
    urlList,
  };
}

export function sitemapContainsChanges(xml: string, certifications: CertificationRecord[]): boolean {
  return certifications.every(({ slug, updatedAt }) => {
    const url = `${siteOrigin}/certifications/${slug}`;
    return xml.includes(`<loc>${url}</loc>`) && xml.includes(`<lastmod>${updatedAt}</lastmod>`);
  });
}

async function waitForProductionSitemap(
  certifications: CertificationRecord[],
  attempts = 30,
  intervalMs = 20_000,
): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const [sitemapResponse, keyResponse] = await Promise.all([
      fetch(sitemapUrl, { headers: { "cache-control": "no-cache" } }),
      fetch(indexNowKeyLocation, { headers: { "cache-control": "no-cache" } }),
    ]);
    const sitemapReady = sitemapResponse.ok && sitemapContainsChanges(await sitemapResponse.text(), certifications);
    const keyReady = keyResponse.ok && (await keyResponse.text()).trim() === indexNowKey;
    if (sitemapReady && keyReady) {
      return;
    }
    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  throw new Error("Production sitemap did not expose the refreshed certification URLs in time.");
}

function readPreviousPublished(baseRef: string): PublishedCertifications {
  if (!/^[A-Za-z0-9_./^~-]+$/.test(baseRef)) {
    throw new Error(`Invalid base ref: ${baseRef}`);
  }
  const content = execFileSync("git", ["show", `${baseRef}:${publishedPath}`], { encoding: "utf8" });
  return JSON.parse(content) as PublishedCertifications;
}

async function notifySearchEngines(): Promise<void> {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const baseRefIndex = args.indexOf("--base-ref");
  const baseRef = baseRefIndex >= 0 ? args[baseRefIndex + 1] : "HEAD^";
  if (!baseRef) {
    throw new Error("--base-ref requires a value.");
  }

  const current = JSON.parse(
    await readFile(join(process.cwd(), publishedPath), "utf8"),
  ) as PublishedCertifications;
  const changed = all
    ? current.certifications
    : findChangedCertifications(readPreviousPublished(baseRef).certifications, current.certifications);
  const urlList = buildNotificationUrls(changed);

  if (urlList.length === 0) {
    console.log("SEARCH_NOTIFY_SKIPPED reason=no-material-content-changes");
    return;
  }

  await waitForProductionSitemap(changed);
  console.log(`GOOGLE_DISCOVERY_READY sitemap=${sitemapUrl} changedUrls=${changed.length}`);

  const response = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(buildIndexNowPayload(urlList)),
  });
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`Naver IndexNow request failed with HTTP ${response.status}: ${await response.text()}`);
  }
  console.log(`NAVER_INDEXNOW_ACCEPTED status=${response.status} submittedUrls=${urlList.length}`);
}

if (isCliEntry(import.meta.url)) {
  notifySearchEngines().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
