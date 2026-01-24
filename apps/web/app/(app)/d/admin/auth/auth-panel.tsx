'use client';

import * as React from 'react';

import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iconicedu/ui-web';
import { cn } from '@iconicedu/ui-web/lib/utils';

import type { GenerateLinkParams } from '@supabase/auth-js';

import {
  AuthAdminActionResult,
  createOAuthClientAction,
  deleteOAuthClientAction,
  deleteUserAction,
  deleteUserFactorAction,
  generateEmailLinkAction,
  getOAuthClientAction,
  inviteUserByEmailAction,
  listUserFactorsAction,
  regenerateOAuthClientSecretAction,
  retrieveUserAction,
  signOutUserAction,
  updateOAuthClientAction,
  updateUserAction,
  createUserAction,
} from './actions';

type AuthAdminPanelProps = {
  users: { id: string; email?: string | null; role?: string | null }[];
  oauthClients: { id: string; name?: string | null }[];
};

type ActionKey =
  | "create-user"
  | "update-user"
  | "delete-user"
  | "retrieve-user"
  | "invite-user"
  | "generate-link"
  | "sign-out-user"
  | "list-factors"
  | "delete-factor"
  | "get-oauth-client"
  | "create-oauth-client"
  | "update-oauth-client"
  | "delete-oauth-client"
  | "regenerate-oauth-client-secret";

const actionMessage = (status?: AuthAdminActionResult) => {
  if (!status) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-xs font-medium",
        status.success ? "text-emerald-400" : "text-destructive",
      )}
    >
      {status.message}
    </p>
  );
};

const payloadPreview = (status?: AuthAdminActionResult) => {
  if (!status?.payload) {
    return null;
  }

  return (
    <details className="text-xs text-muted-foreground">
      <summary>View payload</summary>
      <pre className="whitespace-pre-wrap text-[11px]">{JSON.stringify(status.payload, null, 2)}</pre>
    </details>
  );
};

const layoutSection = (title: string, children: React.ReactNode) => (
  <section className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
    <div className="space-y-3">{children}</div>
  </section>
);

