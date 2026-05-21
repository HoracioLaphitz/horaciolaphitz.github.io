import { Button } from '../ui/Button';
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
        show: { transition: { staggerChildren: 0.12 } },
    };
    const item: Variants = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    const hasStats =
        yearsExperience !== undefined ||
        projectsCount !== undefined ||
        certificationsCount !== undefined;

    return (
        <section className="container-fluid relative min-h-screen d-flex align-items-center justify-content-center overflow-hidden bg-transparent">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="row relative z-10 text-center max-w-4xl mx-auto px-4 py-4xl"
            >
                {/* Avatar */}
                {avatar && (
                    <motion.div variants={item} className="mb-xl flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2997ff]/40 to-[#30d158]/20 blur-md scale-110 animate-pulse-slow" />
                            <img
                                src={avatar}
                                alt={name}
                                className="relative w-28 h-28 rounded-full object-cover border border-white/20 dark:border-white/10 shadow-2xl"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Availability badge */}
                <motion.div variants={item} className="mb-lg">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full border border-light-border dark:border-dark-border bg-light-surface/60 dark:bg-dark-surface/60 backdrop-blur-md text-[#34c759] dark:text-[#30d158] inline-flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#34c759] dark:bg-[#30d158] animate-pulse" />
                        Disponible para proyectos
                    </span>
                </motion.div>

                {/* Name */}
                <motion.div variants={item}>
                    <h1 className="text-5xl md:text-7xl font-bold mb-md tracking-tight leading-tight bg-gradient-to-b from-light-text-primary via-light-text-primary to-light-text-secondary dark:from-[#f5f5f7] dark:via-[#f5f5f7] dark:to-[#86868b] bg-clip-text text-transparent">
                        {name}
                    </h1>
                </motion.div>

                {/* Role */}
                <motion.div variants={item}>
                    <p className="text-xl md:text-2xl font-medium text-light-text-secondary dark:text-dark-text-secondary mb-xl">
                        {role}
                    </p>
                </motion.div>

                {/* Description */}
                {description && (
                    <motion.div variants={item}>
                        <p className="text-base md:text-lg text-light-text-secondary dark:text-dark-text-secondary mb-2xl max-w-2xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div variants={item} className="flex gap-md justify-center flex-wrap mb-2xl">
                    <Button variant="primary" size="lg">
                        <a href="#proyectos">Ver Proyectos</a>
                    </Button>
                    <Button variant="secondary" size="lg">
                        <a href="#contacto">Contacto</a>
                    </Button>
                </motion.div>

                {/* Stats row */}
                {hasStats && (
                    <motion.div
                        variants={item}
                        className="flex items-center justify-center gap-xl pt-xl border-t border-light-border dark:border-dark-border"
                    >
                        {yearsExperience !== undefined && (
                            <div className="flex flex-col items-center gap-xs">
                                <span className="text-3xl font-bold text-[#2997ff] tabular-nums">
                                    {yearsExperience}+
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                                    Años exp.
                                </span>
                            </div>
                        )}
                        {yearsExperience !== undefined && (projectsCount !== undefined || certificationsCount !== undefined) && (
                            <span className="h-8 w-px bg-light-border dark:bg-dark-border" aria-hidden />
                        )}
                        {projectsCount !== undefined && (
                            <div className="flex flex-col items-center gap-xs">
                                <span className="text-3xl font-bold text-[#2997ff] tabular-nums">
                                    {projectsCount}+
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                                    Proyectos
                                </span>
                            </div>
                        )}
                        {projectsCount !== undefined && certificationsCount !== undefined && (
                            <span className="h-8 w-px bg-light-border dark:bg-dark-border" aria-hidden />
                        )}
                        {certificationsCount !== undefined && (
                            <div className="flex flex-col items-center gap-xs">
                                <span className="text-3xl font-bold text-[#2997ff] tabular-nums">
                                    {certificationsCount}
                                </span>
                                <span className="text-xs font-medium uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                                    Certs.
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-5 h-9 border-2 border-light-text-secondary/25 dark:border-dark-text-secondary/25 rounded-full flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-[#2997ff] rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}
