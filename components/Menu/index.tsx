'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { menu, RoutesTitles } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Sheet, SheetContent, SheetTrigger } from '@/ds/shadcn/sheet'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export default function MenuComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const lastSegment = pathname.split('/').pop() || ''

  const isPageActive = (key: string) => key.endsWith(lastSegment)

  return (
    <nav className="w-full border-b p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="hidden gap-4 sm:flex">
          {menu.map((item) => (
            <Link
              key={item.key}
              href={item.link}
              className={cn(
                'rounded-lg px-4 py-3 transition-colors',
                isPageActive(item.link) ? 'bg-muted text-primary' : 'hover:bg-muted'
              )}
            >
              {RoutesTitles[item.key]}
            </Link>
          ))}
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="secondary" className="sm:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="mt-16 w-64">
            <div className="flex flex-col gap-4">
              {menu.map((item) => (
                <Link
                  key={item.key}
                  href={item.link}
                  className={cn(
                    'block w-full rounded-lg p-3 transition-colors',
                    isPageActive(item.link) ? 'bg-muted text-primary' : 'hover:bg-muted'
                  )}
                >
                  {RoutesTitles[item.key]}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
