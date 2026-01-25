'use server';

import { revalidatePath } from 'next/cache';

import { createAuthAdminService } from '../../../../../lib/auth/admin';
import { createSupabaseServerClient } from '../../../../../lib/supabase/server';

import type {
  AdminUserAttributes,
  AuthMFAAdminDeleteFactorParams,
  AuthMFAAdminDeleteFactorResponse,
  AuthMFAAdminListFactorsResponse,
  CreateOAuthClientParams,
  GenerateLinkParams,
  UpdateOAuthClientParams,
} from '@supabase/auth-js';

const AUTH_ADMIN_PATH = '/d/admin/auth';

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const DEFAULT_AUTH_CALLBACK_URL = `${APP_URL}/auth/callback`;

function resolveCallbackRedirect(override?: string | null) {
  const trimmed = override?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_AUTH_CALLBACK_URL;
}

async function cleanupAccountRecords(authUserId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: account } = await supabase
    .from('accounts')
    .select('id, org_id')
    .eq('auth_user_id', authUserId)
    .maybeSingle<{ id: string; org_id: string }>();

  if (!account?.id) {
    return;
  }

  await Promise.all([
    supabase.from('profiles').delete().eq('account_id', account.id).eq('org_id', account.org_id),
    supabase.from('family_links').delete().eq('guardian_account_id', account.id).eq('org_id', account.org_id),
    supabase.from('accounts').delete().eq('id', account.id).eq('org_id', account.org_id),
  ]);
}

export type AuthAdminActionResult<T = unknown> = {
  action: string;
  success: boolean;
  message: string;
  payload?: T;
};

type ActionCallback<T> = (service: ReturnType<typeof createAuthAdminService>) => Promise<T>;

async function runAction<T>(action: string, callback: ActionCallback<T>): Promise<AuthAdminActionResult<T>> {
  try {
    const service = createAuthAdminService();
    const payload = await callback(service);
    revalidatePath(AUTH_ADMIN_PATH);
    return {
      action,
      success: true,
      message: `${action} completed successfully.`,
      payload,
    };
  } catch (error) {
    return {
      action,
      success: false,
      message: error instanceof Error ? error.message : `Unexpected error performing ${action}.`,
    };
  }
}

export async function retrieveUserAction(userId: string) {
  return runAction('retrieve-user', (service) => service.retrieveUser(userId));
}

type CreateUserPayload = {
  email: string;
  password: string;
  role?: string;
  phone?: string;
  displayName?: string;
};

export async function createUserAction(payload: CreateUserPayload) {
  const attributes: AdminUserAttributes = {
    email: payload.email,
    password: payload.password,
    role: payload.role,
    phone: payload.phone,
    user_metadata: payload.displayName
      ? { display_name: payload.displayName }
      : undefined,
  };

  return runAction('create-user', (service) => service.createUser(attributes));
}

type UpdateUserPayload = {
  userId: string;
  email?: string;
  role?: string;
  phone?: string;
  password?: string;
  displayName?: string;
};

export async function updateUserAction(payload: UpdateUserPayload) {
  const attributes: AdminUserAttributes = {
    email: payload.email,
    role: payload.role,
    phone: payload.phone,
    password: payload.password,
    user_metadata: payload.displayName
      ? { display_name: payload.displayName }
      : undefined,
  };

  return runAction('update-user', (service) => service.updateUser(payload.userId, attributes));
}

type DeleteUserPayload = { userId: string; softDelete?: boolean };

export async function deleteUserAction(payload: DeleteUserPayload) {
  return runAction('delete-user', async (service) => {
    const result = await service.deleteUser(payload.userId, payload.softDelete);
    await cleanupAccountRecords(payload.userId);
    return result;
  });
}

type InvitePayload = { email: string; redirectTo?: string; metadata?: string };

export async function inviteUserByEmailAction(payload: InvitePayload) {
  const data = payload.metadata ? { metadata: payload.metadata } : undefined;
  return runAction('invite-user', (service) =>
    service.inviteUserByEmail(payload.email, {
      redirectTo: resolveCallbackRedirect(payload.redirectTo),
      data,
    }),
  );
}

