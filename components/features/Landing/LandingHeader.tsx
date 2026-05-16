import { AvatarMenu, LangSwitch, Logo } from '@/components/Layout/Header'
import LandingMobileMenu from '@/components/Layout/MobileNavDrawer/LandingMobileMenu'
import TopMenu from '@/components/Layout/TopMenu/TopMenu'
import { LoginButton } from '@/components/shared/LoginButton'
import { APP_VIEW_TYPE } from '@/constants/general'
import { landingMenu } from '@/constants/menu'
import { getServerSession } from '@/lib/get-server-session'

export async function LandingHeader() {
  const session = await getServerSession()
  const user = session?.user

  return (
    <header className="w-full bg-transparent py-4">
      <div className="container-max-width mx-auto flex items-center justify-between px-4 tablet:px-6 md:px-8 lg:px-10">
        <div className="flex items-center gap-xs tablet:gap-sm">
          <LandingMobileMenu />
          <Logo isHeroAnchor />
        </div>
        <div className="hidden md:block">
          <TopMenu menu={landingMenu} type={APP_VIEW_TYPE.LANDING} />
        </div>
        <div className="flex shrink-0 items-center gap-xs tablet:gap-sm">
          <LangSwitch type={APP_VIEW_TYPE.LANDING} />
          {user ? <AvatarMenu /> : <LoginButton title="login" />}
        </div>
      </div>
    </header>
  )
}
