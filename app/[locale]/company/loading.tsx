export default function CompanyLoading() {
  return (
    <div className="flex w-full flex-col gap-4 p-6" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}
