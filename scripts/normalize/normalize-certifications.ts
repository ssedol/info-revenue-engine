import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Certification, ExamSchedule } from "../../src/sites/certifications/types";
import { isCliEntry } from "../shared/cli";
import { findLatestRawDirectory, normalizedRoot } from "../shared/paths";
import { qnetQualificationListEndpoint, qnetScheduleOperations, qnetTestInformationEndpoint } from "../shared/qnet-api";
import { asArray, asRecord, parseXml, readText } from "../shared/xml";
import {
  normalizeComputerLiteracyLevel1Html,
  normalizeDataqHtml,
  normalizeKoreanHistoryHtml,
  normalizeRealtorHtml,
} from "./normalize-external-certifications";

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

type QnetScheduleItem = {
  description?: string;
  docregstartdt?: string;
  docregenddt?: string;
  docexamdt?: string;
  docpassdt?: string;
  pracregstartdt?: string;
  pracregenddt?: string;
  pracexamstartdt?: string;
  pracexamenddt?: string;
  pracpassdt?: string;
};

function qnetDate(value?: string): string | undefined {
  if (!value || !/^\d{8}$/.test(value)) return undefined;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

export function normalizeScheduleXml(
  xml: string,
  fetchedAt: string,
  endpoint = qnetTestInformationEndpoint.serviceUrl,
): ExamSchedule[] {
  const parsed = asRecord(parseXml(xml));
  const response = asRecord(parsed.response);
  const body = asRecord(response.body);
  const items = asRecord(body.items);
  const rows = asArray(items.item).map((value) => asRecord(value) as QnetScheduleItem);
  const byRound = new Map<string, QnetScheduleItem[]>();

  for (const row of rows) {
    const description = readText(row.description);
    if (description) byRound.set(description, [...(byRound.get(description) ?? []), row]);
  }

  return [...byRound.entries()].map(([round, roundRows]) => {
    const byWrittenRegistration = [...roundRows].sort((a, b) =>
      (readText(a.docregstartdt) ?? "").localeCompare(readText(b.docregstartdt) ?? ""),
    );
    const byPracticalRegistration = [...roundRows]
      .filter((row) => readText(row.pracregstartdt))
      .sort((a, b) => (readText(a.pracregstartdt) ?? "").localeCompare(readText(b.pracregstartdt) ?? ""));
    const primary = byWrittenRegistration[0];
    const practical = byPracticalRegistration[0] ?? primary;
    const practicalResults = roundRows
      .map((row) => readText(row.pracpassdt))
      .filter((date): date is string => Boolean(date))
      .sort();

    return {
      round,
      examName: round,
      applicationStart: qnetDate(readText(primary.docregstartdt)),
      applicationEnd: qnetDate(readText(primary.docregenddt)),
      examStart: qnetDate(readText(primary.docexamdt)),
      resultDate: qnetDate(readText(primary.docpassdt)),
      practicalApplicationStart: qnetDate(readText(practical.pracregstartdt)),
      practicalApplicationEnd: qnetDate(readText(practical.pracregenddt)),
      practicalExamStart: qnetDate(readText(practical.pracexamstartdt)),
      practicalExamEnd: qnetDate(readText(practical.pracexamenddt)),
      practicalResultDate: qnetDate(practicalResults.at(-1)),
      source: {
        provider: "Q-Net",
        endpoint,
        officialPage: qnetTestInformationEndpoint.dataGoKrPage,
        fetchedAt,
      },
    };
  });
}

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

export function normalizeQnetListItem(
  item: QnetListItem,
  metadata: RawMetadata,
  schedulesByLevel: ReadonlyMap<string, ExamSchedule[]> = new Map(),
): Certification | undefined {
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
    officialUrl: `https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=${item.jmcd}`,
    applicationUrl: "https://www.q-net.or.kr/man001.do?gSite=Q",
    description:
      metadata.mode === "fixture"
        ? "API key 연결 전 fixture 항목입니다. 시험일정, 응시료, 합격률은 공식 데이터 확인 후 표시됩니다."
        : undefined,
    schedules: schedulesByLevel.get(item.seriesnm ?? "") ?? [],
    fees: [],
    eligibility: "공식 데이터 확인 필요",
    passRate: [],
    source,
    updatedAt: metadata.fetchedAt,
  };
}

export function normalizeQnetListXml(
  xml: string,
  metadata: RawMetadata,
  schedulesByLevel: ReadonlyMap<string, ExamSchedule[]> = new Map(),
): Certification[] {
  const parsed = asRecord(parseXml(xml));
  const response = asRecord(parsed.response);
  const body = asRecord(response.body);
  const items = asRecord(body.items);

  return asArray(items.item)
    .map(toQnetItem)
    .map((item) => normalizeQnetListItem(item, metadata, schedulesByLevel))
    .filter((item): item is Certification => item !== undefined);
}

async function normalize(): Promise<void> {
  const rawDirectory = await findLatestRawDirectory();
  const xml = await readFile(join(rawDirectory, "qnet-certifications.raw.xml"), "utf8");
  const metadata = JSON.parse(
    await readFile(join(rawDirectory, "qnet-certifications.raw.metadata.json"), "utf8"),
  ) as RawMetadata;
  const schedulesByLevel = new Map<string, ExamSchedule[]>();
  for (const [level, operation] of Object.entries(qnetScheduleOperations)) {
    const scheduleXml = await readFile(join(rawDirectory, `qnet-schedules-${operation}.raw.xml`), "utf8");
    const endpoint = qnetTestInformationEndpoint.serviceUrl.replace("/getPEList", `/${operation}`);
    schedulesByLevel.set(level, normalizeScheduleXml(scheduleXml, metadata.fetchedAt, endpoint));
  }
  const certifications = normalizeQnetListXml(xml, metadata, schedulesByLevel);
  try {
    const realtorHtml = await readFile(join(rawDirectory, "external-realtor.raw.html"), "utf8");
    certifications.push(
      normalizeRealtorHtml(
        realtorHtml,
        metadata.fetchedAt,
        "https://www.q-net.or.kr/man001.do?gSite=L&gId=08",
      ),
    );
  } catch (error) {
    if (metadata.mode !== "fixture") throw error;
  }
  try {
    const korchamHtml = await readFile(
      join(rawDirectory, "external-korcham-computer-level-1.raw.html"),
      "utf8",
    );
    certifications.push(
      normalizeComputerLiteracyLevel1Html(
        korchamHtml,
        metadata.fetchedAt,
        "https://license.korcham.net/co/examguide.do?cd=0103&mm=21",
      ),
    );
  } catch (error) {
    if (metadata.mode !== "fixture") throw error;
  }
  try {
    const dataqHtml = await readFile(join(rawDirectory, "external-dataq.raw.html"), "utf8");
    certifications.push(
      ...normalizeDataqHtml(
        dataqHtml,
        metadata.fetchedAt,
        "https://www.dataq.or.kr/www/accept/schedule.do",
      ),
    );
    const historyHtml = await readFile(join(rawDirectory, "external-korean-history.raw.html"), "utf8");
    certifications.push(
      normalizeKoreanHistoryHtml(
        historyHtml,
        metadata.fetchedAt,
        "https://www.historyexam.go.kr/",
      ),
    );
  } catch (error) {
    if (metadata.mode !== "fixture") throw error;
  }

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
