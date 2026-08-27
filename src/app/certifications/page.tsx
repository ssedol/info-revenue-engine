import type { Metadata } from "next";
import { Breadcrumb } from "@/core/ui/Breadcrumb";
import { buildMetadata } from "@/core/seo/metadata";
import { JsonLd, itemListJsonLd } from "@/core/seo/structured-data";
import { CertificationCatalog } from "@/sites/certifications/components/CertificationCatalog";
import { getCertifications } from "@/sites/certifications/data";
import { certificationPath } from "@/sites/certifications/routes";

export const dynamic = "error";
export const metadata: Metadata = buildMetadata({
  title: "국가자격증 목록과 2026 시험일정",
  description: "Q-Net 공식 데이터 기반 국가자격증 목록과 2026년 필기·실기 접수 및 시험일정을 확인합니다.",
  path: "/certifications",
});

export default function CertificationsPage() {
  const certifications = getCertifications();
  const today = new Date().toISOString().slice(0, 10);
  const catalogItems = certifications.map(({ id, slug, name, category, level, schedules }) => {
    const nextSchedule = schedules
      .flatMap((schedule) => [
        schedule.applicationStart && { date: schedule.applicationStart, label: "필기 접수" },
        schedule.examStart && { date: schedule.examStart, label: "필기시험" },
        schedule.practicalApplicationStart && { date: schedule.practicalApplicationStart, label: "실기 접수" },
        schedule.practicalExamStart && { date: schedule.practicalExamStart, label: "실기시험" },
      ])
      .filter((item): item is { date: string; label: string } => Boolean(item))
      .filter((item) => item.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    return { id, slug, name, category, level, nextSchedule: nextSchedule ? `${nextSchedule.date} ${nextSchedule.label}` : "2026 일정 확인" };
  });

  return (
    <>
      <JsonLd
        value={itemListJsonLd(
          certifications.slice(0, 100).map((certification) => ({ name: certification.name, path: certificationPath(certification) })),
        )}
      />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "자격증 목록" }]} />
      <section className="hero">
        <h1>국가자격증과 2026 시험일정</h1>
        <p>Q-Net에서 제공하는 국가자격 종목을 검색하고 필기·실기 접수 일정을 확인하세요.</p>
      </section>
      <section className="section" aria-labelledby="catalog-title">
        <h2 id="catalog-title">자격증 찾기</h2>
        <CertificationCatalog certifications={catalogItems} />
      </section>
    </>
  );
}
