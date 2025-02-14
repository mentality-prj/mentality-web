import { useTranslations } from 'next-intl'

import PaymentInfoForm from '@/components/CheckoutForms/PaymentInfoForm'

const PaymentInfoPage = () => {
  const t = useTranslations()
  return (
    <div>
      <h2 className="text-center">{t('ShopPage.Checkout.PaymentInfo')}</h2>
      <PaymentInfoForm />
    </div>
  )
}

export default PaymentInfoPage
