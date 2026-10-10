'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { DIP_NEW_KEY_FLASH_COOKIE, DIP_NEW_KEY_FLASH_MAX_AGE_SECONDS } from '@/app/[locale]/admin/dip/system/constants'
import { getServerSession } from '@/lib/auth/server'
import {
  createDipOrganization,
  createDipOrganizationKey,
  createDipOrganizationMember,
  createDipOrganizationUnit,
  revokeDipOrganizationKey,
  updateDipOrganizationMember,
} from '@/requests/dipClient'
import type { DipOrganizationMemberRole, DipOrganizationUnitType } from '@/types/dip'
import { type SupportedLanguage, supportedLanguages } from '@/types/languages'

function normalizeLocale(locale: string): SupportedLanguage {
  if (supportedLanguages.includes(locale as SupportedLanguage)) {
    return locale as SupportedLanguage
  }

  return 'uk'
}

function buildRedirectPath(locale: string, orgId?: string, status?: 'success' | 'error', message?: string): string {
  const safeLocale = normalizeLocale(locale)
  const params = new URLSearchParams()
  if (orgId) params.set('org', orgId)
  if (status && message) params.set(status, message)
  const query = params.toString()
  return `/${safeLocale}/admin/dip/system${query ? `?${query}` : ''}`
}

async function requireAdminAccess(locale: string): Promise<void> {
  const session = await getServerSession()
  if (session?.user?.role !== 'admin') {
    redirect(`/${normalizeLocale(locale)}`)
  }
}

export async function createOrganizationAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const name = String(formData.get('name') ?? '').trim()

  if (!name) {
    redirect(buildRedirectPath(locale, undefined, 'error', 'Organization name is required'))
  }

  const result = await createDipOrganization({ name })
  if ('error' in result) {
    redirect(buildRedirectPath(locale, undefined, 'error', result.error))
  }

  redirect(buildRedirectPath(locale, result.data.id, 'success', 'Organization created'))
}

export async function createOrganizationUnitAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const orgId = String(formData.get('orgId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const type = String(formData.get('type') ?? 'team') as DipOrganizationUnitType
  const parentUnitIdRaw = String(formData.get('parentUnitId') ?? '').trim()

  if (!orgId || !name) {
    redirect(buildRedirectPath(locale, orgId || undefined, 'error', 'Unit name is required'))
  }

  const result = await createDipOrganizationUnit(orgId, {
    name,
    type,
    parentUnitId: parentUnitIdRaw || null,
  })
  if ('error' in result) {
    redirect(buildRedirectPath(locale, orgId, 'error', result.error))
  }

  redirect(buildRedirectPath(locale, orgId, 'success', 'Organization unit created'))
}

export async function createOrganizationMemberAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const orgId = String(formData.get('orgId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const role = String(formData.get('role') ?? 'scientist') as DipOrganizationMemberRole
  const unitIdRaw = String(formData.get('unitId') ?? '').trim()

  if (!orgId || !name || !email) {
    redirect(buildRedirectPath(locale, orgId || undefined, 'error', 'Name and email are required'))
  }

  const result = await createDipOrganizationMember(orgId, {
    name,
    email,
    role,
    unitId: unitIdRaw || null,
  })
  if ('error' in result) {
    redirect(buildRedirectPath(locale, orgId, 'error', result.error))
  }

  redirect(buildRedirectPath(locale, orgId, 'success', 'Organization member created'))
}

export async function updateOrganizationMemberRoleAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const orgId = String(formData.get('orgId') ?? '')
  const memberId = String(formData.get('memberId') ?? '')
  const role = String(formData.get('role') ?? 'scientist') as DipOrganizationMemberRole
  const unitIdRaw = String(formData.get('unitId') ?? '').trim()

  if (!orgId || !memberId) {
    redirect(buildRedirectPath(locale, orgId || undefined, 'error', 'Member id is required'))
  }

  const result = await updateDipOrganizationMember(orgId, memberId, {
    role,
    unitId: unitIdRaw || null,
  })
  if ('error' in result) {
    redirect(buildRedirectPath(locale, orgId, 'error', result.error))
  }

  redirect(buildRedirectPath(locale, orgId, 'success', 'Member updated'))
}

export async function createOrganizationKeyAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const orgId = String(formData.get('orgId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const environment = String(formData.get('environment') ?? 'development').trim() || 'development'
  const scopesRaw = String(formData.get('scopes') ?? '*').trim()
  const scopes = scopesRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (!orgId || !name) {
    redirect(buildRedirectPath(locale, orgId || undefined, 'error', 'Key name is required'))
  }

  const result = await createDipOrganizationKey(orgId, {
    name,
    environment,
    scopes: scopes.length > 0 ? scopes : ['*'],
  })
  if ('error' in result) {
    redirect(buildRedirectPath(locale, orgId, 'error', result.error))
  }

  const safeLocale = normalizeLocale(locale)
  const cookieStore = cookies()
  cookieStore.set(DIP_NEW_KEY_FLASH_COOKIE, result.data.key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/${safeLocale}/admin/dip/system`,
    maxAge: DIP_NEW_KEY_FLASH_MAX_AGE_SECONDS,
  })

  redirect(buildRedirectPath(locale, orgId, 'success', 'API key created'))
}

export async function revokeOrganizationKeyAction(formData: FormData): Promise<never> {
  const locale = String(formData.get('locale') ?? 'uk')
  await requireAdminAccess(locale)
  const orgId = String(formData.get('orgId') ?? '')
  const keyId = String(formData.get('keyId') ?? '')

  if (!orgId || !keyId) {
    redirect(buildRedirectPath(locale, orgId || undefined, 'error', 'Key id is required'))
  }

  const result = await revokeDipOrganizationKey(orgId, keyId)
  if ('error' in result) {
    redirect(buildRedirectPath(locale, orgId, 'error', result.error))
  }

  redirect(buildRedirectPath(locale, orgId, 'success', 'API key revoked'))
}
