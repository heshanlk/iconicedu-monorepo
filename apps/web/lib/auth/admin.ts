import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type {
  AdminUserAttributes,
  AuthMFAAdminDeleteFactorParams,
  AuthMFAAdminDeleteFactorResponse,
  AuthMFAAdminListFactorsParams,
  AuthMFAAdminListFactorsResponse,
  CreateOAuthClientParams,
  GenerateLinkParams,
  OAuthClientListResponse,
  OAuthClientResponse,
  UpdateOAuthClientParams,
  UserResponse,
} from '@supabase/auth-js'

export type AuthAdminServiceOptions = {
  supabaseUrl?: string
  serviceRoleKey?: string
  client?: SupabaseClient
}

const throwMissingConfig = () => {
  throw new Error(
    'Supabase admin configuration is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.',
  )
}

export class AuthAdminService {
  private constructor(private readonly client: SupabaseClient) {}

  static create(options?: AuthAdminServiceOptions) {
    if (options?.client) {
      return new AuthAdminService(options.client)
    }

    const supabaseUrl = options?.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = options?.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throwMissingConfig()
    }

    const client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })

    return new AuthAdminService(client)
  }

  getClient() {
    return this.client
  }

  retrieveUser(uid: string) {
    return this.client.auth.admin.getUserById(uid)
  }

  listUsers(options?: { page?: number; perPage?: number }) {
    return this.client.auth.admin.listUsers({
      page: options?.page,
      perPage: options?.perPage,
    })
  }

  createUser(attributes: AdminUserAttributes) {
    return this.client.auth.admin.createUser(attributes)
  }

  updateUser(uid: string, attributes: AdminUserAttributes) {
    return this.client.auth.admin.updateUserById(uid, attributes)
  }

  deleteUser(uid: string, shouldSoftDelete = false) {
    return this.client.auth.admin.deleteUser(uid, shouldSoftDelete)
  }

  inviteUserByEmail(email: string, options?: { redirectTo?: string; data?: object }) {
    return this.client.auth.admin.inviteUserByEmail(email, {
      redirectTo: options?.redirectTo,
      data: options?.data,
    })
  }

  generateEmailLink(params: GenerateLinkParams) {
    return this.client.auth.admin.generateLink(params)
  }

  signOutUser(jwt: string, scope?: string) {
    return this.client.auth.admin.signOut(jwt, scope)
  }

  listFactors(params: AuthMFAAdminListFactorsParams) {
    return this.client.auth.admin.mfa.listFactors(params)
  }

  deleteFactor(params: AuthMFAAdminDeleteFactorParams) {
    return this.client.auth.admin.mfa.deleteFactor(params)
  }

  listOAuthClients(options?: { page?: number; perPage?: number }) {
    return this.client.auth.admin.oauth.listClients({
      page: options?.page,
      perPage: options?.perPage,
    })
  }

  getOAuthClient(clientId: string) {
    return this.client.auth.admin.oauth.getClient(clientId)
  }

  createOAuthClient(params: CreateOAuthClientParams) {
    return this.client.auth.admin.oauth.createClient(params)
  }

  updateOAuthClient(clientId: string, params: UpdateOAuthClientParams) {
    return this.client.auth.admin.oauth.updateClient(clientId, params)
  }

  deleteOAuthClient(clientId: string) {
    return this.client.auth.admin.oauth.deleteClient(clientId)
  }

  regenerateOAuthClientSecret(clientId: string) {
    return this.client.auth.admin.oauth.regenerateClientSecret(clientId)
  }
}

export const createAuthAdminService = (options?: AuthAdminServiceOptions) =>
  AuthAdminService.create(options)
