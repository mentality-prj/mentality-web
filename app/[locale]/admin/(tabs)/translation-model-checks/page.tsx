'use client'

import { type ReactElement, useState } from 'react'
import { AlertTriangle, ArrowLeftRight, CheckCircle2, GitCompareArrows, Languages, Loader2, Server } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { useAuth } from '@/context/AuthProvider'
import {
  checkTranslationModelChecksHello,
  runCompareTranslationModelCheck,
  runFacebookTranslationModelCheck,
  runHelsinkiTranslationModelCheck,
} from '@/helpers/translationModelChecksApi'
import type { SupportedLanguage } from '@/types/languages'
import { getLocaleNativeLabel, supportedLanguages } from '@/types/languages'
import {
  TranslationModelCheckResult,
  TranslationModelChecksAction,
  TranslationModelChecksCompareResponse,
  TranslationModelChecksHelloResponse,
} from '@/types/translationModelChecks'
import { Button } from '@/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

const MAX_TEXT_LENGTH = 5000

function getModelLabel(model: 'helsinki' | 'facebook') {
  switch (model) {
    case 'helsinki':
      return 'Helsinki'
    case 'facebook':
      return 'Facebook'
  }
}

function StatusBanner({ tone, text }: { tone: 'error' | 'success' | 'warning'; text: string }) {
  let type: 'error' | 'success' | 'warn'
  let icon: ReactElement

  switch (tone) {
    case 'error':
      type = 'error'
      icon = <AlertTriangle size={22} />
      break
    case 'success':
      type = 'success'
      icon = <CheckCircle2 size={22} />
      break
    case 'warning':
      type = 'warn'
      icon = <AlertTriangle size={22} />
      break
  }

  return (
    <Card type={type}>
      <div className="flex items-center gap-xs text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center">{icon}</div>
        <h4 className="mb-0">{text}</h4>
      </div>
    </Card>
  )
}

function ResultCard({ result, t }: { result: TranslationModelCheckResult; t: (key: string) => string }) {
  return (
    <Card className="h-full">
      <div className="flex flex-col gap-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-textcolor-primary">
          <Languages size={16} />
          <span>{getModelLabel(result.model)}</span>
        </div>

        <div className="flex flex-col gap-xs">
          <h5 className="remark">{t('translation')}</h5>
          <Card type="ghost" className="min-h-[140px]">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-textcolor-primary">
              {result.translation || t('emptyTranslation')}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  )
}

