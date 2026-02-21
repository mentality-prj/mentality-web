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
  Target,
  Users,
  Utensils,
  Waves,
} from 'lucide-react'

import { GoalCategories, GoalCategory } from '@/types/goals'

import type { DeadlineUnit, GoalType } from './CreatePersonalGoalForm'

export const GOAL_ICONS: Record<GoalCategory, LucideIcon> = {
  default: Target,
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
  meditation: Waves,
}

export const GOAL_CATEGORIES: GoalCategory[] = Object.values(GoalCategories)

export function getGoalIcon(key: GoalCategory): LucideIcon {
  // eslint-disable-next-line security/detect-object-injection
  return GOAL_ICONS[key]
}

export type SuggestionPreset = { value: number; unit: DeadlineUnit; repeat: number }
export type SuggestionItem = { label: string; preset?: SuggestionPreset; category: GoalCategory }

const week7: SuggestionPreset = { value: 7, unit: 'day', repeat: 7 }
const month30: SuggestionPreset = { value: 30, unit: 'day', repeat: 30 }
const sixtyMinutes: SuggestionPreset = { value: 1, unit: 'hour', repeat: 1 }

export function getPersonalGoalSuggestions(t: (key: string) => string): Record<GoalType, SuggestionItem[]> {
  return {
    onetime: [
      // noPhone (5)
      { label: t('Suggestions.Onetime.DayWithoutMedia'), category: 'noPhone' },
      { label: t('Suggestions.Onetime.MorningWithoutPhone'), category: 'noPhone' },
      { label: t('Suggestions.Onetime.NoPhoneMeal'), category: 'noPhone' },
      { label: t('Suggestions.Onetime.NoPhoneScreen'), category: 'noPhone' },
      { label: t('Suggestions.Onetime.NoPhoneAway'), category: 'noPhone' },
      // reading (5)
      { label: t('Suggestions.Onetime.ReadBook'), category: 'reading' },
      { label: t('Suggestions.Onetime.ReadPages'), category: 'reading' },
      { label: t('Suggestions.Onetime.ReadReread'), category: 'reading' },
      { label: t('Suggestions.Onetime.ReadArticle'), category: 'reading' },
      { label: t('Suggestions.Onetime.ReadGrowth'), category: 'reading' },
      // social (5)
      { label: t('Suggestions.Onetime.CallFriend'), category: 'social' },
      { label: t('Suggestions.Onetime.SocialThankYou'), category: 'social' },
      { label: t('Suggestions.Onetime.SocialHelp'), category: 'social' },
      { label: t('Suggestions.Onetime.SocialFriends'), category: 'social' },
      { label: t('Suggestions.Onetime.SocialQualityTime'), category: 'social' },
      // journaling (5)
      { label: t('Suggestions.Onetime.WriteGratitudeList'), category: 'journaling' },
      { label: t('Suggestions.Onetime.LetterToFutureSelf'), category: 'journaling' },
      { label: t('Suggestions.Onetime.PersonalValues'), category: 'journaling' },
      { label: t('Suggestions.Onetime.JournalingDream'), category: 'journaling' },
      { label: t('Suggestions.Onetime.JournalingPastSelf'), category: 'journaling' },
      // walk (5)
      { label: t('Suggestions.Onetime.WalkNewRoute'), category: 'walk' },
      { label: t('Suggestions.Onetime.WalkBarefoot'), category: 'walk' },
      { label: t('Suggestions.Onetime.WalkNeighborhood'), category: 'walk' },
      { label: t('Suggestions.Onetime.WalkNoDrive'), category: 'walk' },
      { label: t('Suggestions.Onetime.WalkSunrise'), category: 'walk' },
      // art (5)
      { label: t('Suggestions.Onetime.ArtSession'), category: 'art' },
      { label: t('Suggestions.Onetime.ArtPhotos'), category: 'art' },
      { label: t('Suggestions.Onetime.ArtPoem'), category: 'art' },
      { label: t('Suggestions.Onetime.ArtCraft'), category: 'art' },
      { label: t('Suggestions.Onetime.ArtMuseum'), category: 'art' },
      // food (5)
      { label: t('Suggestions.Onetime.FoodCookNew'), category: 'food' },
      { label: t('Suggestions.Onetime.FoodNoJunk'), category: 'food' },
      { label: t('Suggestions.Onetime.FoodBreakfast'), category: 'food' },
      { label: t('Suggestions.Onetime.FoodForSomeone'), category: 'food' },
      { label: t('Suggestions.Onetime.FoodSmoothie'), category: 'food' },
      // sleep (5)
      { label: t('Suggestions.Onetime.SleepEarlyBed'), category: 'sleep' },
      { label: t('Suggestions.Onetime.SleepNoAlarm'), category: 'sleep' },
      { label: t('Suggestions.Onetime.SleepEveningRoutine'), category: 'sleep' },
      { label: t('Suggestions.Onetime.SleepNap'), category: 'sleep' },
      { label: t('Suggestions.Onetime.SleepOffline'), category: 'sleep' },
      // sport (5)
      { label: t('Suggestions.Onetime.SportWorkout60'), preset: sixtyMinutes, category: 'sport' },
      { label: t('Suggestions.Onetime.SportNewSport'), category: 'sport' },
      { label: t('Suggestions.Onetime.SportStretching'), category: 'sport' },
      { label: t('Suggestions.Onetime.SportWalk5km'), category: 'sport' },
      { label: t('Suggestions.Onetime.SportBodyweight'), category: 'sport' },
      // learning (5)
      { label: t('Suggestions.Onetime.LearningWords'), category: 'learning' },
      { label: t('Suggestions.Onetime.LearningDocumentary'), category: 'learning' },
      { label: t('Suggestions.Onetime.LearningCourse'), category: 'learning' },
      { label: t('Suggestions.Onetime.LearningCurious'), category: 'learning' },
      { label: t('Suggestions.Onetime.LearningTeach'), category: 'learning' },
      // health (5)
      { label: t('Suggestions.Onetime.HealthWater'), category: 'health' },
      { label: t('Suggestions.Onetime.HealthFreshAir'), category: 'health' },
      { label: t('Suggestions.Onetime.HealthMeal'), category: 'health' },
      { label: t('Suggestions.Onetime.HealthBreathing'), category: 'health' },
      { label: t('Suggestions.Onetime.HealthCheckup'), category: 'health' },
      // meditation (5)
      { label: t('Suggestions.Onetime.MeditationGuided'), category: 'meditation' },
      { label: t('Suggestions.Onetime.MeditationBreath'), category: 'meditation' },
      { label: t('Suggestions.Onetime.MeditationSilence'), category: 'meditation' },
      { label: t('Suggestions.Onetime.MeditationBodyScan'), category: 'meditation' },
      { label: t('Suggestions.Onetime.MeditationWalking'), category: 'meditation' },
    ],
    shortterm: [
      // sleep (5)
      { label: t('Suggestions.Shortterm.SleepBetter'), preset: week7, category: 'sleep' },
      { label: t('Suggestions.Shortterm.EarlyRise'), preset: week7, category: 'sleep' },
      { label: t('Suggestions.Shortterm.SleepNoScreens'), preset: week7, category: 'sleep' },
      { label: t('Suggestions.Shortterm.SleepSchedule'), preset: week7, category: 'sleep' },
      { label: t('Suggestions.Shortterm.SleepRelaxation'), preset: week7, category: 'sleep' },
      // meditation (5)
      { label: t('Suggestions.Shortterm.DailyMindfulness'), preset: week7, category: 'meditation' },
      { label: t('Suggestions.Shortterm.MorningIntention'), preset: week7, category: 'meditation' },
      { label: t('Suggestions.Shortterm.MeditationEveBreath'), preset: week7, category: 'meditation' },
      { label: t('Suggestions.Shortterm.MeditationBodyScanWeek'), preset: week7, category: 'meditation' },
      { label: t('Suggestions.Shortterm.MeditationMindful'), preset: week7, category: 'meditation' },
      // walk (5)
      { label: t('Suggestions.Shortterm.MorningWalk'), preset: week7, category: 'walk' },
      { label: t('Suggestions.Shortterm.NatureTime'), preset: week7, category: 'walk' },
      { label: t('Suggestions.Shortterm.WalkEvening30'), preset: week7, category: 'walk' },
      { label: t('Suggestions.Shortterm.WalkSteps10k'), preset: week7, category: 'walk' },
      { label: t('Suggestions.Shortterm.WalkLunch'), preset: week7, category: 'walk' },
      // noPhone (5)
      { label: t('Suggestions.Shortterm.NoPhoneEvening'), preset: week7, category: 'noPhone' },
      { label: t('Suggestions.Shortterm.NoPhoneNoon'), preset: week7, category: 'noPhone' },
      { label: t('Suggestions.Shortterm.NoPhoneSilent'), preset: week7, category: 'noPhone' },
      { label: t('Suggestions.Shortterm.NoPhoneMeals'), preset: week7, category: 'noPhone' },
      { label: t('Suggestions.Shortterm.NoPhoneOnce'), preset: week7, category: 'noPhone' },
      // social (5)
      { label: t('Suggestions.Shortterm.TalkAboutFeelings'), preset: week7, category: 'social' },
      { label: t('Suggestions.Shortterm.SocialMessage'), preset: week7, category: 'social' },
      { label: t('Suggestions.Shortterm.SocialCallFamily'), preset: week7, category: 'social' },
      { label: t('Suggestions.Shortterm.SocialDinner'), preset: week7, category: 'social' },
      { label: t('Suggestions.Shortterm.SocialCompliment'), preset: week7, category: 'social' },
      // reading (5)
      { label: t('Suggestions.Shortterm.ReadDaily'), preset: week7, category: 'reading' },
      { label: t('Suggestions.Shortterm.ReadPages20'), preset: week7, category: 'reading' },
      { label: t('Suggestions.Shortterm.ReadBedtime'), preset: week7, category: 'reading' },
      { label: t('Suggestions.Shortterm.ReadChapter'), preset: week7, category: 'reading' },
      { label: t('Suggestions.Shortterm.ReadComplete'), preset: week7, category: 'reading' },
      // food (5)
      { label: t('Suggestions.Shortterm.FoodBreakfastWeek'), preset: week7, category: 'food' },
      { label: t('Suggestions.Shortterm.FoodNoSugar'), preset: week7, category: 'food' },
      { label: t('Suggestions.Shortterm.FoodSaladDaily'), preset: week7, category: 'food' },
      { label: t('Suggestions.Shortterm.FoodCookDinner'), preset: week7, category: 'food' },
      { label: t('Suggestions.Shortterm.FoodWaterWeek'), preset: week7, category: 'food' },
      // journaling (5)
      { label: t('Suggestions.Shortterm.JournalingGratitude'), preset: week7, category: 'journaling' },
      { label: t('Suggestions.Shortterm.JournalingMood'), preset: week7, category: 'journaling' },
      { label: t('Suggestions.Shortterm.JournalingEvening'), preset: week7, category: 'journaling' },
      { label: t('Suggestions.Shortterm.JournalingAffirmation'), preset: week7, category: 'journaling' },
      { label: t('Suggestions.Shortterm.JournalingPriorities'), preset: week7, category: 'journaling' },
      // art (5)
      { label: t('Suggestions.Shortterm.ArtDoodle'), preset: week7, category: 'art' },
      { label: t('Suggestions.Shortterm.ArtPhotoMood'), preset: week7, category: 'art' },
      { label: t('Suggestions.Shortterm.ArtJournal'), preset: week7, category: 'art' },
      { label: t('Suggestions.Shortterm.ArtHobby30'), preset: week7, category: 'art' },
      { label: t('Suggestions.Shortterm.ArtComplete'), preset: week7, category: 'art' },
      // sport (5)
      { label: t('Suggestions.Shortterm.SportWorkout60Week'), preset: week7, category: 'sport' },
      { label: t('Suggestions.Shortterm.SportNewWorkout'), preset: week7, category: 'sport' },
      { label: t('Suggestions.Shortterm.SportRun5km'), preset: week7, category: 'sport' },
      { label: t('Suggestions.Shortterm.SportYoga'), preset: week7, category: 'sport' },
      { label: t('Suggestions.Shortterm.SportChallenge7'), preset: week7, category: 'sport' },
      // learning (5)
      { label: t('Suggestions.Shortterm.LearningStudy20'), preset: week7, category: 'learning' },
      { label: t('Suggestions.Shortterm.LearningVideo'), preset: week7, category: 'learning' },
      { label: t('Suggestions.Shortterm.LearningSkill30'), preset: week7, category: 'learning' },
      { label: t('Suggestions.Shortterm.LearningBook'), preset: week7, category: 'learning' },
      { label: t('Suggestions.Shortterm.LearningSummary'), preset: week7, category: 'learning' },
      // health (5)
      { label: t('Suggestions.Shortterm.DailyMindfulness'), preset: week7, category: 'health' },
      { label: t('Suggestions.Shortterm.HealthWaterWeek'), preset: week7, category: 'health' },
      { label: t('Suggestions.Shortterm.HealthVitamin'), preset: week7, category: 'health' },
      { label: t('Suggestions.Shortterm.HealthOutdoors'), preset: week7, category: 'health' },
      { label: t('Suggestions.Shortterm.HealthStretch'), preset: week7, category: 'health' },
    ],
    longterm: [
      // learning (5)
      { label: t('Suggestions.Longterm.LearnLanguage'), category: 'learning' },
      { label: t('Suggestions.Longterm.CopingStrategy'), category: 'learning' },
      { label: t('Suggestions.Longterm.LearningCourse30'), preset: month30, category: 'learning' },
      { label: t('Suggestions.Longterm.LearningThreeBooks'), preset: month30, category: 'learning' },
      { label: t('Suggestions.Longterm.LearningSkillDaily30'), preset: month30, category: 'learning' },
      // sport (5)
      { label: t('Suggestions.Longterm.Sport'), preset: month30, category: 'sport' },
      { label: t('Suggestions.Longterm.SportChallenge30'), preset: month30, category: 'sport' },
      { label: t('Suggestions.Longterm.SportRun100'), preset: month30, category: 'sport' },
      { label: t('Suggestions.Longterm.SportGymRoutine'), preset: month30, category: 'sport' },
      { label: t('Suggestions.Longterm.SportNewWeekly'), preset: month30, category: 'sport' },
      // meditation (5)
      { label: t('Suggestions.Longterm.Meditation'), preset: month30, category: 'meditation' },
      { label: t('Suggestions.Longterm.DailyGrounding'), preset: month30, category: 'meditation' },
      { label: t('Suggestions.Longterm.MeditationProgram'), preset: month30, category: 'meditation' },
      { label: t('Suggestions.Longterm.MeditationGratitude30'), preset: month30, category: 'meditation' },
      { label: t('Suggestions.Longterm.MeditationFour'), preset: month30, category: 'meditation' },
      // reading (5)
      { label: t('Suggestions.Longterm.ReadBook30'), preset: month30, category: 'reading' },
      { label: t('Suggestions.Longterm.ReadEveryDay30'), preset: month30, category: 'reading' },
      { label: t('Suggestions.Longterm.ReadTwoBooks'), preset: month30, category: 'reading' },
      { label: t('Suggestions.Longterm.ReadProfDev'), preset: month30, category: 'reading' },
      { label: t('Suggestions.Longterm.ReadOneTopic'), preset: month30, category: 'reading' },
      // noPhone (5)
      { label: t('Suggestions.Longterm.DigitalDetox'), preset: month30, category: 'noPhone' },
      { label: t('Suggestions.Longterm.NoPhoneDelete'), preset: month30, category: 'noPhone' },
      { label: t('Suggestions.Longterm.NoPhoneBedroom'), preset: month30, category: 'noPhone' },
      { label: t('Suggestions.Longterm.NoPhoneLimits'), preset: month30, category: 'noPhone' },
      { label: t('Suggestions.Longterm.NoPhoneHabit'), preset: month30, category: 'noPhone' },
      // health (5)
      { label: t('Suggestions.Longterm.SelfCompassion'), preset: month30, category: 'health' },
      { label: t('Suggestions.Longterm.HealthMorningRoutine'), preset: month30, category: 'health' },
      { label: t('Suggestions.Longterm.HealthBadHabit'), preset: month30, category: 'health' },
      { label: t('Suggestions.Longterm.HealthCheckUps'), category: 'health' },
      { label: t('Suggestions.Longterm.HealthTrack'), preset: month30, category: 'health' },
      // social (5)
      { label: t('Suggestions.Longterm.Volunteer'), category: 'social' },
      { label: t('Suggestions.Longterm.SocialJoin'), category: 'social' },
      { label: t('Suggestions.Longterm.SocialConnect4'), preset: month30, category: 'social' },
      { label: t('Suggestions.Longterm.SocialGathering'), preset: month30, category: 'social' },
      { label: t('Suggestions.Longterm.SocialMentor'), preset: month30, category: 'social' },
      // food (5)
      { label: t('Suggestions.Longterm.FoodNoProcessed30'), preset: month30, category: 'food' },
      { label: t('Suggestions.Longterm.FoodHomeCook30'), preset: month30, category: 'food' },
      { label: t('Suggestions.Longterm.FoodPlantBased'), preset: month30, category: 'food' },
      { label: t('Suggestions.Longterm.FoodMindful30'), preset: month30, category: 'food' },
      { label: t('Suggestions.Longterm.FoodNewRecipe'), preset: month30, category: 'food' },
      // journaling (5)
      { label: t('Suggestions.Longterm.JournalingDaily30'), preset: month30, category: 'journaling' },
      { label: t('Suggestions.Longterm.JournalingGratitude30'), preset: month30, category: 'journaling' },
      { label: t('Suggestions.Longterm.JournalingWeekly'), preset: month30, category: 'journaling' },
      { label: t('Suggestions.Longterm.JournalingLetters'), preset: month30, category: 'journaling' },
      { label: t('Suggestions.Longterm.JournalingGrowth'), preset: month30, category: 'journaling' },
      // walk (5)
      { label: t('Suggestions.Longterm.WalkSteps30'), preset: month30, category: 'walk' },
      { label: t('Suggestions.Longterm.Walk30Day'), preset: month30, category: 'walk' },
      { label: t('Suggestions.Longterm.WalkNewPlace'), preset: month30, category: 'walk' },
      { label: t('Suggestions.Longterm.WalkHike'), preset: month30, category: 'walk' },
      { label: t('Suggestions.Longterm.WalkLocalTrips'), preset: month30, category: 'walk' },
      // art (5)
      { label: t('Suggestions.Longterm.ArtProject30'), preset: month30, category: 'art' },
      { label: t('Suggestions.Longterm.ArtPracticeDaily'), preset: month30, category: 'art' },
      { label: t('Suggestions.Longterm.ArtShare'), preset: month30, category: 'art' },
      { label: t('Suggestions.Longterm.ArtPhotoChallenge'), preset: month30, category: 'art' },
      { label: t('Suggestions.Longterm.ArtLearnNew'), preset: month30, category: 'art' },
      // sleep (5)
      { label: t('Suggestions.Longterm.SleepSchedule30'), preset: month30, category: 'sleep' },
      { label: t('Suggestions.Longterm.Sleep8Hours'), preset: month30, category: 'sleep' },
      { label: t('Suggestions.Longterm.SleepNoScreens30'), preset: month30, category: 'sleep' },
      { label: t('Suggestions.Longterm.SleepRoutine30'), preset: month30, category: 'sleep' },
      { label: t('Suggestions.Longterm.SleepTracking'), preset: month30, category: 'sleep' },
    ],
    repeating: [
      // social (5)
      { label: t('Suggestions.Repeating.ShareFeelings'), category: 'social' },
      { label: t('Suggestions.Repeating.SupportSomeone'), category: 'social' },
      { label: t('Suggestions.Repeating.SocialGratitude'), category: 'social' },
      { label: t('Suggestions.Repeating.SocialConversation'), category: 'social' },
      { label: t('Suggestions.Repeating.SocialCheckIn'), category: 'social' },
      // meditation (5)
      { label: t('Suggestions.Repeating.PositiveReflection'), category: 'meditation' },
      { label: t('Suggestions.Repeating.SilenceReflection'), category: 'meditation' },
      { label: t('Suggestions.Repeating.MindfulBreathing'), category: 'meditation' },
      { label: t('Suggestions.Repeating.MeditationBodyScanBed'), category: 'meditation' },
      { label: t('Suggestions.Repeating.MeditationMindfulWalk'), category: 'meditation' },
      // walk (5)
      { label: t('Suggestions.Repeating.Evening'), category: 'walk' },
      { label: t('Suggestions.Repeating.WalkNature15'), category: 'walk' },
      { label: t('Suggestions.Repeating.WalkLocal'), category: 'walk' },
      { label: t('Suggestions.Repeating.WalkLunchBreak'), category: 'walk' },
      { label: t('Suggestions.Repeating.WalkOutside'), category: 'walk' },
      // noPhone (5)
      { label: t('Suggestions.Repeating.SocialMediaLimit'), category: 'noPhone' },
      { label: t('Suggestions.Repeating.NoPhoneMorning'), category: 'noPhone' },
      { label: t('Suggestions.Repeating.NoPhoneNotif'), category: 'noPhone' },
      { label: t('Suggestions.Repeating.NoPhoneOneHour'), category: 'noPhone' },
      { label: t('Suggestions.Repeating.NoPhoneMealsToday'), category: 'noPhone' },
      // art (5)
      { label: t('Suggestions.Repeating.CreativeHobby'), category: 'art' },
      { label: t('Suggestions.Repeating.ArtDoodle'), category: 'art' },
      { label: t('Suggestions.Repeating.ArtPhoto'), category: 'art' },
      { label: t('Suggestions.Repeating.ArtJournalLine'), category: 'art' },
      { label: t('Suggestions.Repeating.ArtMusic'), category: 'art' },
      // food (5)
      { label: t('Suggestions.Repeating.FoodVegetables'), category: 'food' },
      { label: t('Suggestions.Repeating.FoodNoLate'), category: 'food' },
      { label: t('Suggestions.Repeating.FoodHomeCook'), category: 'food' },
      { label: t('Suggestions.Repeating.FoodBreakfastEvery'), category: 'food' },
      { label: t('Suggestions.Repeating.FoodNoSugarDrink'), category: 'food' },
      // reading (5)
      { label: t('Suggestions.Repeating.ReadingPages10'), category: 'reading' },
      { label: t('Suggestions.Repeating.ReadingDailyArticle'), category: 'reading' },
      { label: t('Suggestions.Repeating.ReadingQuote'), category: 'reading' },
      { label: t('Suggestions.Repeating.ReadingChapter'), category: 'reading' },
      { label: t('Suggestions.Repeating.ReadingPodcast'), category: 'reading' },
      // journaling (5)
      { label: t('Suggestions.Repeating.JournalingThreeThings'), category: 'journaling' },
      { label: t('Suggestions.Repeating.JournalingLesson'), category: 'journaling' },
      { label: t('Suggestions.Repeating.JournalingFeelings'), category: 'journaling' },
      { label: t('Suggestions.Repeating.JournalingTomorrow'), category: 'journaling' },
      { label: t('Suggestions.Repeating.JournalingHighlight'), category: 'journaling' },
      // sleep (5)
      { label: t('Suggestions.Repeating.SleepBedtime'), category: 'sleep' },
      { label: t('Suggestions.Repeating.SleepRelax'), category: 'sleep' },
      { label: t('Suggestions.Repeating.SleepNoCaffeine'), category: 'sleep' },
      { label: t('Suggestions.Repeating.SleepReflect'), category: 'sleep' },
      { label: t('Suggestions.Repeating.SleepNoSnooze'), category: 'sleep' },
      // sport (5)
      { label: t('Suggestions.Repeating.SportMorning15'), category: 'sport' },
      { label: t('Suggestions.Repeating.SportStretch10'), category: 'sport' },
      { label: t('Suggestions.Repeating.SportBodyweight30'), category: 'sport' },
      { label: t('Suggestions.Repeating.SportStairs'), category: 'sport' },
      { label: t('Suggestions.Repeating.SportBreak'), category: 'sport' },
      // learning (5)
      { label: t('Suggestions.Repeating.LearningWords5'), category: 'learning' },
      { label: t('Suggestions.Repeating.LearningVideo10'), category: 'learning' },
      { label: t('Suggestions.Repeating.LearningProfArticle'), category: 'learning' },
      { label: t('Suggestions.Repeating.LearningPractice15'), category: 'learning' },
      { label: t('Suggestions.Repeating.LearningEduPodcast'), category: 'learning' },
      // health (5)
      { label: t('Suggestions.Repeating.HealthWater8'), category: 'health' },
      { label: t('Suggestions.Repeating.HealthVitaminDaily'), category: 'health' },
      { label: t('Suggestions.Repeating.HealthBreathing5'), category: 'health' },
      { label: t('Suggestions.Repeating.HealthOutside20'), category: 'health' },
      { label: t('Suggestions.Repeating.HealthNoProcessed'), category: 'health' },
    ],
  }
}

export function buildGoalIconLookup(t: (key: string) => string): Record<string, GoalCategory> {
  const suggestions = getPersonalGoalSuggestions(t)
  const lookup: Record<string, GoalCategory> = {}
  for (const items of Object.values(suggestions)) {
    for (const item of items) {
      lookup[item.label] = item.category
    }
  }
  return lookup
}
