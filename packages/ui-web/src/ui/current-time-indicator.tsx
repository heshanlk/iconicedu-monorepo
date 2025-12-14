import { cn } from '../lib/utils';

interface CurrentTimeIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  displayLabel?: boolean;
}

export function CurrentTimeIndicator({
  label = 'NOW',
  className,
  displayLabel = false,
  ...props
}: CurrentTimeIndicatorProps) {
  return (
    <div
      className={cn('absolute inset-x-0 top-0 flex items-center', className)}
      {...props}
    >
      <div className="h-px flex-1 bg-red-300" />
      {displayLabel && (
        <span className="px-1 text-[10px] font-semibold text-red-400">{label}</span>
      )}
      <div className="h-px flex-1 bg-red-300" />
    </div>
  );
}
