import { motion, type Variants } from 'framer-motion';

interface Props {
    name?: string;
    role?: string;
    description?: string;
    avatar?: string;
    yearsExperience?: number;
    projectsCount?: number;
    certificationsCount?: number;
}

export function Hero({
    name = 'Horacio Laphitz',
    role = 'Analista de Datos',
    description,
    avatar,
    yearsExperience,
    projectsCount,
    certificationsCount,
}: Props) {
    const container: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
    };
    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    };

    const hasStats =
        yearsExperience !== undefined ||
        projectsCount !== undefined ||
        certificationsCount !== undefined;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 text-center max-w-3xl mx-auto px-6 py-4xl"
            >
                {avatar && (
                    <motion.div variants={item} className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-110" />
                            <img
                                src={avatar}
                                alt={name}
                                width={112}
                                height={112}
                                loading="eager"
                                decoding="async"
                                className="relative w-28 h-28 rounded-full object-cover border border-border shadow-lg"
                            />
                        </div>
                    </motion.div>
                )}

                <motion.div variants={item} className="mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-border text-[#34c759] dark:text-[#30d158] bg-surface/60 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] dark:bg-[#30d158]" />
                        Disponible para proyectos
                    </span>
                </motion.div>

                <motion.div variants={item}>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-[1.05] text-text-primary">
                        {name}
                    </h1>
                </motion.div>

                <motion.div variants={item}>
                    <p className="text-xl md:text-2xl font-medium text-text-secondary mb-6">
                        {role}
                    </p>
                </motion.div>

                {description && (
                    <motion.div variants={item}>
                        <p className="text-base md:text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                )}

                <motion.div variants={item} className="flex gap-4 justify-center flex-wrap mb-10">
                    <a
                        href="#proyectos"
                        className="inline-flex items-center justify-center font-semibold rounded-full px-8 py-3 text-base bg-accent text-text-inverse hover:opacity-90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        Ver Proyectos
                    </a>
                    <a
                        href="#contacto"
                        className="inline-flex items-center justify-center font-semibold rounded-full px-8 py-3 text-base text-text-primary bg-surface border border-border hover:bg-accent-muted transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        Contacto
                    </a>
                </motion.div>

                {hasStats && (
                    <motion.div
                        variants={item}
                        className="flex items-center justify-center gap-8 pt-8 border-t border-border"
                    >
                        {yearsExperience !== undefined && (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl font-bold text-accent tabular-nums">
                                    {yearsExperience}+
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
                                    Años exp.
                                </span>
                            </div>
                        )}
                        {yearsExperience !== undefined && (projectsCount !== undefined || certificationsCount !== undefined) && (
                            <span className="h-8 w-px bg-border" aria-hidden />
                        )}
                        {projectsCount !== undefined && (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl font-bold text-accent tabular-nums">
                                    {projectsCount}+
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
                                    Proyectos
                                </span>
                            </div>
                        )}
                        {projectsCount !== undefined && certificationsCount !== undefined && (
                            <span className="h-8 w-px bg-border" aria-hidden />
                        )}
                        {certificationsCount !== undefined && (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl font-bold text-accent tabular-nums">
                                    {certificationsCount}
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
                                    Certs.
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-5 h-8 border-2 border-text-tertiary/30 rounded-full flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-accent rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}