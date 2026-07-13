import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { EXPERIENCE_ITEMS } from "@data/experience";

const Experience = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const items = [...EXPERIENCE_ITEMS].sort(
    (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
  );

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="experience"
      className="bg-skin-primary py-20 md:py-28"
    >
      <div className="mx-auto max-w-content px-6">
        <div
          className={`mb-16 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          <h2
            className="text-display-sm font-bold text-skin-text tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Experiencia
          </h2>
        </div>

        <div className="border-t border-skin-border">
          {items.map((item, index) => (
            <article
              key={`${item.company}-${item.period}`}
              className={`grid gap-2 border-b border-skin-border py-8 md:grid-cols-[200px_1fr] md:gap-8 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <span className="font-mono text-xs text-skin-muted md:pt-1.5">
                {item.period}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-skin-text">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm text-skin-muted">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-skin-muted">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
