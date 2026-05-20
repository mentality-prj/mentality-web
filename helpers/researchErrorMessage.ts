type ResearchMessageTranslator = (key: string) => string

export function isResearchCompanyBoundaryNotDefined(message: string): boolean {
  const normalizedMessage = message.trim().toLowerCase()
  const mentionsCompanyBoundary = normalizedMessage.includes('company boundary')
  const mentionsResearchLayer = normalizedMessage.includes('research layer')
  const mentionsMissingBoundary =
    normalizedMessage.includes('not defined') ||
    normalizedMessage.includes('не визначено') ||
    normalizedMessage.includes('undefined')

  return mentionsCompanyBoundary && mentionsResearchLayer && mentionsMissingBoundary
}

export function getLocalizedResearchErrorMessage(message: string, translate: ResearchMessageTranslator): string {
  if (isResearchCompanyBoundaryNotDefined(message)) {
    return translate('errors.companyBoundaryNotDefined')
  }

  return message
}
