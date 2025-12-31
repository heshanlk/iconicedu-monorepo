import { Badge, Button, H1, H2, H3, Lead } from '@iconicedu/ui-web';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Shadcn-inspired</Badge>
            <Badge variant="outline">Shared UI</Badge>
          </div>
          <H1>Welcome to ICONIC EDU</H1>
          <Lead>
            Console UI shared from <code>@iconicedu/ui-web</code>. Swap themes and
            components from a single design system.
          </Lead>
          <H2>The People of the Kingdom</H2>
          <H3>The Joke Tax</H3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>Sign in as Parent</Button>
          <Button variant="secondary">Sign in as Teacher</Button>
          <Button variant="ghost">Explore as Admin</Button>
        </div>
      </section>
    </div>
  );
}
