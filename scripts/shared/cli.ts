import { pathToFileURL } from "node:url";

export function isCliEntry(importMetaUrl: string): boolean {
  const entry = process.argv[1];
  return Boolean(entry) && importMetaUrl === pathToFileURL(entry).href;
}
