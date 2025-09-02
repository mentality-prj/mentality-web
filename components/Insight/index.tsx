export const Insight = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-3 rounded-default bg-surface-primary p-6">
      <span className="h-3 w-3 rounded-full bg-[#16A34A]"></span>
      <span className="text-base text-textcolor-secondary">{text}</span>
    </div>
  )
}
