// Componentes originales
export { ProjectMetrics } from './ProjectMetrics';
export { TechStack } from './TechStack';
export { InsightCard, InsightList } from './InsightCard';
export { ProcessTimeline } from './ProcessTimeline';
export { ResultsShowcase } from './ResultsShowcase';
export { FeatureGrid } from './FeatureGrid';
export { CalloutBox } from './CalloutBox';
export { ComparisonTable } from './ComparisonTable';
export { QuoteBlock } from './QuoteBlock';
export { ResourceDownload } from './ResourceDownload';

// TÉCNICA 1: Bento Grid 2.0
export {
    BentoGrid,
    BentoItem,
    ProjectHighlight,
    TechStackBlock,
    StatBlock,
    QuickLinkBlock,
} from './BentoGrid';

// TÉCNICA 2: Etiquetado Documental Técnico
export {
    TechnicalLabel,
    DocumentHeader,
    MetadataBlock,
    ExecutionTime,
    FileReference,
    VersionBadge,
} from './TechnicalLabel';

// TÉCNICA 3: Divulgación Progresiva
export {
    ExpandableSection,
    TechnicalDeepDive,
    DocumentationLink,
    LayeredContent,
} from './ProgressiveDisclosure';

// TÉCNICA 4: Contrapunto Editorial
export {
    NarrativeBlock,
    PhilosophySection,
    StorytellingHeader,
    PullQuote,
    DropCapParagraph,
    AboutMeSection,
    SerifHeading,
} from './EditorialNarrative';

// TÉCNICA 5: Scroll-Driven Storytelling
export {
    ScrollReveal,
    ScrollProgressBar,
    TransformOnScroll,
    DataVisualizationStory,
    ParallaxSection,
    CountUp,
    StaggeredList,
} from './ScrollDrivenStory';

// WILDCARD: Micro-interacciones
export {
    GlowButton,
    MagneticButton,
    AnimatedLink,
    PulseIcon,
    RippleButton,
    ShimmerText,
    HoverScale,
} from './MicroInteractions';

interface ProjectSectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function ProjectSection({ title, children, className = '' }: ProjectSectionProps) {
    return (
        <section className={`my-xl ${className}`}>
            {title && (
                <h2 className="text-2xl font-bold text-skin-primary mb-lg border-b border-skin-border pb-sm">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}

interface ProjectHeaderProps {
    title: string;
    description: string;
    tags?: string[];
    date?: string;
}

export function ProjectHeader({ title, description, tags, date }: ProjectHeaderProps) {
    return (
        <header className="mb-xl">
            <h1 className="text-4xl font-bold text-skin-primary mb-md">{title}</h1>
            <p className="text-lg text-skin-muted mb-md">{description}</p>
            {(tags || date) && (
                <div className="flex flex-wrap items-center gap-md">
                    {date && (
                        <time className="text-sm text-skin-muted">
                            {new Date(date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-xs">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-sm py-xs text-xs font-medium bg-skin-accent/10 text-skin-accent rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
