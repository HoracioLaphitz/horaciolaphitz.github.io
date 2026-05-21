import React from 'react';
import type { ProjectEntry } from '@infrastructure/utils/projectScanner';
import { useProjects } from '@presentation/hooks/useProjects';

interface ProjectsInjectorProps {
    locale?: string;
}

export default function ProjectsInjector({
    locale = 'es',
}: ProjectsInjectorProps): React.ReactElement {
    const { projects, loading, error } = useProjects({ locale });

    if (error) {
        return (
            <div
                className="w-full rounded-lg bg-red-50 p-4 text-red-800"
                role="alert"
                aria-live="polite"
            >
                <h3 className="font-semibold">
                    {locale === 'es' ? 'Error cargando proyectos' : 'Error loading projects'}
                </h3>
                <p className="mt-1 text-sm">{error.message}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div
                className="flex items-center justify-center py-12"
                role="status"
                aria-live="polite"
            >
                <div className="space-y-4 w-full">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-48 w-full animate-pulse rounded-lg bg-gray-200"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-600">
                <p>
                    {locale === 'es'
                        ? 'No hay proyectos disponibles.'
                        : 'No projects available.'}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        locale={locale}
                    />
                ))}
            </div>
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectEntry;
    locale: string;
}

function ProjectCard({
    project,
    locale,
}: ProjectCardProps): React.ReactElement {
    const isPdf = project.pdfUrl && project.pdfUrl.endsWith('.pdf');

    return (
        <article
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            aria-label={project.title}
        >
            {/* Thumbnail */}
            {project.thumbnail && !isPdf && (
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            )}

            {/* PDF Icon Placeholder */}
            {isPdf && (
                <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                    <svg
                        className="h-16 w-16 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <text
                            x="12"
                            y="16"
                            textAnchor="middle"
                            className="text-xs font-bold fill-red-500"
                        >
                            PDF
                        </text>
                    </svg>
                </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="mb-3 line-clamp-3 flex-1 text-sm text-gray-600">
                    {project.summary || project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{project.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto space-y-2">
                    {isPdf ? (
                        <>
                            {project.size && (
                                <p className="text-xs text-gray-500">
                                    {locale === 'es' ? 'Tamaño' : 'Size'}: {project.size}
                                </p>
                            )}
                            <a
                                href={project.pdfUrl}
                                download
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                                aria-label={`${locale === 'es' ? 'Descargar PDF' : 'Download PDF'}: ${project.title}`}
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                {locale === 'es' ? 'Descargar' : 'Download'}
                            </a>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 rounded-md bg-green-500 px-3 py-2 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                                    aria-label={`${locale === 'es' ? 'Ver demo' : 'View demo'} - ${project.title}`}
                                >
                                    {locale === 'es' ? 'Demo' : 'Demo'}
                                </a>
                            )}
                            {project.repoUrl && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                    aria-label={`${locale === 'es' ? 'Ver repositorio' : 'View repository'} - ${project.title}`}
                                >
                                    {locale === 'es' ? 'Repo' : 'Repo'}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
