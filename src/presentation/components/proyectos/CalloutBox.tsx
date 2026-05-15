interface CalloutBoxProps {
  type?: 'info' | 'success' | 'warning' | 'highlight';
  title?: string;
  children: React.ReactNode;
}

export function CalloutBox({ type = 'info', title, children }: CalloutBoxProps) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    highlight: 'bg-skin-accent/5 border-skin-accent text-skin-primary',
  };

  return (
    <div className={`my-lg p-md border-l-4 rounded-r-lg ${typeStyles[type]}`}>
      {title && <h4 className="font-semibold mb-xs">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