export default function TranslationModelChecksPage() {
  const t = useTranslations('pages.Admin.translation-model-checks')
  const { session, status } = useAuth()

  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>('uk')
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('pl')
  const [helloResult, setHelloResult] = useState<TranslationModelChecksHelloResponse | null>(null)
  const [singleResult, setSingleResult] = useState<TranslationModelCheckResult | null>(null)
  const [compareResult, setCompareResult] = useState<TranslationModelChecksCompareResponse | null>(null)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [isCheckingHost, setIsCheckingHost] = useState(false)
  const [selectedAction, setSelectedAction] = useState<TranslationModelChecksAction | null>(null)
  const [translationAction, setTranslationAction] = useState<TranslationModelChecksAction | null>(null)

  const hasText = text.trim().length > 0
  const isAuthReady = status === 'authenticated' && !!session?.user
  const isTranslationBusy = translationAction !== null
  const isFacebookPairValid =
    (sourceLang === 'uk' && targetLang === 'pl') || (sourceLang === 'pl' && targetLang === 'uk')

  const helsinkiDisabled = !isAuthReady || !hasText || isTranslationBusy
  const facebookDisabled = !isAuthReady || !hasText || !isFacebookPairValid || isTranslationBusy
  const compareDisabled = !isAuthReady || !hasText || !isFacebookPairValid || isTranslationBusy

  const handleSwapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
  }

  const handleCheckHost = async () => {
    setIsCheckingHost(true)
    setServiceError(null)
    setHelloResult(null)

    try {
      const result = await checkTranslationModelChecksHello(session)
      setHelloResult(result)
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : t('unexpectedError'))
    } finally {
      setIsCheckingHost(false)
    }
  }

  const handleRun = async (action: TranslationModelChecksAction) => {
    if (!hasText) {
      return
    }

    setSelectedAction(action)
    setTranslationAction(action)
    setTranslationError(null)
    setSingleResult(null)
    setCompareResult(null)

    const payload = {
      text: text.trim(),
      sourceLang,
      targetLang,
    }

    try {
      if (action === 'helsinki') {
        const result = await runHelsinkiTranslationModelCheck(session, payload)
        setSingleResult(result)
        return
      }

      if (action === 'facebook') {
        const result = await runFacebookTranslationModelCheck(session, payload)
        setSingleResult(result)
        return
      }

      const result = await runCompareTranslationModelCheck(session, payload)
      setCompareResult(result)
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : t('unexpectedError'))
    } finally {
      setTranslationAction(null)
    }
  }

  return (
    <main className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-textcolor-primary">{t('title')}</h1>
        <p className="text-sm text-textcolor-secondary">{t('description')}</p>
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-lg font-semibold text-textcolor-primary">
              <Server size={18} />
              <span>{t('serviceStatus')}</span>
            </div>
            <p className="text-sm text-textcolor-secondary">{t('serviceStatusDescription')}</p>
          </div>

          <Button onClick={handleCheckHost} disabled={isCheckingHost || !isAuthReady}>
            {isCheckingHost && <Loader2 size={16} className="mr-2 animate-spin" />}
            {isCheckingHost ? t('checkingHost') : t('checkHost')}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {serviceError && <StatusBanner tone="error" text={serviceError} />}
          {helloResult && !serviceError && <StatusBanner tone="success" text={t('helloSuccess')} />}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-lg font-semibold text-textcolor-primary">
            <GitCompareArrows size={18} />
            <span>{t('translationTest')}</span>
          </div>
          <p className="text-sm text-textcolor-secondary">{t('translationTestDescription')}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-textcolor-primary">{t('text')}</label>
              <span className="text-xs text-textcolor-secondary">
                {t('characters')}: {text.length}/{MAX_TEXT_LENGTH}
              </span>
            </div>
            <Textarea
              rows={7}
              value={text}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(event) => setText(event.target.value)}
              placeholder={t('textPlaceholder')}
              className="border-border"
            />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-[160px] flex-col gap-2">
              <label className="text-sm font-medium text-textcolor-primary">{t('sourceLanguage')}</label>
              <Select value={sourceLang} onValueChange={(value) => setSourceLang(value as SupportedLanguage)}>
                <SelectTrigger className="h-10 rounded-xl border-border bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {supportedLanguages.map((language) => (
                      <SelectItem key={language} value={language} className="dropdown-menu-item">
                        {getLocaleNativeLabel(language)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="mb-0.5"
              aria-label={t('swapLanguages')}
              onClick={handleSwapLanguages}
            >
              <ArrowLeftRight size={16} />
            </Button>

            <div className="flex min-w-[160px] flex-col gap-2">
              <label className="text-sm font-medium text-textcolor-primary">{t('targetLanguage')}</label>
              <Select value={targetLang} onValueChange={(value) => setTargetLang(value as SupportedLanguage)}>
                <SelectTrigger className="h-10 rounded-xl border-border bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {supportedLanguages.map((language) => (
                      <SelectItem key={language} value={language} className="dropdown-menu-item">
                        {getLocaleNativeLabel(language)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isFacebookPairValid && <StatusBanner tone="warning" text={t('facebookPairWarning')} />}

          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedAction === 'helsinki' ? 'default' : 'secondary'}
              onClick={() => handleRun('helsinki')}
              disabled={helsinkiDisabled}
            >
              {translationAction === 'helsinki' && <Loader2 size={16} className="mr-2 animate-spin" />}
              {translationAction === 'helsinki' ? t('runningHelsinki') : t('runHelsinki')}
            </Button>

            <Button
              variant={selectedAction === 'facebook' ? 'default' : 'secondary'}
              onClick={() => handleRun('facebook')}
              disabled={facebookDisabled}
            >
              {translationAction === 'facebook' && <Loader2 size={16} className="mr-2 animate-spin" />}
              {translationAction === 'facebook' ? t('runningFacebook') : t('runFacebook')}
            </Button>

            <Button
              variant={selectedAction === 'compare' ? 'default' : 'secondary'}
              onClick={() => handleRun('compare')}
              disabled={compareDisabled}
            >
              {translationAction === 'compare' && <Loader2 size={16} className="mr-2 animate-spin" />}
              {translationAction === 'compare' ? t('runningCompare') : t('compare')}
            </Button>
          </div>

          {translationError && <StatusBanner tone="error" text={translationError} />}

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-base font-semibold text-textcolor-primary">
              <CheckCircle2 size={16} />
              <span>{t('results')}</span>
            </div>

            {!singleResult && !compareResult && !translationError && <Card type="ghost" text={t('noResults')} />}

            {singleResult && <ResultCard result={singleResult} t={t} />}

            {compareResult && (
              <div className="grid gap-4 xl:grid-cols-2">
                <ResultCard result={compareResult.helsinki} t={t} />
                <ResultCard result={compareResult.facebook} t={t} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
