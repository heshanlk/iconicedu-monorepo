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
    <div className="login-block">
      <div className="login-copy">
        <Badge variant="outline">ICONIC EDU</Badge>
        <h1 className="login-heading">Welcome back</h1>
        <p className="login-subheading">
          Sign in to your workspace to connect with parents, teachers, and advisors.
        </p>
        <p className="login-meta">New here? Request an invite from your admin.</p>
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
            <Button variant="" className="w-full">
              Continue
            </Button>
            <div className="login-divider">
              <span />
              <span className="muted">or</span>
              <span />
            </div>
            <Button variant="secondary" className="w-full">
              Continue with SSO
            </Button>
            <div className="login-footer">
              <Button variant="ghost" className="link-button">
                Forgot password?
              </Button>
              <Button variant="ghost" className="link-button">
                Request access
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
