'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

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

const LOCAL_STORAGE_KEY = 'new-checkout-data'

type AddCheckoutContextType = {
  newCheckoutData: newCheckoutInitialValuesType
  updateNewCheckoutDetails: (checkoutDetails: Partial<NewCheckout>) => void
  dataLoaded: boolean
  resetLocalStorage: () => void
}

export const AddCheckoutContext = createContext<AddCheckoutContextType | null>(null)

export const AddCheckoutContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [newCheckoutData, setNewCheckoutData] = useState<newCheckoutInitialValuesType>(defaultCheckout)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    readFromLocalStorage()
    setDataLoaded(true)
  }, [])

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(newCheckoutData)
    }
  }, [newCheckoutData, dataLoaded])

  const updateNewCheckoutDetails = useCallback(
    (checkoutDetails: Partial<NewCheckout>) => {
      setNewCheckoutData({ ...newCheckoutData, ...checkoutDetails })
    },
    [newCheckoutData]
  )

  const saveDataToLocalStorage = (currentCheckoutData: newCheckoutInitialValuesType) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCheckoutData))
  }

  const readFromLocalStorage = () => {
    const dataString = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!dataString) return setNewCheckoutData(defaultCheckout)

    const validated = newCheckoutInitialValuesSchema.safeParse(JSON.parse(dataString))

    if (validated.success) {
      console.log('validated true')
      setNewCheckoutData(validated.data)
    } else {
      setNewCheckoutData(defaultCheckout)
    }
  }

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setNewCheckoutData(defaultCheckout)
  }

  const contextValue = useMemo(
    () => ({
      newCheckoutData,
      dataLoaded,
      updateNewCheckoutDetails,
      resetLocalStorage,
    }),
    [newCheckoutData, dataLoaded, updateNewCheckoutDetails]
  )

  return <AddCheckoutContext.Provider value={contextValue}>{children}</AddCheckoutContext.Provider>
}

export function useAddCheckoutContext() {
  const context = useContext(AddCheckoutContext)
  if (context === null) {
    throw new Error('useAddCheckoutContext must be used within an AddDealContext')
  }
  return context
}
