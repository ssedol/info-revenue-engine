import type { QnetOfficialInfo } from "../qnetOfficial";

export function QnetOfficialPanel({ info }: { info: QnetOfficialInfo }) {
  return (
    <section className="qnet-panel" aria-labelledby="qnet-panel-title">
      <div className="qnet-panel__header">
        <h2 id="qnet-panel-title">{info.certificationName} 시험 정보</h2>
        <p>
          {info.sourceName}에서 {formatCheckedAt(info.checkedAt)} 확인한 공개 정보입니다.
        </p>
      </div>
      <dl className="qnet-facts">
        <div>
          <dt>관련부처</dt>
          <dd>{info.ministry}</dd>
        </div>
        <div>
          <dt>시행기관</dt>
          <dd>{info.issuer}</dd>
        </div>
        <div>
          <dt>응시 수수료</dt>
          <dd>
            필기 {info.writtenFee} / 실기 {info.practicalFee}
          </dd>
        </div>
      </dl>
      <div className="qnet-schedule" aria-label={`${info.certificationName} 2026년 정기 기사 시험 일정`}>
        {info.schedules.map((schedule) => (
          <article className="qnet-schedule-card" key={schedule.round}>
            <h3>{schedule.round}</h3>
            <dl>
              <div>
                <dt>필기 접수</dt>
                <dd>{schedule.writtenApply}</dd>
              </div>
              <div>
                <dt>필기 시험</dt>
                <dd>{schedule.writtenExam}</dd>
              </div>
              <div>
                <dt>필기 발표</dt>
                <dd>{schedule.writtenResult}</dd>
              </div>
              <div>
                <dt>실기 접수</dt>
                <dd>{schedule.practicalApply}</dd>
              </div>
              <div>
                <dt>실기 시험</dt>
                <dd>{schedule.practicalExam}</dd>
              </div>
              <div>
                <dt>최종 발표</dt>
                <dd>{schedule.finalResult}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="qnet-panel__note">{info.scheduleNote}</p>
      <a className="official-link official-link--stacked" href={info.detailUrl} rel="noreferrer" target="_blank">
        <span>Q-Net에서 원문 보기</span>
        <small>{info.detailUrl}</small>
      </a>
    </section>
  );
}

function formatCheckedAt(date: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
