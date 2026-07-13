import { DocumentIcon, DownloadIcon, BookOpenIcon, DatabaseIcon } from "@presentation/components/ui/Icons";

interface Resource {
  name: string;
  path: string;
  description?: string;
}

interface ResourceDownloadProps {
  notebooks?: Resource[];
  pdfs?: Resource[];
  datasets?: Resource[];
}

const getIcon = (type: "notebook" | "pdf" | "dataset") => {
  switch (type) {
    case "notebook":
      return <BookOpenIcon className="w-5 h-5" />;
    case "pdf":
      return <DocumentIcon className="w-5 h-5" />;
    case "dataset":
      return <DatabaseIcon className="w-5 h-5" />;
  }
};

const ResourceItem = ({
  resource,
  type,
}: {
  resource: Resource;
  type: "notebook" | "pdf" | "dataset";
}) => (
  <a
    href={resource.path}
    download
    className="flex items-center gap-3 p-4 rounded-lg border border-skin-border bg-skin-surface hover:bg-skin-surface-hover transition-colors group"
  >
    <div className="flex-shrink-0 text-skin-accent">{getIcon(type)}</div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-skin-primary group-hover:text-skin-accent transition-colors truncate">
        {resource.name}
      </p>
      {resource.description && (
        <p className="text-sm text-skin-muted mt-1">{resource.description}</p>
      )}
    </div>
    <DownloadIcon className="w-4 h-4 text-skin-muted group-hover:text-skin-accent transition-colors flex-shrink-0" />
  </a>
);

export function ResourceDownload({
  notebooks,
  pdfs,
  datasets,
}: ResourceDownloadProps) {
  const hasResources = notebooks?.length || pdfs?.length || datasets?.length;

  if (!hasResources) return null;

  return (
    <div className="mt-12 p-6 rounded-2xl bg-skin-surface border border-skin-border">
      <h2 className="text-2xl font-bold text-skin-primary mb-6">
        Recursos
      </h2>

      <div className="space-y-6">
        {notebooks && notebooks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-skin-accent" />
              Notebooks Jupyter
            </h3>
            <div className="space-y-2">
              {notebooks.map((notebook, idx) => (
                <ResourceItem key={idx} resource={notebook} type="notebook" />
              ))}
            </div>
          </div>
        )}

        {pdfs && pdfs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2">
              <DocumentIcon className="w-5 h-5 text-skin-accent" />
              Documentos PDF
            </h3>
            <div className="space-y-2">
              {pdfs.map((pdf, idx) => (
                <ResourceItem key={idx} resource={pdf} type="pdf" />
              ))}
            </div>
          </div>
        )}

        {datasets && datasets.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-skin-primary mb-3 flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5 text-skin-accent" />
              Datasets
            </h3>
            <div className="space-y-2">
              {datasets.map((dataset, idx) => (
                <ResourceItem key={idx} resource={dataset} type="dataset" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
