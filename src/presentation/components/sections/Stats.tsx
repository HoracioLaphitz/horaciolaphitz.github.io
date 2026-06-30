import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";

const stats = [
  { value: "3+", label: "Años en datos" },
  { value: "10+", label: "Proyectos reales" },
  { value: "Python · SQL · LLMs", label: "Stack principal" },
];

const Stats = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="stats"
      className="bg-skin-secondary py-16"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-skin-border">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center py-8 px-6 text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span
                className="font-bold text-skin-text mb-2 tracking-tight"
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span className="text-sm font-medium text-skin-muted uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
