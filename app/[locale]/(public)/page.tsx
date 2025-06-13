import LoginButton from '@/components/Buttons/LoginButton'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-5xl">In Building</p>
      <LoginButton />
    </div>
  )
}
