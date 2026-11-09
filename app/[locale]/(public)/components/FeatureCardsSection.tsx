'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { DoodleIcon } from './doodle/DoodleIcon'
import { landingContainer, landingH2, landingPrimaryCta } from './landingStyles'

const choices = [
  {
    key: 'mood',
    glyph: 'mood',
    tone: 'mint',
    decor: '-right-10 top-16 rotate-[-14deg]',
    href: Routes.MOODTRACKER,
    titleKey: 'Next.mood.title',
    descriptionKey: 'Next.mood.description',
    theme: 'border-[#bce5db] bg-[linear-gradient(145deg,#f0fdf8,#ddf7ed)]',
  },
  {
    key: 'diary',
    glyph: 'journal',
    tone: 'sky',
    decor: 'bottom-4 right-4 rotate-[11deg]',
    href: Routes.DIARY,
    titleKey: 'Next.diary.title',
    descriptionKey: 'Next.diary.description',
    theme: 'border-[#c8e4f6] bg-[linear-gradient(145deg,#f0faff,#e1f2ff)]',
  },
  {
    key: 'practice',
    glyph: 'meditation',
    tone: 'lilac',
    decor: 'bottom-4 right-4 rotate-[-6deg]',
    href: Routes.GUIDE + '/breathing',
    titleKey: 'Next.practice.title',
    descriptionKey: 'Next.practice.description',
    theme: 'border-[#e1d1f7] bg-[linear-gradient(145deg,#f9f2ff,#eee3ff)]',
  },
] as const

export function FeatureCardsSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="next-action-heading" className="bg-white">
      <div clas¶»§q«^