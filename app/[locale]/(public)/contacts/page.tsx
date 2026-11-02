import { ContactForm } from '@/components/features/Contact/ContactForm'

type Props = { searchParams: Promise<{ source?: string; intent?: string; segment?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams
  const source = params.source === 'docs' || params.source === 'landing' ? params.source : undefined
  // The landing page only offers demo/pilot conversations; funding intents stay docs-only.
  const intent =
    source === 'docs' && (params.intent === 'funding' || params.intent === 'demo')
      ? params.intent
      : source === 'landing' && params.intent === 'demo'
        ? params.intent
        : undefined
  const validSegments = intent === 'funding' ? ['investment', 'grant'] : ['teams', 'individuals', 'research']
  const segment = validSegments.includes(params.segment ?? '') ? params.segment : undefined
  return (
    <div className="px-4 tablet:px-6 md:px-8 lg:px-10">
      <ContactForm source={intent ? source : undefined} intent={intent} segment={segment} />
    </div>
  )
}
