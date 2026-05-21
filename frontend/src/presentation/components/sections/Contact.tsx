'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
        .max(100, { message: 'El nombre no puede exceder 100 caracteres' }),
    email: z
        .string()
        .email({ message: 'Por favor ingresa un email válido' }),
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
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitMessage({ type: 'success', text: '¡Mensaje enviado exitosamente!' });
                reset();
            } else {
                setSubmitMessage({ type: 'error', text: 'Error al enviar el mensaje. Intenta nuevamente.' });
            }
        } catch {
            setSubmitMessage({ type: 'error', text: 'Error al conectar con el servidor.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contacto" className="py-4xl px-4 sm:px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="container max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-text-primary">Contacto</h2>
                <p className="text-center text-sm sm:text-base text-text-secondary mb-4xl">
                    ¿Tienes un proyecto en mente? ¡Hablemos!
                </p>

                {(email || location || linkedin || github || credly) && (
                    <div className="mb-4xl p-4 sm:p-lg rounded-xl border border-border"
                        style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-lg">
                            {email && (
                                <a href={`mailto:${email}`} className="flex items-center gap-3 sm:gap-md hover:text-accent transition-colors group">
                                    <svg className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 text-text-secondary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-text-tertiary">Email</p>
                                        <p className="font-medium text-text-primary truncate">{email}</p>
                                    </div>
                                </a>
                            )}
                            {location && (
                                <div className="flex items-center gap-3 sm:gap-md">
                                    <svg className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-text-tertiary">Ubicación</p>
                                        <p className="font-medium text-text-primary">{location}</p>
                                    </div>
                                </div>
                            )}
                            {linkedin && (
                                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-md hover:text-accent transition-colors group">
                                    <svg className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 text-text-secondary group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-text-tertiary">LinkedIn</p>
                                        <p className="font-medium text-text-primary">Ver Perfil</p>
                                    </div>
                                </a>
                            )}
                            {github && (
                                <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-md hover:text-accent transition-colors group">
                                    <svg className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 text-text-secondary group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-text-tertiary">GitHub</p>
                                        <p className="font-medium text-text-primary">Ver Repos</p>
                                    </div>
                                </a>
                            )}
                            {credly && (
                                <a href={credly} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-md hover:text-accent transition-colors group">
                                    <svg className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 text-text-secondary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-text-tertiary">Credenciales</p>
                                        <p className="font-medium text-text-primary">Ver Badges</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-lg">
                    {submitMessage && (
                        <div
                            role="alert"
                            aria-live="polite"
                            className={`p-3 sm:p-md rounded-lg text-sm sm:text-base ${
                                submitMessage.type === 'success'
                                    ? 'bg-[#34c759]/10 text-[#34c759]'
                                    : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                            }`}
                        >
                            {submitMessage.text}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 text-text-primary">
                            Nombre
                        </label>
                        <input
                            {...register('name')}
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Tu nombre…"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 text-text-primary">
                            Email
                        </label>
                        <input
                            {...register('email')}
                            id="email"
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
                            placeholder="tu@email.com"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1.5 text-text-primary">
                            Mensaje
                        </label>
                        <textarea
                            {...register('message')}
                            id="message"
                            placeholder="Tu mensaje aquí…"
                            rows={4}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
                            disabled={isSubmitting}
                        />
                        {errors.message && (
                            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-error)' }}>{errors.message.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-base bg-accent text-text-inverse hover:opacity-90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Enviando…' : 'Enviar Mensaje'}
                    </button>
                </form>
            </div>
        </section>
    );
}