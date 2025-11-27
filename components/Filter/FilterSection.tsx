export function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="pb-5">{title}</div>
      {children}
    </div>
  )
}
