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
        icon: <IconChartBar size={28} strokeWidth={1.5} />,
    },
    {
        title: 'Visualización',
        description: 'Dashboards interactivos y visualizaciones que convierten datos complejos en historias claras.',
        icon: <IconChartDots3 size={28} strokeWidth={1.5} />,
    },
    {
        title: 'Machine Learning',
        description: 'Modelos predictivos y de clasificación para resolver problemas de negocio con IA.',
        icon: <IconBrain size={28} strokeWidth={1.5} />,
    },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Services() {
    return (
        <section className="py-4xl px-4 bg-light-bg dark:bg-dark-bg">
            <div className="container">
                <div className="text-center mb-4xl">
                    <span className="section-label mb-lg inline-block">Lo que hago</span>
                    <h2 className="text-4xl md:text-5xl font-bold">Servicios</h2>
                    <p className="mt-lg text-light-text-secondary dark:text-dark-text-secondary max-w-xl mx-auto">
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
                            className="group relative p-xl bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border hover:border-dark-accent-cyan/40 transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-dark-accent-cyan/0 group-hover:from-dark-accent-cyan/5 to-transparent transition-all duration-500 pointer-events-none" />
                            <div className="relative w-14 h-14 rounded-xl bg-dark-accent-cyan/10 border border-dark-accent-cyan/20 flex items-center justify-center mb-lg text-dark-accent-cyan">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-sm relative">{service.title}</h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed text-sm md:text-base relative">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