export function AuthAdminPanel({ users, oauthClients }: AuthAdminPanelProps) {
  const [selectLinkType, setSelectLinkType] = React.useState("invite");
  const [pendingAction, setPendingAction] = React.useState<ActionKey | null>(null);
  const [statuses, setStatuses] = React.useState<Record<ActionKey, AuthAdminActionResult | undefined>>({});
  const [isPending, startTransition] = React.useTransition();

  const setActionStatus = (key: ActionKey, status: AuthAdminActionResult) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
  };

  const runAction = (key: ActionKey, callback: () => Promise<AuthAdminActionResult>) => {
    startTransition(async () => {
      setPendingAction(key);
      const result = await callback();
      setActionStatus(key, result);
      setPendingAction(null);
    });
  };

  const readField = (formData: FormData, field: string) =>
    (formData.get(field) as string | null)?.trim() ?? "";

  const formSection = (
    actionKey: ActionKey,
    label: string,
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    children: React.ReactNode,
  ) => (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button
          size="sm"
          type="submit"
          disabled={pendingAction === actionKey}
          variant="secondary"
        >
          {pendingAction === actionKey ? "Working…" : "Execute"}
        </Button>
      </div>
      {children}
      {actionMessage(statuses[actionKey])}
      {payloadPreview(statuses[actionKey])}
    </form>
  );

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: readField(form, "create-email"),
      password: readField(form, "create-password"),
      role: readField(form, "create-role") || undefined,
      displayName: readField(form, "create-display"),
      phone: readField(form, "create-phone") || undefined,
    };
    runAction("create-user", () => createUserAction(payload));
  };

  const handleUpdateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      userId: readField(form, "update-id"),
      email: readField(form, "update-email") || undefined,
      password: readField(form, "update-password") || undefined,
      role: readField(form, "update-role") || undefined,
      displayName: readField(form, "update-display") || undefined,
      phone: readField(form, "update-phone") || undefined,
    };
    runAction("update-user", () => updateUserAction(payload));
  };

  const handleDeleteUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const softDelete = form.get("delete-soft") === "on";
    const payload = {
      userId: readField(form, "delete-id"),
      softDelete,
    };
    runAction("delete-user", () => deleteUserAction(payload));
  };

  const handleRetrieveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("retrieve-user", () => retrieveUserAction(readField(form, "retrieve-id")));
  };

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("invite-user", () =>
      inviteUserByEmailAction({
        email: readField(form, "invite-email"),
        redirectTo: readField(form, "invite-redirect") || undefined,
        metadata: readField(form, "invite-meta") || undefined,
      }),
    );
  };

  const handleGenerateLink = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("generate-link", () =>
      generateEmailLinkAction({
        type: selectLinkType as GenerateLinkParams["type"],
        email: readField(form, "generate-email"),
        newEmail: readField(form, "generate-new-email") || undefined,
        redirectTo: readField(form, "generate-redirect") || undefined,
        metadata: readField(form, "generate-meta") || undefined,
        password: readField(form, "generate-password") || undefined,
      }),
    );
  };

  const handleSignOut = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("sign-out-user", () =>
      signOutUserAction({
        jwt: readField(form, "signout-token"),
        scope: readField(form, "signout-scope") || undefined,
      }),
    );
  };

  const handleListFactors = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("list-factors", () =>
      listUserFactorsAction({ userId: readField(form, "factor-user") }),
    );
  };

  const handleDeleteFactor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("delete-factor", () =>
      deleteUserFactorAction({
        userId: readField(form, "factor-delete-user"),
        factorId: readField(form, "factor-id"),
      }),
    );
  };

  const handleGetClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("get-oauth-client", () =>
      getOAuthClientAction(readField(form, "oauth-id")),
    );
  };

  const handleCreateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("create-oauth-client", () =>
      createOAuthClientAction({
        name: readField(form, "oauth-name") || undefined,
        redirectUris: readField(form, "oauth-redirect"),
        scopes: readField(form, "oauth-scopes"),
        description: readField(form, "oauth-desc"),
      }),
    );
  };

  const handleUpdateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("update-oauth-client", () =>
      updateOAuthClientAction({
        clientId: readField(form, "oauth-update-id"),
        name: readField(form, "oauth-update-name") || undefined,
        redirectUris: readField(form, "oauth-update-redirect"),
        scopes: readField(form, "oauth-update-scopes"),
        description: readField(form, "oauth-update-desc"),
      }),
    );
  };

  const handleDeleteClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("delete-oauth-client", () =>
      deleteOAuthClientAction(readField(form, "oauth-delete-id")),
    );
  };

  const handleRegenerateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    runAction("regenerate-oauth-client-secret", () =>
      regenerateOAuthClientSecretAction(readField(form, "oauth-regenerate-id")),
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          Users
          <Badge variant="secondary">{users.length}</Badge>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          OAuth clients
          <Badge variant="secondary">{oauthClients.length}</Badge>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {layoutSection(
          "Users",
        <>
          {formSection(
            "create-user",
            "Create user",
            handleCreateUser,
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="create-email">Email</Label>
                <Input id="create-email" name="create-email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-password">Password</Label>
                <Input id="create-password" name="create-password" type="password" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-role">Role</Label>
                <Input id="create-role" name="create-role" placeholder="authenticated" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-display">Display name</Label>
                <Input id="create-display" name="create-display" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-phone">Phone</Label>
                <Input id="create-phone" name="create-phone" type="tel" />
              </div>
            </div>,
          )}
          {formSection(
            "update-user",
            "Update user",
            handleUpdateUser,
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="update-id">User ID</Label>
                <Input id="update-id" name="update-id" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="update-email">Email</Label>
                <Input id="update-email" name="update-email" type="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="update-password">Password</Label>
                <Input id="update-password" name="update-password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="update-role">Role</Label>
                <Input id="update-role" name="update-role" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="update-display">Display name</Label>
                <Input id="update-display" name="update-display" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="update-phone">Phone</Label>
                <Input id="update-phone" name="update-phone" type="tel" />
              </div>
            </div>,
          )}
          {formSection(
            "delete-user",
            "Delete user",
            handleDeleteUser,
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="delete-id">User ID</Label>
                <Input id="delete-id" name="delete-id" required />
              </div>
              <div className="flex items-end gap-2">
                <input id="delete-soft" name="delete-soft" type="checkbox" className="accent-primary" />
                <Label htmlFor="delete-soft" className="text-sm">Soft delete</Label>
              </div>
            </div>,
          )}
          {formSection(
            "retrieve-user",
            "Retrieve user",
            handleRetrieveUser,
            <div className="space-y-1">
              <Label htmlFor="retrieve-id">User ID</Label>
              <Input id="retrieve-id" name="retrieve-id" required />
            </div>,
          )}
        </>,
      )}

      {layoutSection(
        "Invites & links",
        <>
          {formSection(
            "invite-user",
            "Send invite",
            handleInvite,
            <div className="space-y-1">
              <Label htmlFor="invite-email">Email</Label>
              <Input id="invite-email" name="invite-email" type="email" required />
              <Label htmlFor="invite-redirect">Redirect</Label>
              <Input id="invite-redirect" name="invite-redirect" placeholder="https://app.example.com/welcome" />
              <Label htmlFor="invite-meta">Metadata (JSON)</Label>
              <Input id="invite-meta" name="invite-meta" placeholder='{"role":"staff"}' />
            </div>,
          )}
          {formSection(
            "generate-link",
            "Generate email link",
            handleGenerateLink,
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="generate-email">Email</Label>
                <Input id="generate-email" name="generate-email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="generate-link-type">Link type</Label>
                <Select
                  id="generate-link-type"
                  name="generate-link-type"
                  value={selectLinkType}
                  onValueChange={(value) => setSelectLinkType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invite">Invite</SelectItem>
                    <SelectItem value="magiclink">Magic link</SelectItem>
                    <SelectItem value="signup">Signup</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="email_change_current">Email change (current)</SelectItem>
                    <SelectItem value="email_change_new">Email change (new)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="generate-new-email">New email</Label>
                  <Input id="generate-new-email" name="generate-new-email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="generate-password">Password</Label>
                  <Input id="generate-password" name="generate-password" type="password" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="generate-redirect">Redirect</Label>
                <Input id="generate-redirect" name="generate-redirect" placeholder="https://app.example.com/auth/callback" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="generate-meta">Metadata (JSON)</Label>
                <Input id="generate-meta" name="generate-meta" placeholder='{"marketingOptIn":true}' />
              </div>
            </div>,
          )}
          {formSection(
            "sign-out-user",
            "Sign-out (admin)",
            handleSignOut,
            <div className="space-y-1">
              <Label htmlFor="signout-token">JWT / Session token</Label>
              <Input id="signout-token" name="signout-token" required />
              <Label htmlFor="signout-scope">Scope</Label>
              <Input id="signout-scope" name="signout-scope" placeholder="authenticator" />
            </div>,
          )}
        </>,
      )}

      {layoutSection(
        "Factors",
        <>
          {formSection(
            "list-factors",
            "List factors",
            handleListFactors,
            <div className="space-y-1">
              <Label htmlFor="factor-user">User ID</Label>
              <Input id="factor-user" name="factor-user" required />
            </div>,
          )}
          {formSection(
            "delete-factor",
            "Delete factor",
            handleDeleteFactor,
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="factor-delete-user">User ID</Label>
                <Input id="factor-delete-user" name="factor-delete-user" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="factor-id">Factor ID</Label>
                <Input id="factor-id" name="factor-id" required />
              </div>
            </div>,
          )}
        </>,
      )}

      {layoutSection(
        "OAuth clients",
        <>
          {formSection(
            "get-oauth-client",
            "Get client",
            handleGetClient,
            <div className="space-y-1">
              <Label htmlFor="oauth-id">Client ID</Label>
              <Input id="oauth-id" name="oauth-id" required />
            </div>,
          )}
          {formSection(
            "create-oauth-client",
            "Create client",
            handleCreateClient,
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="oauth-name">Client name</Label>
                <Input id="oauth-name" name="oauth-name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-redirect">Redirect URIs (comma separated)</Label>
                <Input id="oauth-redirect" name="oauth-redirect" placeholder="https://app.example.com/callback" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-scopes">Scopes (comma separated)</Label>
                <Input id="oauth-scopes" name="oauth-scopes" placeholder="openid,email,profile" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-desc">Description</Label>
                <Input id="oauth-desc" name="oauth-desc" />
              </div>
            </div>,
          )}
          {formSection(
            "update-oauth-client",
            "Update client",
            handleUpdateClient,
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="oauth-update-id">Client ID</Label>
                <Input id="oauth-update-id" name="oauth-update-id" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-update-name">Client name</Label>
                <Input id="oauth-update-name" name="oauth-update-name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-update-redirect">Redirect URIs</Label>
                <Input id="oauth-update-redirect" name="oauth-update-redirect" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-update-scopes">Scopes</Label>
                <Input id="oauth-update-scopes" name="oauth-update-scopes" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="oauth-update-desc">Description</Label>
                <Input id="oauth-update-desc" name="oauth-update-desc" />
              </div>
            </div>,
          )}
          {formSection(
            "delete-oauth-client",
            "Delete client",
            handleDeleteClient,
            <div className="space-y-1">
              <Label htmlFor="oauth-delete-id">Client ID</Label>
              <Input id="oauth-delete-id" name="oauth-delete-id" required />
            </div>,
          )}
          {formSection(
            "regenerate-oauth-client-secret",
            "Regenerate secret",
            handleRegenerateClient,
            <div className="space-y-1">
              <Label htmlFor="oauth-regenerate-id">Client ID</Label>
              <Input id="oauth-regenerate-id" name="oauth-regenerate-id" required />
            </div>,
          )}
        </>,
      )}
    </div>
  </>
  );
}
