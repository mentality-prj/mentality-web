'use client'
import useFavorite from '@/hooks/useFavorite'
import { ItemType } from '@/types/itemTypes'

import FavoriteButton from './FavoriteButton'

interface FavoriteButtonWrapperProps {
  itemType: ItemType
  itemId: string
  className?: string
}

export const FavoriteButtonWrapper = ({ itemType, itemId, className }: FavoriteButtonWrapperProps) => {
  const { isFavorite, setIsFavorite } = useFavorite(itemType, itemId, false)

  return (
    <FavoriteButton
      className={className}
      itemType={itemType}
      itemId={itemId}
      isFavorite={isFavorite}
      onChange={setIsFavorite}
    />
  )
}
