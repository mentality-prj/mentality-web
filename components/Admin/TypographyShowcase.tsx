import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

export function TypographyShowcase() {
  const t = useTranslations('components.Admin.TypographyShowcase')

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">{t('title')}</h2>

      <div className="space-y-8">
        {/* Headings */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.headings')}</h3>
          <div className="space-y-3">
            <div>
              <span className="text-muted text-xs">h1: </span>
              <h1>Heading 1 - text-4xl leading-[130%]</h1>
            </div>
            <div>
              <span className="text-muted text-xs">h2: </span>
              <h2>Heading 2 - text-2xl leading-[130%]</h2>
            </div>
            <div>
              <span className="text-muted text-xs">h3: </span>
              <h3>Heading 3 - text-xl</h3>
            </div>
            <div>
              <span className="text-muted text-xs">h4: </span>
              <h4>Heading 4 - text-lg font-medium</h4>
            </div>
            <div>
              <span className="text-muted text-xs">h5: </span>
              <h5>Heading 5 - text-base font-medium</h5>
            </div>
            <div>
              <span className="text-muted text-xs">h6: </span>
              <h6>Heading 6 - text-sm font-medium</h6>
            </div>
          </div>
        </section>

        {/* Landing Page Headings */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.landingHeadings')}</h3>
          <div className="space-y-3">
            <div>
              <span className="text-muted text-xs">landing-h1: </span>
              <div className="landing-h1">Landing H1 - text-5xl leading-[130%]</div>
            </div>
            <div>
              <span className="text-muted text-xs">landing-h2: </span>
              <div className="landing-h2">Landing H2 - text-3xl leading-[130%]</div>
            </div>
            <div>
              <span className="text-muted text-xs">landing-h3: </span>
              <div className="landing-h3">Landing H3 - text-xl</div>
            </div>
          </div>
        </section>

        {/* Text Color Classes */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.textColors')}</h3>
          <div className="space-y-2">
            <div className="text-title">text-title - hsl(var(--title-color)) #3d4e5c</div>
            <div className="text-title-light">text-title-light - hsl(var(--title-color-light)) #5d7a91</div>
            <div className="text-reversed bg-primary p-2">text-reversed - hsl(var(--reversed)) white on primary</div>
            <div className="text-accent">text-accent - hsl(var(--accent)) violet-500</div>
            <div className="text-remark">text-remark - hsl(var(--text-muted)) muted gray</div>
            <div style={{ color: 'hsl(var(--text-primary))' }}>text-primary - slate-900 #1e293b</div>
            <div style={{ color: 'hsl(var(--text-secondary))' }}>text-secondary - slate-600 #475569</div>
            <div style={{ color: 'hsl(var(--text-tertiary))' }}>text-tertiary - slate-700 #334155</div>
            <div style={{ color: 'hsl(var(--text-muted))' }}>text-muted - darker gray #6b7280</div>
          </div>
        </section>

        {/* Text Utilities */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.utilities')}</h3>
          <div className="space-y-2">
            <div className="sup">sup - text-xs with muted color</div>
            <div className="remark">remark - text-sm font-normal with text-remark</div>
            <Link href="#" className="default-link">
              default-link - text-sm font-medium underline
            </Link>
          </div>
        </section>

        {/* Font Families */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-primary">{t('sections.fontFamilies')}</h3>
          <div className="space-y-2">
            <div className="font-logo text-2xl">font-logo - Pacifico (for brand/logo)</div>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>Default - Inter, sans-serif</div>
          </div>
        </section>
      </div>
    </div>
  )
}
