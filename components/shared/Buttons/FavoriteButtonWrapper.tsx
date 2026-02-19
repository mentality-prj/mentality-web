'use client'
import useFavorite from '@/hooks/useFavorite'
import { ItemType } from '@/types/itemTypes'

import FavoriteButton from './FavoriteButton'

interface FavoriteButtonWrapperProps {
  itemType: ItemType
  itemId: string
}

const FavoriteButtonWrapper = ({ itemType, itemId }: FavoriteButtonWrapperProps) => {
  const { isFavorite, setIsFavorite } = useFavorite(itemType, itemId, false)

  return <FavoriteButton itemType={itemType} itemId={itemId} isFavorite={isFavorite} onChange={setIsFavorite} />
}

export default FavoriteButtonWrapper
