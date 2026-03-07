import { MentalGamesInnerMenu } from '@/components/features/MentalGames/MentalGamesInnerMenu'

export default async function MentalGamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-md">
      <MentalGamesInnerMenu />
      {children}
    </div>
  )
}
