import { useTranslations } from 'next-intl'

import DeliveryDetailsForm from '@/components/CheckoutForms/DeliveryDetailsForm'

const DeliveryDetailsPage = () => {
  const t = useTranslations('ShopPage.Checkout')
  return (
    <div>
      <h2 className="text-center">{t('DeliveryDetails')}</h2>
      <DeliveryDetailsForm />
    </div>
  )
}

export default DeliveryDetailsPage
