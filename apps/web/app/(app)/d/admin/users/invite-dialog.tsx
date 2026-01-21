'use client';

import * as React from 'react';
import { Copy } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@iconicedu/ui-web';

import { inviteAdminUserAction } from './actions/invite-user';

export function InviteUserDialog({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [lastEmail, setLastEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [profileKind, setProfileKind] = React.useState<'guardian' | 'educator' | 'staff'>('staff');
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setStatus('idle');
      setErrorMessage(null);
      setInviteUrl(null);
      setCopied(false);
      setLastEmail('');
      formRef.current?.reset();
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch {
      setErrorMessage('Unable to copy the invite link.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('pending');
    setErrorMessage(null);
    setCopied(false);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await inviteAdminUserAction(formData);
      setInviteUrl(result.inviteUrl);
      setLastEmail(result.email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to send invite at this time.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className ?? 'flex items-center gap-2'}
          type="button"
        >
          <Copy className="size-4" />
          Invite users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Invite guardians, educators, or staff</DialogTitle>
          <DialogDescription>
            Send a magic link or copy the invite URL to share it manually.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              required
              disabled={isSubmitting}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="invite-kind">Profile kind</Label>
            <input type="hidden" name="profileKind" value={profileKind} />
            <RadioGroup
              id="invite-kind"
              name="profileKind"
              value={profileKind}
              onValueChange={(value) => setProfileKind(value as 'guardian' | 'educator' | 'staff')}
              className="flex flex-wrap gap-3"
            >
              {(['guardian', 'educator', 'staff'] as const).map((kind) => {
                const itemId = `invite-kind-${kind}`;
                return (
                  <div key={kind} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={kind}
                      id={itemId}
                      className="h-4 w-4 rounded-full border border-input focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={itemId} className="text-sm capitalize">
                      {kind}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          {status === 'success' && inviteUrl ? (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm font-medium text-foreground">
                Magic link sent to{' '}
                <span className="font-semibold text-muted-foreground">{lastEmail}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  Copy invite link
                </Button>
                <a
                  href={inviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Preview link
                </a>
                {copied && <span className="text-xs text-muted-foreground">Copied!</span>}
              </div>
            </div>
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send magic link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
