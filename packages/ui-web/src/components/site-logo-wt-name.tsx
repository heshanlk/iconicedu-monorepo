import { SiteLogo } from './site-logo';
import { cn } from '../lib/utils';

export function SiteLogoWithName({ className }: { className?: string }) {
  return (
    <>
      {/* <SiteLogo className="border-0" /> */}
      <div className="flex aspect-square items-center justify-center rounded-lg">
        <SiteLogo className={cn('!size-6', className)} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">ICONIC Academy</span>
        <span className="truncate text-xs">Turn effort into outcomes</span>
      </div>
    </>
  );
}
