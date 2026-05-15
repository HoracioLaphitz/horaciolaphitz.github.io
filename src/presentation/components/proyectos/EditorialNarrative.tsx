import type { ReactNode } from 'react';

/**
 * TÉCNICA 4: CONTRAPUNTO EDITORIAL
 * Rompe la estructura técnica con secciones narrativas usando tipografía Serif.
 * Humaniza el perfil técnico y transmite madurez profesional.
 */

interface NarrativeBlockProps {
    children: ReactNode;
    variant?: 'default' | 'highlight' | 'quote';
    className?: string;
}

export function NarrativeBlock({
    children,
    variant = 'default',
    className = '',
}: NarrativeBlockProps) {
    const variantStyles = {
        default: 'bg-skin-surface border-skin-border',
        highlight: 'bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 border-brand-primary/20',
        quote: 'bg-accent-primary/5 border-accent-primary/20 border-l-4',
    };

    return (
        <div
            className={`border rounded-xl p-xl ${variantStyles[variant]} ${className}`}
            style={{
                fontFamily: "'Charter', 'Georgia', 'Times New Roman', serif",
            }}
        >
            <div className="prose prose-lg max-w-none text-skin-primary leading-relaxed">
                {children}
            </div>
        </div>
    );
}

interface PhilosophySectionProps {
    title: string;
    content: string;
    author?: string;
    className?: string;
}

export function PhilosophySection({
    title,
    content,
    author,
    className = '',
}: PhilosophySectionProps) {
    return (
        <section className={`my-4xl ${className}`}>
            {/* Separador decorativo */}
            <div className="flex items-center gap-md mb-xl">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-skin-border to-transparent"></div>
                <div className="text-xs text-skin-muted uppercase tracking-widest font-mono">
                    Filosofía de Trabajo
                </div>
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-skin-border to-transparent"></div>
            </div>

            {/* Contenido narrativo */}
            <div className="max-w-3xl mx-auto">
                <h2
                    className="text-3xl font-normal text-skin-primary mb-lg leading-tight text-center"
                    style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                    }}
                >
                    {title}
                </h2>

                <div
                    className="text-lg text-skin-muted leading-loose text-justify"
                    style={{
                        fontFamily: "'Charter', 'Georgia', serif",
                        textIndent: '2em',
                    }}
                >
                    {content}
                </div>

                {author && (
                    <div className="mt-lg text-right">
                        <span
                            className="text-sm text-skin-muted italic"
                            style={{
                                fontFamily: "'Charter', 'Georgia', serif",
                            }}
                        >
                            — {author}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}

interface StorytellingHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    lead: string;
    className?: string;
}

export function StorytellingHeader({
    eyebrow,
    title,
    subtitle,
    lead,
    className = '',
}: StorytellingHeaderProps) {
    return (
        <header className={`max-w-3xl mx-auto text-center mb-4xl ${className}`}>
            {/* Eyebrow */}
            {eyebrow && (
                <div className="text-xs text-brand-primary uppercase tracking-widest font-mono mb-md">
                    {eyebrow}
                </div>
            )}

            {/* Título principal */}
            <h1
                className="text-5xl font-normal text-skin-primary mb-md leading-tight"
                style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                }}
            >
                {title}
            </h1>

            {/* Subtítulo */}
            {subtitle && (
                <h2
                    className="text-2xl font-light text-skin-muted mb-lg"
                    style={{
                        fontFamily: "'Charter', 'Georgia', serif",
                    }}
                >
                    {subtitle}
                </h2>
            )}

            {/* Lead/Bajada */}
            <p
                className="text-xl text-skin-muted leading-relaxed"
                style={{
                    fontFamily: "'Charter', 'Georgia', serif",
                }}
            >
                {lead}
            </p>

            {/* Separador decorativo */}
            <div className="mt-xl flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>
            </div>
        </header>
    );
}

interface PullQuoteProps {
    quote: string;
    author?: string;
    role?: string;
    size?: 'default' | 'large';
    className?: string;
}

export function PullQuote({
    quote,
    author,
    role,
    size = 'default',
    className = '',
}: PullQuoteProps) {
    const sizeStyles = {
        default: 'text-2xl',
        large: 'text-3xl md:text-4xl',
    };

    return (
        <blockquote
            className={`my-4xl py-xl border-l-4 border-brand-primary pl-xl ${className}`}
            style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
            }}
        >
            <p className={`${sizeStyles[size]} font-normal text-skin-primary leading-snug mb-md italic`}>
                "{quote}"
            </p>
            {(author || role) && (
                <footer
                    className="text-base text-skin-muted"
                    style={{
                        fontFamily: "'Charter', 'Georgia', serif",
                    }}
                >
                    {author && <cite className="not-italic font-medium">— {author}</cite>}
                    {role && <span className="block text-sm mt-xs">{role}</span>}
                </footer>
            )}
        </blockquote>
    );
}

interface DropCapParagraphProps {
    children: string;
    className?: string;
}

export function DropCapParagraph({ children, className = '' }: DropCapParagraphProps) {
    const firstLetter = children.charAt(0);
    const restOfText = children.slice(1);

    return (
        <p
            className={`text-lg text-skin-muted leading-loose ${className}`}
            style={{
                fontFamily: "'Charter', 'Georgia', serif",
            }}
        >
            <span
                className="float-left text-6xl font-bold text-brand-primary leading-none mr-sm mt-xs"
                style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                }}
            >
                {firstLetter}
            </span>
            {restOfText}
        </p>
    );
}

interface AboutMeSectionProps {
    title: string;
    paragraphs: string[];
    image?: string;
    className?: string;
}

export function AboutMeSection({ title, paragraphs, image, className = '' }: AboutMeSectionProps) {
    return (
        <section className={`my-4xl ${className}`}>
            <div className="max-w-4xl mx-auto">
                {/* Título con tipografía Serif */}
                <h2
                    className="text-4xl font-normal text-skin-primary mb-xl text-center"
                    style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                    }}
                >
                    {title}
                </h2>

                {/* Grid con imagen opcional */}
                <div className={`grid ${image ? 'md:grid-cols-[300px_1fr]' : 'grid-cols-1'} gap-xl`}>
                    {image && (
                        <div className="flex justify-center md:justify-start">
                            <img
                                src={image}
                                alt="Profile"
                                className="w-64 h-64 rounded-2xl object-cover border-4 border-skin-border shadow-lg"
                            />
                        </div>
                    )}

                    {/* Contenido narrativo */}
                    <div className="space-y-lg">
                        {paragraphs.map((paragraph, idx) => (
                            <p
                                key={idx}
                                className="text-lg text-skin-muted leading-loose text-justify"
                                style={{
                                    fontFamily: "'Charter', 'Georgia', serif",
                                    textIndent: idx === 0 ? '2em' : '0',
                                }}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface SerifHeadingProps {
    level: 1 | 2 | 3 | 4;
    children: ReactNode;
    className?: string;
}

export function SerifHeading({ level, children, className = '' }: SerifHeadingProps) {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
    const sizes = {
        1: 'text-5xl',
        2: 'text-4xl',
        3: 'text-3xl',
        4: 'text-2xl',
    };

    return (
        <Tag
            className={`${sizes[level]} font-normal text-skin-primary leading-tight ${className}`}
            style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
            }}
        >
            {children}
        </Tag>
    );
}
