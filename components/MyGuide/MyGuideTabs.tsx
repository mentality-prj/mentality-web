'use client'

import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'
import { MeditationData } from '@/types/myGuige'

import { MyGuideCards } from './MyGuideCards'

type CategoyItem = {
  key: string
  label: string
}
type MyGuideTabsProps = {
  meditations: MeditationData[]
  categories: CategoyItem[]
  textLink: string
}

export function MyGuideTabs({ meditations, categories, textLink }: MyGuideTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].key)

  const filteredCards =
    activeCategory === categories[0].key
      ? meditations
      : meditations.filter((meditation) => meditation.category === activeCategory)

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="gap-3 rounded-md bg-reversed p-2">
        {categories.map((categ) => (
          <TabsTrigger key={categ.key} value={categ.key}>
            {categ.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((categ) => (
        <TabsContent
          key={categ.key}
          value={categ.key}
          className="pt-8 focus-within:rounded-md focus-within:outline-primary-focus"
        >
          <MyGuideCards meditations={filteredCards} textLink={textLink} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
