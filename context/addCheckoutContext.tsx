'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { NewCheckout, newCheckoutInitialValuesSchema, newCheckoutInitialValuesType } from '@/schema'

const defaultCheckout: newCheckoutInitialValuesType = {
  fullName: '',
  city: '',
  deliveryMethod: '',
  deliveryDate: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
}

type AddCheckoutContextType = {
  newCheckoutData: newCheckoutInitialValuesType
  updateNewCheckoutDetails: (checkoutDetails: Partial<NewCheckout>) => void
  dataLoaded: boolean
  resetData: () => void
}

const LOCALE_STORAGE_KEY = 'newCheckoutData'

export const AddCheckoutContext = createContext<AddCheckoutContextType | null>(null)
export const AddCheckoutContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [newCheckoutData, setNewCheckoutData] = useState<newCheckoutInitialValuesType>(defaultCheckout)
  const [dataLoaded, setDataLoaded] = useState(false)

  const readFromLocalStoarge = () => {
    const dataString = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (!dataString) {
      return setNewCheckoutData(defaultCheckout)
    }
    const validated = newCheckoutInitialValuesSchema.safeParse(JSON.parse(dataString))
    if (validated.success) {
      setNewCheckoutData(validated.data)
    } else {
      setNewCheckoutData(defaultCheckout)
    }
  }
  const writeToLocalStorage = useCallback(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(newCheckoutData))
  }, [newCheckoutData])

  useEffect(() => {
    readFromLocalStoarge()
    setDataLoaded(true)
  }, [])
  useEffect(() => {
    if (dataLoaded) {
      writeToLocalStorage()
    }
  }, [newCheckoutData, dataLoaded, writeToLocalStorage])

  const updateNewCheckoutDetails = (checkoutDetails: Partial<NewCheckout>) => {
    setNewCheckoutData((prev) => ({ ...prev, ...checkoutDetails }))
  }

  const resetData = () => {
    setNewCheckoutData(defaultCheckout)
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(defaultCheckout))
  }

  return (
    <AddCheckoutContext.Provider value={{ newCheckoutData, updateNewCheckoutDetails, dataLoaded, resetData }}>
      {children}
    </AddCheckoutContext.Provider>
  )
}

export function useAddCheckoutContext() {
  const context = useContext(AddCheckoutContext)
  if (!context) {
    throw new Error('useAddCheckoutContext must be used within an AddDealContext')
  }
  return context
}
