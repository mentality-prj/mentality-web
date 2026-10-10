export default function AdminLoading() {
  return (
    <div className="flex w-full flex-col gap-4 p-6" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded-md bg-slate-200" />
      <div className="h-64 w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  )
}
