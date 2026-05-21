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
            <div className="glass-card rounded-2xl p-lg md:p-xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/60 to-accent/10" />
                <div className="flex flex-wrap items-start justify-between gap-sm mb-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        {event.period}
                    </span>
                    {event.location && (
                        <span className="text-xs text-text-secondary">{event.location}</span>
                    )}
                </div>
                <h3 className="text-xl font-semibold mb-0.5">{event.title}</h3>
                {event.company && (
                    <p className="text-sm font-medium text-accent mb-md">{event.company}</p>
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
        <section id="experiencia" className="py-4xl px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
            </div>
            <div className="container relative">
                <h2 className="text-4xl font-bold mb-4xl text-center">
                    <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Experiencia</span>
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
