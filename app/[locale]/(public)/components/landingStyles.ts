/**
 * Shared visual tokens for the public landing so every section uses the same
 * CTA hierarchy, heading scale and vertical rhythm.
 */
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b58d9]'

export const landingPrimaryCta = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#7545dd,#4368e6)] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_28px_rgba(93,78,210,0.22)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(93,78,210,0.28)] ${focusRing}`

export const landingSecondaryCta = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d6cdee] bg-white/80 px-6 py-3 text-center text-sm font-semibold text-[#3f3566] backdrop-blur-sm transition-colors hover:bg-white ${focusRing}`

export const landingH2 =
  'text-[1.75rem] font-semibold leading-tight tracking-tight text-[#302a4f] tablet:text-[2.25rem]'

/** 56px mobile / 96px desktop section rhythm. */
export const landingContainer = 'container-max-width mx-auto px-4 py-14 tablet:px-6 md:px-8 md:py-24 lg:px-10'
