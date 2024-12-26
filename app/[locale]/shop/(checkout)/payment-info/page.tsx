import { useTranslations } from 'next-intl'

import PaymentInfoForm from '@/components/CheckoutForms/PaymentInfoForm'

const PaymentInfoPage = () => {
  const t = useTranslations('ShopPage.Checkout')
  return (
    <div>
      <h2 className="text-center">{t('PaymentInfo')}</h2>
      <PaymentInfoForm />
    </div>
  )
}

export default PaymentInfoPage
