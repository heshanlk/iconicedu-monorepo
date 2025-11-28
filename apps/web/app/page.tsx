import { Button } from '@iconicedu/ui-web';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to ICONIC EDU
        </h1>
        <p className="max-w-xl text-sm text-slate-300">
          This is the shared console for parents, teachers, advisors, staff, and admins.
          Start by wiring Supabase auth and pointing the apps to your project URL and keys.
        </p>
      </section>
      <section className="flex gap-3">
        <Button>Sign in as Parent</Button>
        <Button variant="secondary">Sign in as Teacher</Button>
        <Button variant="ghost">Explore as Admin</Button>
      </section>
    </div>
  );
}
