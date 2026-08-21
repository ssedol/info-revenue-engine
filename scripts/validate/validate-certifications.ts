import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { certificationSchema } from "../../src/sites/certifications/types";
import { isCliEntry } from "../shared/cli";
import { normalizedRoot, validationRoot } from "../shared/paths";

const normalizedSchema = z.object({
  certifications: z.array(certificationSchema).min(7),
});

export type ValidationReport = {
  ok: boolean;
  checkedAt: string;
  certificationCount: number;
  errors: string[];
};

export function validateNormalizedCertifications(value: unknown, checkedAt = new Date().toISOString()): ValidationReport {
  const result = normalizedSchema.safeParse(value);

  if (result.success) {
    return {
      ok: true,
      checkedAt,
      certificationCount: result.data.certifications.length,
      errors: [],
    };
  }

  return {
    ok: false,
    checkedAt,
    certificationCount: 0,
    errors: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };
}

async function validate(): Promise<void> {
  const normalized = JSON.parse(
    await readFile(join(normalizedRoot, "certifications.normalized.json"), "utf8"),
  ) as unknown;
  const report = validateNormalizedCertifications(normalized);

  await mkdir(validationRoot, { recursive: true });
  await writeFile(join(validationRoot, "certifications.validation.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (!report.ok) {
    throw new Error(`Certification validation failed:\n${report.errors.join("\n")}`);
  }
}

if (isCliEntry(import.meta.url)) {
  validate().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
