interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
}

export function QuoteBlock({ quote, author, role }: QuoteBlockProps) {
  return (
    <blockquote className="my-lg pl-lg border-l-4 border-skin-accent">
      <p className="text-base italic text-skin-primary mb-xs">{quote}</p>
      {(author || role) && (
        <footer className="text-sm text-skin-muted">
          {author && <span className="font-medium">{author}</span>}
          {author && role && <span> — </span>}
          {role && <span>{role}</span>}
        </footer>
      )}
    </blockquote>
  );
}
