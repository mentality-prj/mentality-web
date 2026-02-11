import AffirmationCard from '@/components/Affirmations/AffirmationCard'
import FavoriteButton from '@/components/Buttons/FavoriteButton'
import CardsList from '@/components/Cards/CardsList'
import ExerciseCard from '@/components/Exercises/ExerciseCard'
import TipCard from '@/components/Tips/TipCard'
import { useSavedFilters } from '@/context/savedFilterContext'
import { AffirmationEntity, ExerciseEntity, FavoriteEntity, TipEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS, ItemType } from '@/types/itemTypes'
import { SORT_ORDER } from '@/types/sort'

type Props = {
  items: FavoriteEntity[]
}

function normalizePluralType(f: FavoriteEntity): ItemType {
  const raw = (f.itemType || (f.item && (f.item as Record<string, unknown>).type) || '').toString()
  const plural = raw.endsWith('s') ? raw : `${raw}s`
  if ((ITEM_TYPE_DEFS as Record<string, string>)[plural as keyof typeof ITEM_TYPE_DEFS]) return plural as ItemType
  if (plural.startsWith('affirm')) return 'affirmations'
  if (plural.startsWith('tip')) return 'tips'
  if (plural.startsWith('exerc')) return 'exercises'
  return 'affirmations'
}

export const FilteredList = ({ items }: Props) => {
  const { filters } = useSavedFilters()
  const SortOrder = filters.order
  const filter = filters.categories

  const getSortedItems = () => {
    let result = items
    if (filter) {
      result = result.filter((fav) => {
        const itemData = fav.item as Record<string, unknown>
        const raw = (fav.itemType || '').toString()
        // For exercises, check category field; for others, remove 's' from type
        const type = itemData?.category ? String(itemData.category) : raw.replace(/s$/, '')
        return type === filter
      })
    }
    return [...result].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return SortOrder === SORT_ORDER.NEWEST ? timeB - timeA : timeA - timeB
    })
  }

  const CardComponent: React.ComponentType<{ item: FavoriteEntity; tools?: React.ReactNode; className?: string }> = ({
    item: fav,
    tools,
    className,
  }) => {
    const payload = fav.item as unknown as AffirmationEntity | TipEntity | ExerciseEntity
    const typePlural = normalizePluralType(fav)

    if (typePlural === ITEM_TYPE_DEFS.tips)
      return <TipCard item={payload as TipEntity} tools={tools} className={className} />
    if (typePlural === ITEM_TYPE_DEFS.exercises)
      return <ExerciseCard item={payload as ExerciseEntity} tools={tools} className={className} />
    return <AffirmationCard item={payload as AffirmationEntity} tools={tools} className={className} />
  }

  const renderTools = (fav: FavoriteEntity) => {
    const typePlural = normalizePluralType(fav)
    return (
      <FavoriteButton itemType={typePlural} itemId={String(fav.itemId ?? fav.item?.id ?? fav.id)} isFavorite={true} />
    )
  }

  return (
    <CardsList
      items={getSortedItems()}
      CardComponent={CardComponent}
      getKey={(i) => String(i.itemId ?? i.id)}
      renderTools={renderTools}
    />
  )
}
