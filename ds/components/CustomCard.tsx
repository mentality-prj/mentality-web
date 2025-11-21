// cardVariants.ts
import { cva } from 'class-variance-authority'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { CustomCardProps } from '@/types/customCard'

import { CalendarMinimalisticIcon } from '../icons/calendar-minimalistic'
import { Badge } from '../shadcn/badge'
import { ToggleGroup } from '../shadcn/toggle-group'

import { CustomLink } from './CustomLink'
import { Tag } from './Tag'

export const cardVariants = {
  base: cva(
    'flex flex-col relative w-full h-full rounded-md border-outline-secondary bg-transparent shadow-none p-6 gap-4 overflow-hidden',
    {
      variants: {
        variant: {
          default: '',
          daily: 'bg-surface-white border-none p-8',
          withDate: 'gap-5',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    }
  ),
  title: cva('flex flex-row gap-2 text-base font-medium text-textcolor-primary', {
    variants: {
      variant: {
        default: '',
        daily: 'text-sm/4 text-textcolor-tertiary',
        withDate: 'text-textcolor-tertiary',
      },
    },
  }),
  content: cva('z-10 p-0 text-base font-normal text-textcolor-secondary', {
    variants: {
      variant: {
        default: '',
        daily: 'font-medium text-textcolor-primary',
        withDate: '',
      },
    },
  }),
}

export const CustomCard: React.FC<CustomCardProps> = ({
  className,
  variant = 'default',
  text,
  backgroundIcon,
  icon,
  badge,
  button,
  date,
  tagList,
  textLink,
  hrefLink,
  title,
}) => {
  const hasFooter = (textLink && hrefLink) || !!badge || (tagList && tagList.length > 0)

  return (
    <Card className={cn(cardVariants.base({ variant }), className)}>
      {backgroundIcon && (
        <div className="absolute -right-4 -top-4 text-secondary [&_svg]:size-[108px]">{backgroundIcon}</div>
      )}
      <CardHeader className="z-10 flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className={cn(cardVariants.title({ variant }))}>
          {icon && <div className="h-6 w-6 [&>svg]:h-6 [&>svg]:w-6">{icon}</div>}
          {title}
          {date && (
            <div className="flex items-center gap-1">
              <CalendarMinimalisticIcon />
              <span>{date}</span>
            </div>
          )}
        </CardTitle>
        {button && button}
      </CardHeader>
      <CardContent className={cn(cardVariants.content({ variant }))}>{text}</CardContent>
      {hasFooter && (
        <CardFooter className="mt-auto flex w-full p-0">
          {textLink && hrefLink && (
            <CustomLink href={hrefLink} className="ml-auto mt-1">
              {textLink}
            </CustomLink>
          )}
          {badge && <Badge variant="active">{badge}</Badge>}
          {tagList && (
            <ToggleGroup type="single">
              {tagList.map((tagText) => (
                <Tag key={tagText} text={tagText} value={tagText} />
              ))}
            </ToggleGroup>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
