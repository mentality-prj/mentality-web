import { SupportedLanguage } from '@/types/languages'

export default function ContactsPage({ params }: { params: { locale: SupportedLanguage } }) {
  console.log('params', params)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Contacts</h1>

      <p className="mb-6">If you need help or want to say hi, use one of the channels below.</p>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Support</h2>
        <p>
          Email:{' '}
          <a href="mailto:support@mentality.app" className="text-blue-600">
            support@mentality.app
          </a>
        </p>
        <p>Response time: typically within 48 hours.</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Partnerships & Press</h2>
        <p>
          Email:{' '}
          <a href="mailto:press@mentality.app" className="text-blue-600">
            press@mentality.app
          </a>
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Feedback</h2>
        <p>
          We appreciate feedback and bug reports — please include as much detail as possible (steps to reproduce,
          screenshots, browser / device). Feature requests are also welcome.
        </p>
      </section>
    </main>
  )
}
