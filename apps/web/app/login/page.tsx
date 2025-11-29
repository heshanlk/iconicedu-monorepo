import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H1,
  Input,
  Label,
  Lead,
  Muted,
} from '@iconicedu/ui-web';

export default function LoginPage() {
  return (
    <div className="login-block">
      <div className="login-copy">
        <Badge variant="outline">ICONIC EDU</Badge>
        <H1>Welcome back</H1>
        <Lead>
          Sign in to your workspace to connect with parents, teachers, and advisors.
        </Lead>
        <Muted>New here? Request an invite from your admin.</Muted>
      </div>

      <Card className="login-card">
        <CardHeader className="stack gap-xs">
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Welcome back. Enter your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="stack gap-sm login-form">
            <div className="stack gap-xs">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.edu" />
            </div>
            <div className="stack gap-xs">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Continue</Button>
            <div className="login-divider">
              <span />
              <span className="muted">or</span>
              <span />
            </div>
            <Button variant="secondary" className="w-full">
              Continue with SSO
            </Button>
            <div className="login-footer">
              <Button variant="ghost">Forgot password?</Button>
              <Button variant="ghost">Request access</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
