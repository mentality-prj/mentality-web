'use client'

import { useState } from 'react'

import { HumanEmoji } from '@/ds/icons/emoji/human'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

import { MyGuideCards } from './MyGuideCards'

const cards = [
  { id: '1', title: 'A1', icon: <HumanEmoji />, content: '1 grjbgv rdjvndf', category: 'медитація' },
  { id: '2', title: 'A2', icon: <HumanEmoji />, content: '2 khvj kjkj', category: 'дихальні' },
  { id: '3', title: 'A3', icon: <HumanEmoji />, content: '3 pplpk wewe', category: 'заспокійливі' },
  { id: '4', title: 'A4', icon: <HumanEmoji />, content: '4 pplpk wewe', category: 'дихальні' },
]

const categories = ['всі', 'медитація', 'дихальні', 'заспокійливі']

export default function MyGuideTabs() {
  const [activeCategory, setActiveCategory] = useState('всі')

  const filteredCards = activeCategory === 'всі' ? cards : cards.filter((card) => card.category === activeCategory)

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="gap-3 rounded-md bg-white p-2">
        {categories.map((categ) => (
          <TabsTrigger key={categ} value={categ}>
            {categ}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((categ) => (
        <TabsContent key={categ} value={categ} className="pt-8">
          <MyGuideCards cards={filteredCards} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
