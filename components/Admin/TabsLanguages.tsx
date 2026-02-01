import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'
import { LocaleNativeLabels, SupportedLanguage, supportedLanguages } from '@/types/languages'

interface TabsLanguageProps {
  activeLang: SupportedLanguage
  onLangChange: (lang: SupportedLanguage) => void
}
export default function TabsLanguages({ activeLang, onLangChange }: TabsLanguageProps) {
  return (
    <>
      <Tabs value={activeLang} onValueChange={(v) => onLangChange(v as SupportedLanguage)}>
        <TabsList className="gap-2">
          {supportedLanguages.map((l) => (
            <TabsTrigger key={l} value={l}>
              {LocaleNativeLabels[l as SupportedLanguage]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  )
}
