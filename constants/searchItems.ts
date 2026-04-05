import { Routes } from '@/constants/routes'

export type SearchItem = {
  key: string
  href: string
}

export const searchItems: SearchItem[] = [
  { key: 'my-day', href: Routes.MYDAY },
  { key: 'about', href: Routes.ABOUT },
  { key: 'services', href: Routes.SERVICES },
  { key: 'faq', href: Routes.FAQ },
  { key: 'contacts', href: Routes.CONTACTS },
  { key: 'my-space', href: Routes.MYSPACE },
  { key: 'mood-tracker', href: Routes.MOODTRACKER },
  { key: 'diary', href: Routes.DIARY },
  { key: 'my-progress', href: Routes.MYPROGRESS },
  { key: 'psychological-tests', href: Routes.PSYCHOLOGICALTESTS },
  { key: 'mental-games', href: Routes.MENTAL_GAMES },
  { key: 'guide', href: Routes.GUIDE },
  { key: 'tips', href: Routes.TIPS },
  { key: 'meditations', href: Routes.MEDITATIONS },
  { key: 'affirmations', href: Routes.AFFIRMATIONS },
  { key: 'settings', href: Routes.SETTINGS },
  { key: 'privacy', href: Routes.PRIVACY },
  { key: 'terms', href: Routes.TERMS },
  { key: 'cookies', href: Routes.COOKIES },
]
