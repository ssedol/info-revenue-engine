import type { OfficialResource } from "../officialResources";

export function OfficialResourcePanel({ resources }: { resources: OfficialResource[] }) {
  return (
    <section className="official-resources" aria-labelledby="official-resources-title">
      <div className="official-resources__header">
        <h3 id="official-resources-title">원문과 관련 자료</h3>
      </div>
      <div className="official-resource-grid">
        {resources.map((resource) => (
          <article className="official-resource-card" key={resource.href}>
            <h3>{resource.title}</h3>
            <p>{resource.body}</p>
            <a className="official-link official-link--stacked" href={resource.href} rel="noreferrer" target="_blank">
              <span>{resource.label}</span>
              <small>{resource.href}</small>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
