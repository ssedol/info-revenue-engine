import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { isCliEntry } from "../shared/cli";
import { fixtureRoot, rawRoot, todayPathSegment } from "../shared/paths";
import { qnetQualificationListEndpoint, qnetScheduleOperations, qnetTestInformationEndpoint } from "../shared/qnet-api";
import { externalSources, validateExternalSourceHtml } from "../shared/external-sources";

async function fetchOfficialXml(url: URL, serviceKey?: string): Promise<string> {
  if (serviceKey) url.searchParams.set("serviceKey", serviceKey);
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });

  if (!response.ok) {
    throw new Error(`Q-Net API failed with HTTP ${response.status}: ${url.pathname}`);
  }

  const xml = await response.text();
  if (!xml.includes("<resultCode>00</resultCode>")) {
    throw new Error(`Q-Net API returned an unsuccessful response: ${url.pathname}`);
  }
  return xml;
}

async function fetchWithRetry(url: URL, serviceKey?: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetchOfficialXml(new URL(url), serviceKey);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function collectExternalSources(outputDir: string, fetchedAt: string): Promise<void> {
  const results = await Promise.all(
    externalSources.map(async (source) => {
      try {
        const response = await fetch(source.url, {
          headers: { "user-agent": "cert-insight-schedule-bot/1.0" },
          redirect: "follow",
          signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const missingText = validateExternalSourceHtml(source, html);
        if (missingText.length > 0) {
          throw new Error(`required text missing: ${missingText.join(", ")}`);
        }

        await writeFile(join(outputDir, `external-${source.id}.raw.html`), html, "utf8");
        return {
          id: source.id,
          provider: source.provider,
          certificationNames: source.certificationNames,
          url: source.url,
          ok: true,
          fetchedAt,
        };
      } catch (error) {
        return {
          id: source.id,
          provider: source.provider,
          certificationNames: source.certificationNames,
          url: source.url,
          ok: false,
          fetchedAt,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );

  await writeFile(
    join(outputDir, "external-certifications.raw.metadata.json"),
    `${JSON.stringify({ sources: results }, null, 2)}\n`,
    "utf8",
  );
}

async function collect(): Promise<void> {
  const fetchedAt = new Date().toISOString();
  const datePath = todayPathSegment(new Date(fetchedAt));
  const outputDir = join(rawRoot, datePath);
  const rawPath = join(outputDir, "qnet-certifications.raw.xml");
  const metadataPath = join(outputDir, "qnet-certifications.raw.metadata.json");
  const serviceKey = process.env.OFFICIAL_API_KEY;
  const useFixture = process.env.USE_CERTIFICATION_FIXTURE === "1";

  await mkdir(outputDir, { recursive: true });

  const mode = useFixture ? "fixture" : "official-api";
  if (useFixture) {
    await copyFile(join(fixtureRoot, "qnet-list.fixture.xml"), rawPath);
    const uniqueOperations = [...new Set(Object.values(qnetScheduleOperations))];
    await Promise.all(
      uniqueOperations.map((operation) =>
        copyFile(
          join(fixtureRoot, `qnet-schedules-${operation}.fixture.xml`),
          join(outputDir, `qnet-schedules-${operation}.raw.xml`),
        ),
      ),
    );
  } else {
    const listUrl = new URL(qnetQualificationListEndpoint.serviceUrl);
    listUrl.searchParams.set("numOfRows", "1000");
    listUrl.searchParams.set("pageNo", "1");
    await writeFile(rawPath, await fetchWithRetry(listUrl, serviceKey), "utf8");

    const uniqueOperations = [...new Set(Object.values(qnetScheduleOperations))];
    await Promise.all(
      uniqueOperations.map(async (operation) => {
        const baseUrl = qnetTestInformationEndpoint.serviceUrl.replace("/getPEList", "");
        const scheduleUrl = new URL(`${baseUrl}/${operation}`);
        scheduleUrl.searchParams.set("numOfRows", "100");
        scheduleUrl.searchParams.set("pageNo", "1");
        const xml = await fetchWithRetry(scheduleUrl, serviceKey);
        await writeFile(join(outputDir, `qnet-schedules-${operation}.raw.xml`), xml, "utf8");
      }),
    );
  }

  if (!useFixture) {
    await collectExternalSources(outputDir, fetchedAt);
  }

  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        provider: "Q-Net",
        mode,
        fetchedAt,
        endpoint: qnetQualificationListEndpoint.serviceUrl,
        scheduleEndpoint: qnetTestInformationEndpoint.serviceUrl,
        officialPage: qnetQualificationListEndpoint.dataGoKrPage,
        format: qnetQualificationListEndpoint.format,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

if (isCliEntry(import.meta.url)) {
  collect().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
