import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { isCliEntry } from "../shared/cli";
import { fixtureRoot, rawRoot, todayPathSegment } from "../shared/paths";
import { qnetQualificationListEndpoint } from "../shared/qnet-api";

async function fetchOfficialList(serviceKey: string): Promise<string> {
  const url = new URL(qnetQualificationListEndpoint.serviceUrl);
  url.searchParams.set("serviceKey", serviceKey);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Q-Net list API failed with HTTP ${response.status}`);
  }

  return response.text();
}

async function collect(): Promise<void> {
  const fetchedAt = new Date().toISOString();
  const datePath = todayPathSegment(new Date(fetchedAt));
  const outputDir = join(rawRoot, datePath);
  const rawPath = join(outputDir, "qnet-certifications.raw.xml");
  const metadataPath = join(outputDir, "qnet-certifications.raw.metadata.json");
  const serviceKey = process.env.OFFICIAL_API_KEY;

  await mkdir(outputDir, { recursive: true });

  const mode = serviceKey ? "official-api" : "fixture";
  if (serviceKey) {
    await writeFile(rawPath, await fetchOfficialList(serviceKey), "utf8");
  } else {
    await copyFile(join(fixtureRoot, "qnet-list.fixture.xml"), rawPath);
  }

  await writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        provider: "Q-Net",
        mode,
        fetchedAt,
        endpoint: qnetQualificationListEndpoint.serviceUrl,
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
