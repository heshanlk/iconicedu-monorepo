import { Command } from 'lucide-react';

export function SiteLogo({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
      <Command className="size-4" />
    </div>
  );
}
