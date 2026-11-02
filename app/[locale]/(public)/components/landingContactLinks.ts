import { Routes } from '@/constants/routes'

/**
 * Public B2B / R&D entry points from the landing page.
 * Dedicated business and research intake routes depend on backend lead APIs
 * that are not deployed yet, so the landing uses the existing contact form
 * with explicit, non-sensitive attribution.
 */
export const BUSINESS_CONTACT_HREF = `${Routes.CONTACTS}?source=landing&intent=demo&segment=teams`
export const RESEARCH_CONTACT_HREF = `${Routes.CONTACTS}?source=landing&intent=demo&segment=research`
