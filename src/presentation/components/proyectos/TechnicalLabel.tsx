/**
 * TÉCNICA 2: ETIQUETADO DOCUMENTAL TÉCNICO
 * Sistema de nomenclatura que simula informes de ingeniería o archivos de investigación.
 * Refuerza la percepción de rigor y atención al detalle.
 */

interface TechnicalLabelProps {
    section: string;
    subsection?: string;
    version?: string;
    className?: string;
}

export function TechnicalLabel({
    section,
    subsection,
    version,
    className = '',
}: TechnicalLabelProps) {
    return (
        <div className={`flex items-center gap-sm text-xs font-mono ${className}`}>
            <span className="text-skin-muted uppercase tracking-wider">
                {section}
                {subsection && ` // ${subsection}`}
            </span>
            {version && (
                <span className="px-sm py-xs bg-brand-primary/10 text-brand-primary rounded-md">
                    v{version}
                </span>
            )}
        </div>
    );
}

interface DocumentHeaderProps {
    title: string;
    section: string;
    version?: string;
    date?: string;
    status?: 'draft' | 'review' | 'published';
    className?: string;
}

export function DocumentHeader({
    title,
    section,
    version = '1.0.0',
    date,
    status = 'published',
    className = '',
}: DocumentHeaderProps) {
    const statusColors = {
        draft: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        review: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        published: 'bg-green-500/10 text-green-600 border-green-500/20',
    };

    const statusLabels = {
        draft: 'DRAFT',
        review: 'IN REVIEW',
        published: 'PUBLISHED',
    };

    return (
        <div className={`border-b border-skin-border pb-lg mb-xl ${className}`}>
            {/* Metadata técnica */}
            <div className="flex items-center justify-between mb-md">
                <TechnicalLabel section={section} version={version} />
                <div className="flex items-center gap-md">
                    {date && (
                        <time className="text-xs text-skin-muted font-mono">
                            {new Date(date).toISOString().split('T')[0]}
                        </time>
                    )}
                    <span
                        className={`text-xs font-mono px-sm py-xs border rounded-md ${statusColors[status]}`}
                    >
                        {statusLabels[status]}
                    </span>
                </div>
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold text-skin-primary leading-tight">{title}</h1>
        </div>
    );
}

interface MetadataBlockProps {
    data: Record<string, string | number>;
    className?: string;
}

export function MetadataBlock({ data, className = '' }: MetadataBlockProps) {
    return (
        <div className={`bg-skin-surface border border-skin-border rounded-lg p-md ${className}`}>
            <div className="text-xs font-mono text-skin-muted uppercase tracking-wider mb-sm">
                METADATA
            </div>
            <dl className="space-y-xs">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                        <dt className="text-skin-muted font-mono">{key}:</dt>
                        <dd className="text-skin-primary font-medium">{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

interface ExecutionTimeProps {
    time: string;
    unit?: 'ms' | 's' | 'min';
    label?: string;
    className?: string;
}

export function ExecutionTime({
    time,
    unit = 'ms',
    label = 'Execution Time',
    className = '',
}: ExecutionTimeProps) {
    return (
        <div
            className={`inline-flex items-center gap-sm px-sm py-xs bg-skin-surface border border-skin-border rounded-md ${className}`}
        >
            <span className="text-xs text-skin-muted font-mono">{label}:</span>
            <span className="text-xs text-brand-primary font-mono font-bold">
                {time}
                {unit}
            </span>
        </div>
    );
}

interface FileReferenceProps {
    filename: string;
    path?: string;
    size?: string;
    modified?: string;
    className?: string;
}

export function FileReference({
    filename,
    path,
    size,
    modified,
    className = '',
}: FileReferenceProps) {
    return (
        <div
            className={`bg-skin-surface border border-skin-border rounded-lg p-md font-mono ${className}`}
        >
            <div className="flex items-center justify-between mb-xs">
                <div className="flex items-center gap-xs">
                    <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm text-skin-primary font-medium">{filename}</span>
                </div>
                {size && <span className="text-xs text-skin-muted">{size}</span>}
            </div>
            {path && <div className="text-xs text-skin-muted mb-xs">{path}</div>}
            {modified && (
                <div className="text-xs text-skin-muted">
                    Modified: {new Date(modified).toLocaleString()}
                </div>
            )}
        </div>
    );
}

interface VersionBadgeProps {
    version: string;
    changelog?: string;
    className?: string;
}

export function VersionBadge({ version, changelog, className = '' }: VersionBadgeProps) {
    return (
        <div className={`inline-flex items-center gap-xs ${className}`}>
            <span className="px-sm py-xs bg-brand-primary/10 text-brand-primary rounded-md text-xs font-mono font-bold">
                v{version}
            </span>
            {changelog && (
                <a
                    href={changelog}
                    className="text-xs text-skin-muted hover:text-brand-primary transition-colors"
                >
                    changelog
                </a>
            )}
        </div>
    );
}
