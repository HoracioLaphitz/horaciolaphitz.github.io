import { useState } from "react";
import { useScrollAnimation } from "@presentation/hooks/useScrollAnimation";
import { AwardIcon } from "@presentation/components/ui/Icons";
import {
  CERTIFICATIONS,
  CREDLY_BADGES,
  TANGO_BADGES,
  type Certification,
} from "@data/certifications";
import CertificateModal from "./CertificateModal";

const ISSUER_ORDER = [
  "Google",
  "IBM",
  "Stanford",
  "Udemy",
  "Databricks",
  "Domestika",
  "Silicon Misiones",
];

const Certifications = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const groups = ISSUER_ORDER.map((issuer) => ({
    issuer,
    certs: CERTIFICATIONS.filter((cert) => cert.issuer === issuer).sort(
      (a, b) => b.sortDate.getTime() - a.sortDate.getTime()
    ),
  })).filter((group) => group.certs.length > 0);

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id="certifications"
      className="bg-skin-primary py-20 md:py-28"
    >
      <div className="mx-auto max-w-content px-6">
        <div
          className={`mb-16 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          <h2
            className="text-display-sm font-bold text-skin-text tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Certificaciones
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, gi) => (
            <div
              key={group.issuer}
              className={`transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              style={{ transitionDelay: `${gi * 60}ms` }}
            >
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-skin-muted">
                {group.issuer}
              </h3>
              <div className="flex flex-col gap-2">
                {group.certs.map((cert) =>
                  cert.certificateUrl ? (
                    <button
                      key={`${cert.title}-${cert.period}`}
                      onClick={() => setSelectedCert(cert)}
                      className="rounded-lg border border-skin-border bg-skin-secondary px-3 py-2 text-left transition-colors duration-200 hover:border-skin-border-medium"
                    >
                      <span className="block text-sm font-medium text-skin-text">
                        {cert.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-skin-muted">
                        {cert.period}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={`${cert.title}-${cert.period}`}
                      className="rounded-lg border border-skin-border bg-skin-secondary px-3 py-2"
                    >
                      <span className="block text-sm font-medium text-skin-text">
                        {cert.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-skin-muted">
                        {cert.period}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div
          className={`mt-16 border-t border-skin-border pt-12 transition-all duration-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-skin-muted">
            Insignias
          </h3>
          <div className="flex flex-wrap items-start gap-4">
            {CREDLY_BADGES.map((badge) => (
              <a
                key={badge.id}
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-skin-border bg-skin-secondary px-4 py-2 text-sm font-medium text-skin-text transition-colors duration-200 hover:border-skin-border-medium"
              >
                <AwardIcon className="h-4 w-4 text-skin-muted" />
                {badge.label}
              </a>
            ))}

            {TANGO_BADGES.map((badge) => (
              <div
                key={badge.image}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={badge.image}
                  alt={badge.label}
                  loading="lazy"
                  className="h-20 w-auto object-contain"
                />
                <span className="text-xs text-skin-muted">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCert?.certificateUrl && (
        <CertificateModal
          title={selectedCert.title}
          url={selectedCert.certificateUrl}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </section>
  );
};

export default Certifications;
