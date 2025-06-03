type SectionCardProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export const SectionCard = ({ title, subtitle, children }: SectionCardProps) => {
  return (
    <div className="w-full max-w-[527px] rounded-default bg-surface-white p-8">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-base font-normal">{subtitle}</div>
      </div>
      {children}
    </div>
  )
}
