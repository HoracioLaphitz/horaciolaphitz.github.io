import { motion } from 'framer-motion';

interface Props {
    bio?: string;
    skills?: string[];
    avatar?: string;
    name?: string;
}

export function About({ bio, skills = [], avatar, name }: Props) {
    return (
        <section className="py-4xl px-4" style={{ backgroundColor: 'var(--color-surface)' }}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="container grid grid-cols-1 md:grid-cols-2 gap-2xl items-center"
            >
                {avatar && (
                    <div className="flex justify-center md:justify-start order-2 md:order-1">
                        <div className="relative w-72 h-72 flex-shrink-0">
                            <div className="absolute -inset-1 rounded-2xl bg-accent/10 blur-sm" />
                            <img
                                src={avatar}
                                alt={name || 'Foto de perfil'}
                                width={288}
                                height={288}
                                loading="lazy"
                                decoding="async"
                                className="relative w-full h-full rounded-2xl object-cover border border-border shadow-lg"
                            />
                        </div>
                    </div>
                )}

                <div className={`order-1 ${avatar ? 'md:order-2' : ''}`}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-lg leading-tight text-text-primary">
                        Datos, código y visualización.
                    </h2>
                    {bio && (
                        <p className="text-text-secondary mb-xl leading-relaxed text-base md:text-lg">
                            {bio}
                        </p>
                    )}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-1.5 text-sm font-medium border border-border rounded-full text-text-secondary hover:border-accent/50 hover:text-accent transition-colors duration-200"
                                    style={{ backgroundColor: 'var(--color-surface-elevated)' }}
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