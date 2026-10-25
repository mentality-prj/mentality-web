import { ContactForm } from '@/components/features/Contact/ContactForm'

type Props = { searchParams: Promise<{ source?: string; intent?: string; segment?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams
  const intent =
    params.source === 'docs' && (params.intent === 'funding' || params.intent === 'demo') ? params.intent : undefined
  const validSegments = intent === 'funding' ? ['investment', 'grant'] : ['teams', 'individuals', 'research']
  const segment = validSegments.includes(params.segment ?? '') ? params.segment : undefined
  return (
    <div className="px-4 tablet:px-6 md:px-8 lg:px-10">
      <ContactForm source={intent ? 'docs' : undefined} intent={intent} segment={segment} />
    </div>
  )
}
