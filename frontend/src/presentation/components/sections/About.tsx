import { motion } from 'framer-motion';

interface Props {
    bio?: string;
    skills?: string[];
    avatar?: string;
    name?: string;
}

export function About({ bio, skills = [], avatar, name }: Props) {
    return (
        <section className="container-fluid py-4xl px-4 bg-light-surface dark:bg-dark-surface">
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="container grid grid-cols-1 md:grid-cols-2 gap-2xl items-center"
            >
                {/* Avatar — left on desktop */}
                {avatar && (
                    <div className="flex justify-center md:justify-start order-2 md:order-1">
                        <div className="relative w-72 h-72 flex-shrink-0">
                            {/* Decorative border offset */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-dark-accent-cyan/30 to-dark-accent-yellow/20 blur-sm" />
                            <img
                                src={avatar}
                                alt={name || 'Foto de perfil'}
                                className="relative w-full h-full rounded-2xl object-cover border border-dark-accent-cyan/20 shadow-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Text — right on desktop */}
                <div className={`order-1 ${avatar ? 'md:order-2' : ''}`}>

                    <h2 className="text-4xl md:text-5xl font-bold mb-lg leading-tight">
                        Datos, código y visualización.
                    </h2>
                    {bio && (
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-xl leading-relaxed text-base md:text-lg">
                            {bio}
                        </p>
                    )}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-sm">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-md py-xs text-sm font-medium bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:border-dark-accent-cyan/50 hover:text-dark-accent-cyan transition-colors duration-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
