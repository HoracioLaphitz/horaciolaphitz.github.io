import { useState } from "react";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    icon?: React.ReactNode;
}

export const AccordionItem = ({ title, children, defaultOpen = false, icon }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-skin-border rounded-lg overflow-hidden bg-skin-secondary">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-skin-tertiary/30 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-skin-accent">{icon}</span>}
                    <h3 className="text-lg sm:text-xl font-bold text-skin-text">{title}</h3>
                </div>
                <svg
                    className={`w-5 h-5 text-skin-accent transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface AccordionProps {
    children: React.ReactNode;
    className?: string;
}

export const Accordion = ({ children, className = "" }: AccordionProps) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {children}
        </div>
    );
};
