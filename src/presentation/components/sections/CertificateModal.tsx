import { useEffect } from "react";
import { DownloadIcon, XMarkIcon } from "@presentation/components/ui/Icons";

interface CertificateModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

const CertificateModal = ({ title, url, onClose }: CertificateModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative bg-skin-primary rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-skin-border"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-skin-border bg-skin-secondary">
          <h3 className="text-lg font-bold text-skin-text truncate">{title}</h3>
          <div className="flex gap-2 flex-shrink-0">
            <a
              href={url}
              download
              className="px-4 py-2 bg-brand-primary text-skin-primary rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2 font-semibold"
            >
              <DownloadIcon className="w-4 h-4" />
              Descargar
            </a>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="px-4 py-2 bg-skin-primary text-skin-text border border-skin-border rounded-lg hover:border-brand-primary transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-[calc(90vh-80px)] overflow-auto bg-skin-secondary">
          <iframe
            src={url}
            className="w-full h-full"
            title={`Certificado: ${title}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