type GenerateLinkPayload = {
  type: GenerateLinkParams['type'];
  email: string;
  password?: string;
  newEmail?: string;
  redirectTo?: string;
  metadata?: string;
};

function parseMetadata(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return { note: value };
  }
}

export async function generateEmailLinkAction(payload: GenerateLinkPayload) {
  const options = {
    redirectTo: resolveCallbackRedirect(payload.redirectTo),
    data: parseMetadata(payload.metadata),
  };

  const params: GenerateLinkParams = (() => {
    switch (payload.type) {
      case 'signup':
        return {
          type: 'signup',
          email: payload.email,
          password: payload.password ?? '',
          options,
        };
      case 'invite':
      case 'magiclink':
        return {
          type: payload.type,
          email: payload.email,
          options,
        };
      case 'recovery':
        return {
          type: 'recovery',
          email: payload.email,
          options,
        };
      case 'email_change_current':
      case 'email_change_new':
        if (!payload.newEmail) {
          throw new Error('newEmail is required for email change links');
        }
        return {
          type: payload.type,
          email: payload.email,
          newEmail: payload.newEmail,
          options,
        };
      default:
        return {
          type: payload.type,
          email: payload.email,
          options,
        };
    }
  })();

  return runAction('generate-link', (service) => service.generateEmailLink(params));
}

type SignOutPayload = { jwt: string; scope?: string };

export async function signOutUserAction(payload: SignOutPayload) {
  return runAction('sign-out-user', (service) =>
    service.signOutUser(payload.jwt, payload.scope),
  );
}

type ListFactorsPayload = { userId: string };

export async function listUserFactorsAction(payload: ListFactorsPayload) {
  return runAction<AuthMFAAdminListFactorsResponse>('list-factors', (service) =>
    service.listFactors({ userId: payload.userId }),
  );
}

type DeleteFactorPayload = { userId: string; factorId: string };

export async function deleteUserFactorAction(payload: DeleteFactorPayload) {
  return runAction<AuthMFAAdminDeleteFactorResponse>('delete-factor', (service) =>
    service.deleteFactor({ userId: payload.userId, id: payload.factorId }),
  );
}

type OAuthClientPayload = {
  clientId?: string;
  name?: string;
  redirectUris?: string;
  scopes?: string;
  description?: string;
};

function parseRedirects(values?: string) {
  if (!values) {
    return [];
  }

  return values
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function listOAuthClientsAction() {
  return runAction('list-oauth-clients', (service) =>
    service.listOAuthClients({ perPage: 25 }),
  );
}

export async function getOAuthClientAction(clientId: string) {
  return runAction('get-oauth-client', (service) => service.getOAuthClient(clientId));
}

export async function createOAuthClientAction(payload: OAuthClientPayload) {
  const params: CreateOAuthClientParams = {
    name: payload.name ?? 'New client',
    redirectUris: parseRedirects(payload.redirectUris),
    scopes: payload.scopes?.split(',').map((scope) => scope.trim()),
    description: payload.description,
  };

  return runAction('create-oauth-client', (service) => service.createOAuthClient(params));
}

export async function updateOAuthClientAction(payload: OAuthClientPayload) {
  if (!payload.clientId) {
    throw new Error('clientId is required to update a client');
  }

  const params: UpdateOAuthClientParams = {
    name: payload.name,
    redirectUris: parseRedirects(payload.redirectUris),
    scopes: payload.scopes?.split(',').map((scope) => scope.trim()),
    description: payload.description,
  };

  return runAction('update-oauth-client', (service) =>
    service.updateOAuthClient(payload.clientId!, params),
  );
}

export async function deleteOAuthClientAction(clientId: string) {
  return runAction('delete-oauth-client', (service) =>
    service.deleteOAuthClient(clientId),
  );
}

export async function regenerateOAuthClientSecretAction(clientId: string) {
  return runAction('regenerate-oauth-client-secret', (service) =>
    service.regenerateOAuthClientSecret(clientId),
  );
}
