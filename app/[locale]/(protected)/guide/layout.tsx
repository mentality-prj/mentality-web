import GuideInnerMenu from '@/components/Guide/GuideInnerMenu'

export const metadata = {
  title: 'Guide',
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <GuideInnerMenu />
      <div>{children}</div>
    </section>
  )
}
