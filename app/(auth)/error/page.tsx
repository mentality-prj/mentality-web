import Link from 'next/link'

export default async function Signin() {
  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col items-center gap-5">
      <h1 className="text-2xl">Error</h1>
      <Link className="rounded-lg border border-white bg-slate-500 p-4" href="/">
        Home
      </Link>
    </div>
  )
}
