import { ContactForm } from '@/components/features/Contact/ContactForm'

type Props = { searchParams: Promise<{ source?: string; intent?: string; segment?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams
  const source = params.source === 'docs' && params.intent === 'demo' ? 'docs' : undefined
  const segment = ['teams', 'individuals', 'research'].includes(params.segment ?? '') ? params.segment : undefined
  return (
    <div className="px-4 tablet:px-6 md:px-8 lg:px-10">
      <ContactForm source={source} segment={segment} />
    </div>
  )
}
