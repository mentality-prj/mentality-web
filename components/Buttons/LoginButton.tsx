import { useTranslations } from 'next-intl'

import { redirectToSignin } from '@/actions/redirectToSignin'
import { LoginIcon } from '@/ds/icons/login'

export default function LoginButton() {
  const t = useTranslations('Navigation')

  return (
    <form action={redirectToSignin}>
      <button
        className="flex gap-2 py-2 pr-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-0"
        type="submit"
      >
        <LoginIcon />
        <span className="group-data-[collapsible=icon]:hidden">{t('Login')}</span>
      </button>
    </form>
  )
}
