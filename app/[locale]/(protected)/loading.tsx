export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-4" aria-busy="true" aria-label="Завантаження">
      <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}
