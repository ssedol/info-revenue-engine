import { z } from "zod";

export const dataSourceRefSchema = z.object({
  provider: z.string().min(1),
  endpoint: z.string().optional(),
  officialPage: z.string().url().optional(),
  fetchedAt: z.string().datetime().optional(),
});

export type DataSourceRef = z.infer<typeof dataSourceRefSchema>;

export const examScheduleSchema = z.object({
  round: z.string().optional(),
  examName: z.string().optional(),
  applicationStart: z.string().date().optional(),
  applicationEnd: z.string().date().optional(),
  examStart: z.string().date().optional(),
  examEnd: z.string().date().optional(),
  resultDate: z.string().date().optional(),
  source: dataSourceRefSchema,
});

export type ExamSchedule = z.infer<typeof examScheduleSchema>;

export const examFeeSchema = z.object({
  label: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.literal("KRW"),
  source: dataSourceRefSchema,
});

export type ExamFee = z.infer<typeof examFeeSchema>;

export const passRateSchema = z.object({
  year: z.number().int().min(1900),
  applicants: z.number().int().nonnegative().optional(),
  passed: z.number().int().nonnegative().optional(),
  rate: z.number().min(0).max(100).optional(),
  source: dataSourceRefSchema,
});

export type PassRate = z.infer<typeof passRateSchema>;

export const certificationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  officialName: z.string().min(1),
  category: z.string().min(1),
  level: z.string().optional(),
  issuer: z.string().min(1),
  officialUrl: z.string().url().optional(),
  applicationUrl: z.string().url().optional(),
  description: z.string().optional(),
  schedules: z.array(examScheduleSchema),
  fees: z.array(examFeeSchema),
  eligibility: z.string().optional(),
  passRate: z.array(passRateSchema).optional(),
  source: dataSourceRefSchema,
  updatedAt: z.string().datetime(),
});

export type Certification = z.infer<typeof certificationSchema>;

export const seoIndexItemSchema = z.object({
  path: z.string().min(1).startsWith("/"),
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalPath: z.string().min(1).startsWith("/"),
  priority: z.number().min(0).max(1),
  changeFrequency: z.enum(["daily", "weekly", "monthly"]),
  lastModified: z.string().datetime().optional(),
});

export type SeoIndexItem = z.infer<typeof seoIndexItemSchema>;
