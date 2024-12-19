'use client'

import { useState } from 'react'
import { Button } from '@nextui-org/react'
import Image from 'next/image'

import { CartItemProps } from '@/types/cart'

interface CartItemPropsWithHandler extends CartItemProps {
  onQuantityChange: (updatedItem: CartItemProps) => void
}

const CartItem = ({ id, name, price, quantity, image, description, onQuantityChange }: CartItemPropsWithHandler) => {
  const [quantityProduct, setQuantityProduct] = useState(quantity)

  const handleUpdateQuntity = (operation: '+' | '-') => {
    let newQuantity = quantityProduct
    if (operation === '+') {
      newQuantity = quantityProduct + 1
    } else {
      if (quantityProduct > 1) {
        newQuantity = quantityProduct - 1
        setQuantityProduct(newQuantity)
        onQuantityChange({ id, name, price, quantity: newQuantity, image, description })
      }
    }

    setQuantityProduct(newQuantity)
    onQuantityChange({ id, name, price, quantity: newQuantity, image, description })
  }

  return (
    <div className="flex gap-2 p-1">
      <div className="flex w-full max-w-[200px] items-center justify-center">
        <Image className="object-contain" width={200} height={200} src={image} alt={name} />
      </div>
      <div className="flex flex-col">
        <div className="">Name: {name}</div>
        <div className="">Price: {price} $</div>
        <div className="">Description: {description}</div>
        <div className="flex items-center gap-1.5">
          <Button onPress={() => handleUpdateQuntity('-')}>-</Button>
          <span>{quantityProduct}</span>
          <Button onPress={() => handleUpdateQuntity('+')}>+</Button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
