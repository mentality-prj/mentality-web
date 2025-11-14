'use client'

import { useState } from 'react'

import { HumanEmoji } from '@/ds/icons/emoji/human'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

import { MyGuideCards } from './MyGuideCards'

const excersises = [
  { id: '1', title: 'Breathing 4-7-8', icon: <HumanEmoji />, content: '1 grjbgv rdjvndf', category: 'breating' },
  { id: '2', title: 'Meditation with mantra', icon: <HumanEmoji />, content: '2 khvj kjkj', category: 'meditation' },
  { id: '3', title: 'Candle meditation', icon: <HumanEmoji />, content: '3 pplpk wewe', category: 'meditation' },
  { id: '4', title: 'Embrace the butterfly', icon: <HumanEmoji />, content: '4 pplpk wewe', category: 'sedative' },
]

const categories = ['all', 'meditation', 'breating', 'sedative']

export default function MyGuideTabs() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredCards =
    activeCategory === 'all' ? excersises : excersises.filter((excersise) => excersise.category === activeCategory)

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="gap-3 rounded-md bg-reversed p-2 focus-within:rounded-md focus-within:ring-2 focus-within:ring-primary-focus">
        {categories.map((categ) => (
          <TabsTrigger key={categ} value={categ}>
            {categ}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((categ) => (
        <TabsContent
          key={categ}
          value={categ}
          className="pt-8 focus-within:rounded-md focus-within:outline-primary-focus"
        >
          <MyGuideCards excersises={filteredCards} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
