import { CustomCardProps } from '@/types/customCard'

import Card from '../../components/Cards/Card'

const CustomCard: React.FC<CustomCardProps> = ({
  icon,
  title,
  date,
  button,
  text,
  hrefLink,
  textLink,
  badge,
  tagList,
  backgroundIcon,
}) => {
  return (
    <Card className="text-gray-900">
      {backgroundIcon && (
        <div className="absolute -right-4 -top-4 text-textcolor-secondary [&_svg]:size-[108px]">{backgroundIcon}</div>
      )}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-xs text-base font-normal leading-[120%] text-[var(--title-color)]">
          {icon && <div className="h-6 w-6 [&>svg]:h-6 [&>svg]:w-6">{icon}</div>}
          {title}
          {date && <span className="ml-2 text-xs text-gray-500">{date}</span>}
        </div>
        {button && button}
      </div>
      <div className="z-10 p-0 text-base font-normal text-textcolor-secondary">{text}</div>
      {(textLink && hrefLink) || badge || (tagList && tagList.length > 0) ? (
        <div className="mt-auto flex w-full p-0">
          {textLink && hrefLink && (
            <a href={hrefLink} className="ml-auto mt-1 text-blue-600 underline">
              {textLink}
            </a>
          )}
          {badge && <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-blue-800">{badge}</span>}
          {tagList && (
            <div className="ml-2 flex gap-1">
              {tagList.map((tagText) => (
                <span key={tagText} className="rounded bg-gray-100 px-2 py-1 text-xs">
                  {tagText}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </Card>
  )
}

export default CustomCard
