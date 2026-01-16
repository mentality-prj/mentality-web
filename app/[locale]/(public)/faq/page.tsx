import { SupportedLanguage } from '@/types/languages'

export default function FAQPage({ params }: { params: { locale: SupportedLanguage } }) {
  console.log('params', params)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">FAQ</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">How do I reset my password?</h2>
        <p className="mt-1">
          Use the “Forgot password” link on the sign-in page and follow the instructions sent to your email.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Is my data private?</h2>
        <p className="mt-1">
          We take privacy seriously. You can read our privacy policy for details about data handling and retention.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">How do I report a bug?</h2>
        <p className="mt-1">
          Send an email to{' '}
          <a href="mailto:support@mentality.app" className="text-blue-600">
            support@mentality.app
          </a>{' '}
          with steps to reproduce and any screenshots.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Feature requests</h2>
        <p className="mt-1">
          Feature suggestions are welcome — send them to{' '}
          <a href="mailto:feedback@mentality.app" className="text-blue-600">
            feedback@mentality.app
          </a>
          .
        </p>
      </section>
    </main>
  )
}
