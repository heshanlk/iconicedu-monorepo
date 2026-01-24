'use client';

import * as React from 'react';
import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iconicedu/ui-web';

import { inviteAdminUserAction } from './actions/invite-user';

export function InviteUserDialog({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [profileKind, setProfileKind] =
    React.useState<'guardian' | 'educator' | 'staff'>('guardian');
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setErrorMessage(null);
      formRef.current?.reset();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    try {
      await inviteAdminUserAction(formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to send invite at this time.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateLink = async () => {
    const emailFromForm = formRef.current
      ?.querySelector<HTMLInputElement>('input[name="email"]')
      ?.value.trim();
    if (!emailFromForm) {
      setErrorMessage('Enter an email address before generating a link.');
      return;
    }

    const formData = new FormData();
    formData.set('email', emailFromForm);
    formData.set('profileKind', profileKind);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await inviteAdminUserAction(formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
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
            <Label htmlFor="invite-kind">Type</Label>
            <Select
              name="profileKind"
              value={profileKind}
              onValueChange={(value) =>
                setProfileKind(value as 'guardian' | 'educator' | 'staff')
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="invite-kind" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['guardian', 'educator', 'staff'] as const).map((kind) => (
                  <SelectItem key={kind} value={kind}>
                    <span className="capitalize">{kind}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
          <DialogFooter className="space-x-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleGenerateLink}
              disabled={isSubmitting}
            >
              Generate link
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send magic link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
