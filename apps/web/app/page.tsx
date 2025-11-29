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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@iconicedu/ui-web';

export default function HomePage() {
  return (
    <div className="page">
      <section className="stack gap-lg">
        <div className="stack gap-xs">
          <div className="inline-badges">
            <Badge>Shadcn-inspired</Badge>
            <Badge variant="outline">Shared UI</Badge>
          </div>
          <h1 className="hero-title">Welcome to ICONIC EDU</h1>
          <p className="hero-text">
            Console UI shared from <code>@iconicedu/ui-web</code>. Swap themes and
            components from a single design system.
          </p>
        </div>
        <div className="button-row">
          <Button>Sign in as Parent</Button>
          <Button variant="secondary">Sign in as Teacher</Button>
          <Button variant="ghost">Explore as Admin</Button>
        </div>
      </section>

      <section className="form-grid">
        <Card>
          <CardHeader>
            <CardTitle>Quick Message</CardTitle>
            <CardDescription>Send an update to a class, guardian, or staff.</CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <div className="stack gap-xs">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Afternoon reminders" />
            </div>
            <div className="stack gap-xs">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                placeholder="Share details about schedules, supplies, or events..."
              />
            </div>
            <div className="button-row">
              <Button>Send</Button>
              <Button variant="secondary">Save draft</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs Example</CardTitle>
            <CardDescription>Switch content without reflowing the layout.</CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <Tabs defaultValue="parents">
              <TabsList>
                <TabsTrigger value="parents">Parents</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="advisors">Advisors</TabsTrigger>
              </TabsList>
              <TabsContent value="parents">
                Parents receive attendance, grades, and behavior updates in one feed.
              </TabsContent>
              <TabsContent value="teachers">
                Teachers can share lesson plans, reminders, and quick messages.
              </TabsContent>
              <TabsContent value="advisors">
                Advisors keep students on track with goals and meeting notes.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <section className="card-grid">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>
              Highlight updates for parents, teachers, and advisors.
            </CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <Button>New Message</Button>
            <Button variant="secondary">Schedule</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage enrollments, classes, and guardians.</CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <Button>View Roster</Button>
            <Button variant="ghost">Invite Guardian</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure roles, notifications, and branding.</CardDescription>
          </CardHeader>
          <CardContent className="stack gap-sm">
            <Button variant="secondary">Access Control</Button>
            <Button variant="ghost">Branding</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
