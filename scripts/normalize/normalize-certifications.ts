import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Certification } from "../../src/sites/certifications/types";
import { isCliEntry } from "../shared/cli";
import { findLatestRawDirectory, normalizedRoot } from "../shared/paths";
import { qnetQualificationListEndpoint } from "../shared/qnet-api";
import { asArray, asRecord, parseXml, readText } from "../shared/xml";

type RawMetadata = {
  provider: string;
  fetchedAt: string;
  endpoint: string;
  officialPage: string;
  mode: string;
};

type QnetListItem = {
  qualgbcd?: string;
  qualgbnm?: string;
  seriescd?: string;
  seriesnm?: string;
  jmcd?: string;
  jmfldnm?: string;
  obligfldcd?: string;
  obligfldnm?: string;
  mdobligfldcd?: string;
  mdobligfldnm?: string;
};

function toQnetItem(value: unknown): QnetListItem {
  const record = asRecord(value);
  return {
    qualgbcd: readText(record.qualgbcd),
    qualgbnm: readText(record.qualgbnm),
    seriescd: readText(record.seriescd),
    seriesnm: readText(record.seriesnm),
    jmcd: readText(record.jmcd),
    jmfldnm: readText(record.jmfldnm),
    obligfldcd: readText(record.obligfldcd),
    obligfldnm: readText(record.obligfldnm),
    mdobligfldcd: readText(record.mdobligfldcd),
    mdobligfldnm: readText(record.mdobligfldnm),
  };
}

export function normalizeQnetListItem(item: QnetListItem, metadata: RawMetadata): Certification | undefined {
  if (!item.jmcd || !item.jmfldnm || !item.obligfldnm) {
    return undefined;
  }

  const source = {
    provider: metadata.provider,
    endpoint: metadata.endpoint || qnetQualificationListEndpoint.serviceUrl,
    officialPage: metadata.officialPage || qnetQualificationListEndpoint.dataGoKrPage,
    fetchedAt: metadata.fetchedAt,
  };

  return {
    id: item.jmcd,
    slug: `cert-${item.jmcd}`,
    name: item.jmfldnm,
    officialName: item.jmfldnm,
    category: item.obligfldnm,
    level: item.seriesnm,
    issuer: "한국산업인력공단",
    description:
      metadata.mode === "fixture"
        ? "API key 연결 전 fixture 항목입니다. 시험일정, 응시료, 합격률은 공식 데이터 확인 후 표시됩니다."
        : undefined,
    schedules: [],
    fees: [],
    eligibility: "공식 데이터 확인 필요",
    passRate: [],
    source,
    updatedAt: metadata.fetchedAt,
  };
}

export function normalizeQnetListXml(xml: string, metadata: RawMetadata): Certification[] {
  const parsed = asRecord(parseXml(xml));
  const response = asRecord(parsed.response);
  const body = asRecord(response.body);
  const items = asRecord(body.items);

  return asArray(items.item)
    .map(toQnetItem)
    .map((item) => normalizeQnetListItem(item, metadata))
    .filter((item): item is Certification => item !== undefined)
    .slice(0, 7);
}

async function normalize(): Promise<void> {
  const rawDirectory = await findLatestRawDirectory();
  const xml = await readFile(join(rawDirectory, "qnet-certifications.raw.xml"), "utf8");
  const metadata = JSON.parse(
    await readFile(join(rawDirectory, "qnet-certifications.raw.metadata.json"), "utf8"),
  ) as RawMetadata;
  const certifications = normalizeQnetListXml(xml, metadata);

  await mkdir(normalizedRoot, { recursive: true });
  await writeFile(
    join(normalizedRoot, "certifications.normalized.json"),
    `${JSON.stringify({ certifications }, null, 2)}\n`,
    "utf8",
  );
}

if (isCliEntry(import.meta.url)) {
  normalize().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
