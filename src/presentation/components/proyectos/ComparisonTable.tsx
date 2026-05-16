interface ComparisonRow {
  label: string;
  before: string;
  after: string;
}

interface ComparisonTableProps {
  title?: string;
  rows: ComparisonRow[];
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonTable({
  title,
  rows,
  beforeLabel = 'Antes',
  afterLabel = 'Después',
}: ComparisonTableProps) {
  return (
    <div className="my-lg">
      {title && <h3 className="text-lg font-semibold text-skin-primary mb-md">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full border border-skin-border rounded-lg overflow-hidden">
          <thead className="bg-skin-surface">
            <tr>
              <th className="px-md py-sm text-left text-sm font-semibold text-skin-primary border-b border-skin-border">
                Métrica
              </th>
              <th className="px-md py-sm text-left text-sm font-semibold text-skin-primary border-b border-skin-border">
                {beforeLabel}
              </th>
              <th className="px-md py-sm text-left text-sm font-semibold text-skin-primary border-b border-skin-border">
                {afterLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-skin-surface/50 transition-colors"
              >
                <td className="px-md py-sm text-sm text-skin-primary border-b border-skin-border">
                  {row.label}
                </td>
                <td className="px-md py-sm text-sm text-skin-muted border-b border-skin-border">
                  {row.before}
                </td>
                <td className="px-md py-sm text-sm font-medium text-skin-accent border-b border-skin-border">
                  {row.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
