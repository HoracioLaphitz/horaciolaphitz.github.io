import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IconChartBar, IconChartDots3, IconBrain } from '@tabler/icons-react';

interface Service {
    title: string;
    description: string;
    icon: ReactNode;
}

const SERVICES: Service[] = [
    {
        title: 'Análisis de Datos',
        description: 'Análisis profundo y estadístico de grandes volúmenes de datos para extraer insights accionables.',
        icon: <IconChartBar size={24} strokeWidth={1.5} aria-hidden="true" />,
    },
    {
        title: 'Visualización',
        description: 'Dashboards interactivos y visualizaciones que convierten datos complejos en historias claras.',
        icon: <IconChartDots3 size={24} strokeWidth={1.5} aria-hidden="true" />,
    },
    {
        title: 'Machine Learning',
        description: 'Modelos predictivos y de clasificación para resolver problemas de negocio con IA.',
        icon: <IconBrain size={24} strokeWidth={1.5} aria-hidden="true" />,
    },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Services() {
    return (
        <section className="py-4xl px-4" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            <div className="container">
                <div className="text-center mb-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">Servicios</h2>
                    <p className="text-text-secondary max-w-xl mx-auto">
                        Combino análisis riguroso con visualizaciones impactantes para decisiones basadas en datos.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-lg"
                >
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={card}
                            className="group relative p-xl rounded-2xl border border-border transition-all duration-300 hover:shadow-lg"
                            style={{ backgroundColor: 'var(--color-surface)' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-accent"
                                style={{ backgroundColor: 'var(--color-accent-muted)' }}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-text-primary">{service.title}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}