import { Button } from '../ui/Button';

interface Props {
    notebooks?: string[];
    pdfs?: string[];
    datasets?: string[];
}

function ResourceList({ items, label }: { items: string[]; label: string }) {
    return (
        <div>
            <h4 className="font-semibold mb-md">{label}</h4>
            <div className="space-y-sm">
                {items.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" download>
                        <Button variant="secondary" size="sm" className="w-full">
                            Descargar
                        </Button>
                    </a>
                ))}
            </div>
        </div>
    );
}

export function ResourceDownload({ notebooks, pdfs, datasets }: Props) {
    const hasResources = (notebooks?.length || 0) + (pdfs?.length || 0) + (datasets?.length || 0) > 0;

    if (!hasResources) {
        return null;
    }

    return (
        <section className="mt-4xl pt-4xl border-t border-border">
            <h3 className="text-2xl font-bold mb-lg">Recursos</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {notebooks && notebooks.length > 0 && (
                    <ResourceList items={notebooks} label="Notebooks" />
                )}

                {pdfs && pdfs.length > 0 && (
                    <ResourceList items={pdfs} label="PDFs" />
                )}

                {datasets && datasets.length > 0 && (
                    <ResourceList items={datasets} label="Datasets" />
                )}
            </div>
        </section>
    );
}
