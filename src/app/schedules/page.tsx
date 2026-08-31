import type { Metadata } from "next";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { CertificationCatalog } from "@/sites/certifications/components/CertificationCatalog";
import { getCertifications } from "@/sites/certifications/data";
import { certificationPath } from "@/sites/certifications/routes";

export const dynamic = "error";
export const metadata: Metadata = buildMetadata({
  title: "자격증별 2026 시험일정",
  description: "자격증 이름별로 가까운 원서접수일과 필기·실기 시험일정을 검색해 확인합니다.",
  path: "/schedules",
});

export default function SchedulesPage() {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
  const certifications = getCertifications();
  const catalogItems = certifications
    .map(({ id, slug, name, category, level, schedules }) => {
      const nextSchedule = schedules
        .flatMap((schedule) => [
          schedule.applicationStart && { date: schedule.applicationStart, label: "필기 접수" },
          schedule.examStart && { date: schedule.examStart, label: "필기시험" },
          schedule.resultDate && { date: schedule.resultDate, label: "필기 발표" },
          schedule.practicalApplicationStart && { date: schedule.practicalApplicationStart, label: "실기 접수" },
          schedule.practicalExamStart && { date: schedule.practicalExamStart, label: "실기시험" },
          schedule.practicalResultDate && { date: schedule.practicalResultDate, label: "최종 발표" },
        ])
        .filter((item): item is { date: string; label: string } => Boolean(item))
        .filter((item) => item.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];

      return {
        id,
        slug,
        name,
        category,
        level,
        nextSchedule: nextSchedule ? `${formatDate(nextSchedule.date)} · ${nextSchedule.label}` : "공식 일정 확인",
        nextDate: nextSchedule?.date,
      };
    })
    .sort((a, b) => {
      if (a.nextDate && b.nextDate) return a.nextDate.localeCompare(b.nextDate) || a.name.localeCompare(b.name, "ko");
      if (a.nextDate) return -1;
      if (b.nextDate) return 1;
      return a.name.localeCompare(b.name, "ko");
    });

  return (
    <>
      <JsonLd
        value={itemListJsonLd(
          certifications.slice(0, 100).map((certification) => ({
            name: `${certification.name} 시험일정`,
            path: certificationPath(certification),
          })),
        )}
      />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "시험일정" }]} />
      <section className="hero">
        <h1>자격증별 시험일정</h1>
        <p>가까운 접수일과 시험일 순서로 확인하고 원하는 자격증의 전체 일정을 살펴보세요.</p>
      </section>
      <section className="section" aria-labelledby="schedule-catalog-title">
        <h2 id="schedule-catalog-title">자격증 일정 찾기</h2>
        <CertificationCatalog certifications={catalogItems} />
      </section>
    </>
  );
}

function formatDate(value: string): string {
  return value.replaceAll("-", ".");
}
