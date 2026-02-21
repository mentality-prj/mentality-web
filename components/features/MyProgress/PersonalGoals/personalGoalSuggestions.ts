import {
  BookOpen,
  Dumbbell,
  Footprints,
  GraduationCap,
  Heart,
  LucideIcon,
  Moon,
  NotebookPen,
  Palette,
  PhoneOff,
  Users,
  Utensils,
  Wind,
} from 'lucide-react'

import type { DeadlineUnit, GoalType } from './CreatePersonalGoalForm'

export type GoalIconKey =
  | 'food'
  | 'reading'
  | 'social'
  | 'journaling'
  | 'noPhone'
  | 'walk'
  | 'art'
  | 'sleep'
  | 'sport'
  | 'learning'
  | 'health'
  | 'meditation'

export const GOAL_ICONS: Record<GoalIconKey, LucideIcon> = {
  food: Utensils,
  reading: BookOpen,
  social: Users,
  journaling: NotebookPen,
  noPhone: PhoneOff,
  walk: Footprints,
  art: Palette,
  sleep: Moon,
  sport: Dumbbell,
  learning: GraduationCap,
  health: Heart,
  meditation: Wind,
}

export function getGoalIcon(key: GoalIconKey): LucideIcon {
  return GOAL_ICONS[key as GoalIconKey]
}

export type SuggestionPreset = { value: number; unit: DeadlineUnit; repeat: number }
export type SuggestionItem = { label: string; preset?: SuggestionPreset; iconKey: GoalIconKey }

const week7: SuggestionPreset = { value: 7, unit: 'day', repeat: 7 }
const month30: SuggestionPreset = { value: 30, unit: 'day', repeat: 30 }

export function getPersonalGoalSuggestions(t: (key: string) => string): Record<GoalType, SuggestionItem[]> {
  return {
    onetime: [
      { label: t('Suggestions.Onetime.DayWithoutMedia'), iconKey: 'noPhone' },
      { label: t('Suggestions.Onetime.ReadBook'), iconKey: 'reading' },
      { label: t('Suggestions.Onetime.CallFriend'), iconKey: 'social' },
      { label: t('Suggestions.Onetime.WriteGratitudeList'), iconKey: 'journaling' },
      { label: t('Suggestions.Onetime.MorningWithoutPhone'), iconKey: 'noPhone' },
      { label: t('Suggestions.Onetime.LetterToFutureSelf'), iconKey: 'journaling' },
      { label: t('Suggestions.Onetime.WalkNewRoute'), iconKey: 'walk' },
      { label: t('Suggestions.Onetime.ArtSession'), iconKey: 'art' },
      { label: t('Suggestions.Onetime.PersonalValues'), iconKey: 'journaling' },
    ],
    shortterm: [
      { label: t('Suggestions.Shortterm.SleepBetter'), preset: week7, iconKey: 'sleep' },
      { label: t('Suggestions.Shortterm.DailyMindfulness'), preset: week7, iconKey: 'meditation' },
      { label: t('Suggestions.Shortterm.MorningWalk'), preset: week7, iconKey: 'walk' },
      { label: t('Suggestions.Shortterm.NoPhoneEvening'), preset: week7, iconKey: 'noPhone' },
      { label: t('Suggestions.Shortterm.TalkAboutFeelings'), preset: week7, iconKey: 'social' },
      { label: t('Suggestions.Shortterm.ReadDaily'), preset: week7, iconKey: 'reading' },
      { label: t('Suggestions.Shortterm.NatureTime'), preset: week7, iconKey: 'walk' },
      { label: t('Suggestions.Shortterm.MorningIntention'), preset: week7, iconKey: 'meditation' },
      { label: t('Suggestions.Shortterm.EarlyRise'), preset: week7, iconKey: 'sleep' },
    ],
    longterm: [
      { label: t('Suggestions.Longterm.LearnLanguage'), iconKey: 'learning' },
      { label: t('Suggestions.Longterm.Sport'), preset: month30, iconKey: 'sport' },
      { label: t('Suggestions.Longterm.Meditation'), preset: month30, iconKey: 'meditation' },
      { label: t('Suggestions.Longterm.ReadBook30'), preset: month30, iconKey: 'reading' },
      { label: t('Suggestions.Longterm.DigitalDetox'), preset: month30, iconKey: 'noPhone' },
      { label: t('Suggestions.Longterm.SelfCompassion'), preset: month30, iconKey: 'health' },
      { label: t('Suggestions.Longterm.DailyGrounding'), preset: month30, iconKey: 'meditation' },
      { label: t('Suggestions.Longterm.CopingStrategy'), iconKey: 'learning' },
      { label: t('Suggestions.Longterm.Volunteer'), iconKey: 'social' },
    ],
    repeating: [
      { label: t('Suggestions.Repeating.ShareFeelings'), iconKey: 'social' },
      { label: t('Suggestions.Repeating.PositiveReflection'), iconKey: 'meditation' },
      { label: t('Suggestions.Repeating.Evening'), iconKey: 'walk' },
      { label: t('Suggestions.Repeating.SilenceReflection'), iconKey: 'meditation' },
      { label: t('Suggestions.Repeating.SocialMediaLimit'), iconKey: 'noPhone' },
      { label: t('Suggestions.Repeating.SupportSomeone'), iconKey: 'social' },
      { label: t('Suggestions.Repeating.CreativeHobby'), iconKey: 'art' },
      { label: t('Suggestions.Repeating.MindfulBreathing'), iconKey: 'meditation' },
      { label: t('Suggestions.Repeating.NoPhoneMorning'), iconKey: 'noPhone' },
    ],
  }
}

export function buildGoalIconLookup(t: (key: string) => string): Record<string, GoalIconKey> {
  const suggestions = getPersonalGoalSuggestions(t)
  const lookup: Record<string, GoalIconKey> = {}
  for (const items of Object.values(suggestions)) {
    for (const item of items) {
      lookup[item.label] = item.iconKey
    }
  }
  return lookup
}
