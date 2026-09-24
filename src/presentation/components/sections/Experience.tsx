import { EXPERIENCE_ITEMS } from "@data/experience";

const Experience = () => {
  const items = [...EXPERIENCE_ITEMS].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime(),
  );

  return (
    <section
      id="experience"
      className="border-b border-skin-border/40 bg-skin-primary py-12 sm:py-14 lg:py-[clamp(3rem,7vh,5rem)]"
    >
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:max-w-container-xl lg:px-8">
        <div className="mb-8 lg:mb-10">
          <h2
            className="text-display-sm font-bold text-skin-text tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Experiencia
          </h2>
        </div>

        <div className="border-t border-skin-border/40">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-3 border-b border-skin-border/40 py-6 md:grid-cols-[180px_1fr] md:gap-8 lg:py-7"
              itemScope
              itemType="https://schema.org/OrganizationRole"
            >
              <span className="font-mono text-xs text-skin-muted tracking-tight md:pt-1">
                {item.period}
              </span>
              <div className="max-w-4xl">
                <h3 className="text-lg md:text-xl font-semibold text-skin-text tracking-tight">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-skin-muted">
                  {item.companyUrl ? (
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-skin-border/50 underline-offset-2 hover:text-skin-text hover:decoration-skin-border-medium transition-colors"
                    >
                      {item.company}
                    </a>
                  ) : (
                    item.company
                  )}
                  {item.location ? ` · ${item.location}` : ""}
                  {item.kind === "unpaid-project"
                    ? " · Experiencia no remunerada"
                    : ""}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-skin-text font-normal">
                  {item.description}
                </p>
                {item.details.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm leading-relaxed text-skin-text-secondary list-disc pl-5">
                    {item.details.map((detail, i) => (
                      <li key={i}>{detail.text}</li>
                    ))}
                  </ul>
                )}
                {item.companyLinkedin && (
                  <div className="mt-3 flex items-center gap-3 text-xs text-skin-muted">
                    {item.companyLinkedin && (
                      <a
                        href={item.companyLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 underline decoration-skin-border/50 underline-offset-2 hover:text-skin-text hover:decoration-skin-border-medium transition-colors"
                      >
                        Visitar
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
