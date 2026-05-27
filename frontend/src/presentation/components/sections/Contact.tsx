'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@infrastructure/api/client';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { message: 'El nombre no puede exceder 100 caracteres' }),
  email: z.string().email({ message: 'Por favor ingresa un email válido' }),
  message: z
    .string()
    .min(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
    .max(5000, { message: 'El mensaje no puede exceder 5000 caracteres' }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactInfo {
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  credly?: string;
}

interface Props {
  contactInfo?: ContactInfo;
}

export function Contact({ contactInfo = {} }: Props) {
  const { email, location, linkedin, github, credly } = contactInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await api.post('/contact', data);
      setSubmitMessage({ type: 'success', text: 'Mensaje recibido. Te respondo a la brevedad.' });
      reset();
    } catch {
      setSubmitMessage({ type: 'error', text: 'Error al enviar el mensaje. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-3xl md:py-4xl lg:py-5xl px-2 sm:px-4">
      <div className="container max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="text-center mb-4xl">

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-md"
            style={{ color: 'var(--color-text-primary)' }}>
            Contacto
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            ¡Hablemos!
          </p>
        </div>

        {(email || location || linkedin || github || credly) && (
          <div className="glass rounded-2xl p-xl mb-xl animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 sm:gap-md transition-colors group"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Email</p>
                    <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{email}</p>
                  </div>
                </a>
              )}
              {location && (
                <div className="flex items-center gap-3 sm:gap-md">
                  <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Ubicación</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{location}</p>
                  </div>
                </div>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-md transition-colors group"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065m1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>LinkedIn</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Ver Perfil</p>
                  </div>
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-md transition-colors group"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>GitHub</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Ver Repos</p>
                  </div>
                </a>
              )}
              {credly && (
                <a
                  href={credly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 sm:gap-md transition-colors group"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Credenciales</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Ver Badges</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-xl animate-fade-in-up animate-delay-200">
          {submitMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="p-md rounded-xl text-sm mb-lg"
              style={{
                backgroundColor: submitMessage.type === 'success'
                  ? 'var(--color-success)'
                  : 'var(--color-error)',
                color: '#ffffff',
                opacity: 0.15,
              }}
            >
              <span style={{ opacity: 1 }}>{submitMessage.text}</span>
            </div>
          )}

          <div className="space-y-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-primary)' }}>
                Nombre
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre…"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border)',
                }}
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-primary)' }}>
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="tu@email.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border)',
                }}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-primary)' }}>
                Mensaje
              </label>
              <textarea
                {...register('message')}
                id="message"
                placeholder="Tu mensaje aquí…"
                rows={4}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 resize-none disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border)',
                }}
              />
              {errors.message && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3.5 text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-text-inverse)',
                boxShadow: '0 4px 14px color-mix(in srgb, var(--color-accent) 25%, transparent)',
              }}
            >
              {isSubmitting ? 'Enviando…' : 'Enviar Mensaje'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
