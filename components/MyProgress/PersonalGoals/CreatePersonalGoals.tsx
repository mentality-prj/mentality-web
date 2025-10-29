'use client'

import { createPersonalGoal } from '@/actions/personalGoals.action'
import { AddIcon } from '@/ds/icons/add'
import { AddSquareIcon } from '@/ds/icons/add-square'
import { MinusSquareIcon } from '@/ds/icons/minus-square'
import { Button } from '@/ds/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/ds/shadcn/dialog'
import { Textarea } from '@/ds/shadcn/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/ds/shadcn/toggle-group'
import { useRouter } from '@/i18n/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export const CreatePersonalGoals = () => {
  const router = useRouter()
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { data } = useSession()

  if (!data?.user?.id) {
    return null
  }
  const userId = data.user.id

  const createPersonalGoalClick = async () => {
    await createPersonalGoal({ userId, text, repeat: quantity })
    router.refresh()
  }
  return (
    <Dialog>
      <DialogTrigger className="group flex aspect-[11/8] flex-col items-center justify-center gap-[14px] rounded-md border border-outline-secondary p-2 hover:cursor-pointer hover:border-2 hover:border-primary-hover">
        <div className="text-primary group-hover:text-primary-hover">
          <AddIcon />
        </div>
        <span className="rounded-sm bg-secondary-hover px-3 py-2 font-semibold text-primary group-hover:bg-secondary-pressed group-hover:text-primary-hover">
          Створити нову ціль
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[680px]">
        <DialogTitle>Сформулюй свою ціль</DialogTitle>
        <DialogDescription>
          <div>
            <div className="mb-2">Ми пропонуємо:</div>
            <div>
              <ToggleGroup className="flex flex-wrap justify-start gap-2" type="single">
                <ToggleGroupItem className="bg-[#F6F5FF] px-3 py-1" value="a">
                  Лягати спати до 22:00 впродовж тижня
                </ToggleGroupItem>
                <ToggleGroupItem value="b">Провести день без соцмереж</ToggleGroupItem>
                <ToggleGroupItem value="c">Пити не більше однієї чашки кави на день</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="my-5">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
              <p className="text-xs font-normal text-textcolor-tertiary">Максимум 60 символів</p>
            </div>
            <div className="">
              <div className="">Зазнач кількість повторень для реалізаії цілі (опціонально)</div>
              <div className="mt-2 flex items-center gap-2">
                <Button disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} variant="iconButton">
                  <MinusSquareIcon />
                </Button>
                <span>{quantity}</span>
                <Button onClick={() => setQuantity(quantity + 1)} variant="iconButton">
                  <AddSquareIcon />
                </Button>
              </div>
              <div className="mt-5 flex gap-4">
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full">
                    Скасувати
                  </Button>
                </DialogClose>
                <Button onClick={createPersonalGoalClick} variant="default" className="w-full">
                  Створити
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
