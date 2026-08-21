import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const dataRoot = "data";
export const certificationDataRoot = join(dataRoot, "sources", "certifications");
export const rawRoot = join(certificationDataRoot, "raw");
export const normalizedRoot = join(certificationDataRoot, "normalized");
export const validationRoot = join(certificationDataRoot, "validation");
export const publishedRoot = join(certificationDataRoot, "published");
export const fixtureRoot = join("scripts", "fixtures", "certifications");

export function todayPathSegment(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function findLatestRawDirectory(): Promise<string> {
  const entries = await readdir(rawRoot, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const latest = directories.at(-1);
  if (!latest) {
    throw new Error("No RAW directory found. Run npm run data:collect first.");
  }

  return join(rawRoot, latest);
}
