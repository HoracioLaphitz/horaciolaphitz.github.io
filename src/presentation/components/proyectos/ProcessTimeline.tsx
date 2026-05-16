interface TimelineStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

function TimelineStep({ number, title, description, isLast }: TimelineStepProps) {
  return (
    <div className="flex gap-md">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-skin-accent text-white flex items-center justify-center font-semibold text-sm">
          {number}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-skin-border mt-xs" />}
      </div>
      <div className="flex-1 pb-lg">
        <h4 className="text-base font-semibold text-skin-primary mb-xs">{title}</h4>
        <p className="text-sm text-skin-muted">{description}</p>
      </div>
    </div>
  );
}

interface ProcessTimelineProps {
  steps: Array<{
    title: string;
    description: string;
  }>;
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="my-lg p-lg bg-skin-surface border border-skin-border rounded-xl">
      <h3 className="text-lg font-semibold text-skin-primary mb-lg">Proceso</h3>
      <div>
        {steps.map((step, index) => (
          <TimelineStep
            key={index}
            number={index + 1}
            title={step.title}
            description={step.description}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
