interface ErrorStateProps {
    message: string;
    repoUrl: string;
    onRetry: () => void;
}

export function ErrorState({ message, repoUrl, onRetry }: ErrorStateProps) {
    return (
        <div
            role="alert"
            className="rounded-sm border border-skin-border bg-skin-secondary p-lg text-center"
        >
            <p className="font-medium text-status-error">
                No se pudieron cargar los datos del dashboard.
            </p>
            <p className="mt-1 text-sm text-skin-muted">{message}</p>
            <div className="mt-md flex flex-wrap justify-center gap-sm">
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-full border border-skin-border-medium px-md py-xs text-sm font-medium text-skin-text transition-colors hover:bg-skin-tertiary"
                >
                    Reintentar
                </button>
                <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-md py-xs text-sm font-medium text-brand-primary hover:underline"
                >
                    Ver repositorio ↗
                </a>
            </div>
        </div>
    );
}
