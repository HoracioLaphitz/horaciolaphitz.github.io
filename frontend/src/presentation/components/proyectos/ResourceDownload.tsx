import { Button } from '../ui/Button';

interface Props {
    notebooks?: string[];
    pdfs?: string[];
    datasets?: string[];
}

export function ResourceDownload({ notebooks, pdfs, datasets }: Props) {
    const hasResources = (notebooks?.length || 0) + (pdfs?.length || 0) + (datasets?.length || 0) > 0;

    if (!hasResources) {
        return null;
    }

    return (
        <section className="mt-4xl pt-4xl border-t border-light-border dark:border-dark-border">
            <h3 className="text-2xl font-bold mb-lg">Recursos</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {notebooks && notebooks.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-md">Notebooks</h4>
                        <div className="space-y-sm">
                            {notebooks.map((url, i) => (
                                <Button key={i} variant="secondary" size="sm" className="w-full">
                                    Descargar
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {pdfs && pdfs.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-md">PDFs</h4>
                        <div className="space-y-sm">
                            {pdfs.map((url, i) => (
                                <Button key={i} variant="secondary" size="sm" className="w-full">
                                    Descargar
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {datasets && datasets.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-md">Datasets</h4>
                        <div className="space-y-sm">
                            {datasets.map((url, i) => (
                                <Button key={i} variant="secondary" size="sm" className="w-full">
                                    Descargar
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
