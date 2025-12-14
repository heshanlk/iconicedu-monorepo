import { SiteLogo } from './site-logo';

export function SiteLogoWithName({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <>
      <SiteLogo className="border-0" />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">ICONIC Academy</span>
        <span className="truncate text-xs">Turn effort into outcomes</span>
      </div>
    </>
  );
}
