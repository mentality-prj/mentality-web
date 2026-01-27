import React from 'react'

type CardsListProps<T extends { id?: string | number; key?: string } = { id?: string | number; key?: string }> = {
  items: T[]
  CardComponent: React.ComponentType<{ item: T; tools?: React.ReactNode; className?: string }>
  getKey?: (item: T) => string
  renderTools?: (item: T) => React.ReactNode
  className?: string
  gridClassName?: string
}

export default function CardsList<
  T extends { id?: string | number; key?: string } = { id?: string | number; key?: string },
>({
  items,
  CardComponent,
  getKey,
  renderTools,
  className = '',
  gridClassName = 'grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-2',
}: CardsListProps<T>) {
  const keyFn = getKey || ((item: T) => String(item.id ?? item.key ?? Math.random()))

  return (
    <div className={className}>
      <ul className={gridClassName}>
        {items.map((item) => (
          <li key={keyFn(item)} className="h-full flex-1">
            <CardComponent item={item} tools={renderTools ? renderTools(item) : undefined} />
          </li>
        ))}
      </ul>
    </div>
  )
}
