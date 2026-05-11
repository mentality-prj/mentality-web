'use client'

import { useState } from 'react'
import { ArrowLeftRight, Clock, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useAuth } from '@/context/AuthProvider'
import { compareTranslateService } from '@/requests/translateService'
import { getLocaleNativeLabel, type SupportedLanguage, supportedLanguages } from '@/types/languages'
import type { TranslateModelResult } from '@/types/translateService'
import { Button } from '@/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

const TRANSLATION_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
] as const

type CompareState = {
  modelA: TranslateModelResult
  modelB: TranslateModelResult
} | null

function ResultPanel({ result, label }: { result: TranslateModelResult; label: string }) {
  const modelEntry = TRANSLATION_MODELS.find((m) => m.value === result.model)
  return (
    <div className="flex flex-1 flex-col gap-sm rounded-md border border-border bg-background-alt p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-textcolor-primary">
          {label}: {modelEntry?.label ?? result.model}
        </span>
        <span className="flex items-center gap-1 text-xs text-textcolor-secondary">
          <Clock size={12} />
          {result.durationMs} ms
        </span>
      </div>
      <div className="min-h-[120px] whitespace-pre-wrap rounded border border-border bg-white p-3 text-sm text-textcolor-primary">
        {result.translation}
      </div>
    </div>
  )
}

function DiffHighlight({
  textA,
  textB,
  identicalText,
  modelALabel,
  modelBLabel,
}: {
  textA: string
  textB: string
  identicalText: string
  modelALabel: string
  modelBLabel: string
}) {
  if (textA === textB) {
    return <p className="text-center text-xs text-textcolor-secondary">{identicalText}</p>
  }

  const wordsA = textA.split(/(\s+)/)
  const wordsB = textB.split(/(\s+)/)
  const maxLen = Math.max(wordsA.length, wordsB.length)

  return (
    <div className="flex gap-md rounded-md border border-border bg-background-alt p-4">
      <div className="flex-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-textcolor-secondary">{modelALabel}</p>
        <p className="text-sm leading-relaxed">
          {wordsA.map((word, i) => {
            const isDiff = word.trim() !== '' && word !== wordsB[i as number]
            return (
              <span key={i} className={isDiff ? 'rounded bg-yellow-100 px-0.5 text-yellow-800' : ''}>
                {word}
              </span>
            )
          })}
          {wordsA.length < maxLen &&
            wordsB.slice(wordsA.length).map((w, i) => (
              <span key={`extra-${i}`} className="rounded bg-red-100 px-0.5 text-red-700 line-through">
                {w}
              </span>
            ))}
        </p>
      </div>
      <div className="flex-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-textcolor-secondary">{modelBLabel}</p>
        <p className="text-sm leading-relaxed">
          {wordsB.map((word, i) => {
            const isDiff = word.trim() !== '' && word !== wordsA[i as number]
            return (
              <span key={i} className={isDiff ? 'rounded bg-blue-100 px-0.5 text-blue-800' : ''}>
                {word}
              </span>
            )
          })}
          {wordsB.length < maxLen &&
            wordsA.slice(wordsB.length).map((w, i) => (
              <span key={`extra-${i}`} className="rounded bg-red-100 px-0.5 text-red-700 line-through">
                {w}
              </span>
            ))}
        </p>
      </div>
    </div>
  )
}

