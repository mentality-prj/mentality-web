import GuideInnerMenu from '@/components/features/Guide/GuideInnerMenu'

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <GuideInnerMenu />
      <div>{children}</div>
    </section>
  )
}
