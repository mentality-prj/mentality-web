import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export default function MyThoughtsPage() {
  return (
    <div className="">
      <Breadcrumbs currentPage="Мої думки" breadcrumbList={[{ title: 'Мої записи', href: '/my-notes' }]} />
    </div>
  )
}