export default function TranslateServicePage() {
  const t = useTranslations('pages.Admin.translate-service')
  const { session, status } = useAuth()

  const [text, setText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState<SupportedLanguage>('en')
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>('uk')
  const [modelA, setModelA] = useState<string>(TRANSLATION_MODELS[0].value)
  const [modelB, setModelB] = useState<string>(TRANSLATION_MODELS[2].value)
  const [results, setResults] = useState<CompareState>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isAuthReady = status === 'authenticated' && !!session?.user

  const handleSwapModels = () => {
    setModelA(modelB)
    setModelB(modelA)
  }

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
  }

  const handleTranslate = async () => {
    const normalizedText = text.trim()

    if (!normalizedText) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await compareTranslateService(session, {
        text: normalizedText,
        modelA,
        modelB,
        targetLanguage,
        sourceLanguage,
      })

      if ('error' in response) {
        throw new Error(response.error)
      }

      setResults(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('translationFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col gap-lg pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-textcolor-primary">{t('title')}</h1>
        <p className="mt-1 text-sm text-textcolor-secondary">{t('description')}</p>
      </div>

      {/* Source text */}
      <div className="flex flex-col gap-xs">
        <label className="text-sm font-medium text-textcolor-primary">{t('sourceText')}</label>
        <Textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('sourceTextPlaceholder')}
          className="border-border"
        />
      </div>

      {/* Language + model selectors */}
      <div className="flex flex-wrap items-end gap-sm">
        {/* Source language */}
        <div className="flex min-w-[140px] flex-col gap-xs">
          <label className="text-sm font-medium text-textcolor-primary">{t('sourceLanguage')}</label>
          <Select value={sourceLanguage} onValueChange={(v) => setSourceLanguage(v as SupportedLanguage)}>
            <SelectTrigger className="h-10 rounded-md border-border bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="dropdown-menu-item">
                    {getLocaleNativeLabel(lang)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={t('swapLanguages')}
          onClick={handleSwapLanguages}
          className="mb-0.5"
        >
          <ArrowLeftRight size={16} />
        </Button>

        {/* Target language */}
        <div className="flex min-w-[140px] flex-col gap-xs">
          <label className="text-sm font-medium text-textcolor-primary">{t('targetLanguage')}</label>
          <Select value={targetLanguage} onValueChange={(v) => setTargetLanguage(v as SupportedLanguage)}>
            <SelectTrigger className="h-10 rounded-md border-border bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="dropdown-menu-item">
                    {getLocaleNativeLabel(lang)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mx-2 hidden h-10 w-px self-end bg-border sm:block" />

        {/* Model A */}
        <div className="flex min-w-[180px] flex-col gap-xs">
          <label className="text-sm font-medium text-textcolor-primary">{t('modelA')}</label>
          <Select value={modelA} onValueChange={setModelA}>
            <SelectTrigger className="h-10 rounded-md border-border bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {TRANSLATION_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="dropdown-menu-item">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" aria-label={t('swapModels')} onClick={handleSwapModels} className="mb-0.5">
          <ArrowLeftRight size={16} />
        </Button>

        {/* Model B */}
        <div className="flex min-w-[180px] flex-col gap-xs">
          <label className="text-sm font-medium text-textcolor-primary">{t('modelB')}</label>
          <Select value={modelB} onValueChange={setModelB}>
            <SelectTrigger className="h-10 rounded-md border-border bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {TRANSLATION_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="dropdown-menu-item">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleTranslate} disabled={loading || !text.trim() || !isAuthReady} className="mb-0.5 ml-auto">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {t('translating')}
            </span>
          ) : (
            t('translate')
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-background-error rounded-md border border-border-error px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-md">
          <h2 className="text-lg font-semibold text-textcolor-primary">{t('resultsHeading')}</h2>

          <div className="flex flex-col gap-md sm:flex-row">
            <ResultPanel result={results.modelA} label={t('modelA')} />
            <ResultPanel result={results.modelB} label={t('modelB')} />
          </div>

          <div className="flex flex-col gap-xs">
            <h3 className="text-sm font-semibold text-textcolor-primary">{t('diffHeading')}</h3>
            <DiffHighlight
              textA={results.modelA.translation}
              textB={results.modelB.translation}
              identicalText={t('identicalTranslations')}
              modelALabel={t('modelA')}
              modelBLabel={t('modelB')}
            />
          </div>
        </div>
      )}
    </main>
  )
}
