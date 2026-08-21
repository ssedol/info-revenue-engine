import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { atomicWriteJson } from "./atomic-json";

describe("atomicWriteJson", () => {
  it("writes parseable JSON", async () => {
    const dir = join(tmpdir(), `atomic-json-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    const target = join(dir, "data.json");

    await atomicWriteJson(target, { ok: true });

    expect(JSON.parse(await readFile(target, "utf8"))).toEqual({ ok: true });
  });

  it("keeps the existing file when serialization fails", async () => {
    const dir = join(tmpdir(), `atomic-json-fail-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    const target = join(dir, "data.json");
    await writeFile(target, "{\"stable\":true}\n", "utf8");

    const circular: Record<string, unknown> = {};
    circular.self = circular;

    await expect(atomicWriteJson(target, circular)).rejects.toThrow();
    expect(await readFile(target, "utf8")).toBe("{\"stable\":true}\n");
  });
});
