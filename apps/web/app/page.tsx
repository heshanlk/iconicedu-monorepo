import { Badge, Button, H1, Lead } from '@iconicedu/ui-web';

export default function HomePage() {
  return (
    <div className="page">
      <section className="stack gap-lg">
        <div className="stack gap-xs">
          <div className="inline-badges">
            <Badge>Shadcn-inspired</Badge>
            <Badge variant="outline">Shared UI</Badge>
          </div>
          <H1>Welcome to ICONIC EDU</H1>
          <Lead>
            Console UI shared from <code>@iconicedu/ui-web</code>. Swap themes and
            components from a single design system.
          </Lead>
        </div>
        <div className="button-row">
          <Button>Sign in as Parent</Button>
          <Button variant="secondary">Sign in as Teacher</Button>
          <Button variant="ghost">Explore as Admin</Button>
        </div>
      </section>
    </div>
  );
}
