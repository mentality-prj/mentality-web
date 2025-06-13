'use server'

import { redirect } from 'next/navigation'

import { Routes } from '@/constants/routes'

export async function redirectToSignin() {
  redirect(Routes.SIGNIN)
}
