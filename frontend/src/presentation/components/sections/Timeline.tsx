interface Experience {
    period: string;
    role: string;
    company: string;
    description: string;
    location: string;
}

interface Props {
    experiences?: Experience[];
}

const fallbackEvents = [
    { period: '2020', title: 'Inicio en Data Analytics', company: '', description: 'Comenzó mi carrera en análisis de datos', location: '' },
    { period: '2022', title: 'Especialización en Visualización', company: '', description: 'Profundizó en técnicas de visualización avanzada', location: '' },
    { period: '2024', title: 'Full Stack Development', company: '', description: 'Expandió habilidades hacia desarrollo web completo', location: '' },
];

function TimelineCard({ event, index }: { event: { period: string; title: string; company: string; description: string; location: string }; index: number }) {
    return (
        <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className="relative p-lg md:p-xl rounded-2xl border border-border transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                    style={{ background: 'linear-gradient(to bottom, var(--color-accent), var(--color-accent), transparent)' }} />
                <div className="flex flex-wrap items-start justify-between gap-sm mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-accent"
                        style={{ backgroundColor: 'var(--color-accent-muted)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {event.period}
                    </span>
                    {event.location && (
                        <span className="text-xs text-text-tertiary">{event.location}</span>
                    )}
                </div>
                <h3 className="text-xl font-semibold mb-0.5 text-text-primary">{event.title}</h3>
                {event.company && (
                    <p className="text-sm font-medium text-accent mb-3">{event.company}</p>
                )}
                <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
            </div>
        </div>
    );
}

export function Timeline({ experiences = [] }: Props) {
    const displayEvents = experiences.length > 0
        ? experiences.map(e => ({ period: e.period, title: e.role, company: e.company, description: e.description, location: e.location }))
        : fallbackEvents;

    return (
        <section id="experiencia" className="py-4xl px-4 relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                    style={{ background: 'linear-gradient(to bottom, transparent, var(--color-accent), transparent)', opacity: 0.15 }} />
            </div>
            <div className="container relative">
                <h2 className="text-4xl font-bold mb-4xl text-center text-text-primary">
                    Experiencia
                </h2>
                <div className="max-w-2xl mx-auto space-y-lg">
                    {displayEvents.map((event, index) => (
                        <TimelineCard key={index} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}