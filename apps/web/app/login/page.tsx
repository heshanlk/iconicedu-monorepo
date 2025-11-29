import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@iconicedu/ui-web';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-pane">
        <div className="stack gap-xs">
          <Badge variant="outline">ICONIC EDU</Badge>
          <h1 className="login-title">Sign in to your workspace</h1>
          <p className="login-text">
            Use your email to access messages, announcements, and class updates.
          </p>
        </div>

        <Card className="login-card">
          <CardHeader>
            <CardTitle>Continue with email</CardTitle>
            <CardDescription>We’ll send a magic link to your inbox.</CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <div className="stack gap-xs">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@school.edu" />
            </div>
            <Button className="w-full">Send magic link</Button>
          </CardContent>
        </Card>

        <div className="login-footnote">
          <span className="muted">Don’t have access?</span>
          <Button variant="ghost" size="sm" className="link-button">
            Request invite
          </Button>
        </div>
      </div>

      <div className="login-hero">
        <div className="login-hero-card">
          <h2>Stay synced with your classrooms</h2>
          <p>
            Parents, teachers, and advisors collaborate in one space. Track updates,
            share notes, and align on student progress.
          </p>
          <ul>
            <li>Fast announcements with magic links</li>
            <li>Role-based workspaces for staff and guardians</li>
            <li>Secure by default with audit trails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
