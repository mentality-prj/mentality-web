import { createResearchHistoryDatasetExportFile } from '@/helpers/researchHistoryDatasetExport'

describe('researchHistoryDatasetExport', () => {
  const dataset = {
    total: 1,
    columns: ['values'],
    items: [
      {
        id: 'row-1',
        subjectId: 'subject-1',
        cohort: 'group-1',
        dateRange: '2026-05-01 - 2026-05-31',
        diagnostics: 'Stable',
        fields: { values: '{"riskLevel":"medium"}' },
        raw: {},
      },
    ],
  }
  const options = {
    cohortLabel: 'Cohort',
    cohortNamesById: new Map([['group-1', 'Core Team']]),
    dateRangeLabel: 'Date range',
    diagnosticsLabel: 'Diagnostics',
    fileBaseName: 'research-history-dataset-project-1',
    notAvailableLabel: 'Not available',
    subjectLabel: 'Participant',
    subjectLabelPrefix: 'Participant',
  }

  it('creates csv content with localized headers and values', () => {
    const file = createResearchHistoryDatasetExportFile(dataset, 'csv', options)

    expect(file.fileName).toBe('research-history-dataset-project-1.csv')
    expect(file.content).toContain('"Participant","Cohort","Date range","Diagnostics","values"')
    expect(file.content).toContain(
      '"Participant 1","Core Team","2026-05-01 - 2026-05-31","Stable","{""riskLevel"":""medium""}"'
    )
  })

  it('creates xml content for the current table shape', () => {
    const file = createResearchHistoryDatasetExportFile(dataset, 'xml', options)

    expect(file.fileName).toBe('research-history-dataset-project-1.xml')
    expect(file.content).toContain('<historyDataset>')
    expect(file.content).toContain('<cell header="Participant">Participant 1</cell>')
    expect(file.content).toContain('<cell header="Cohort">Core Team</cell>')
  })

  it('creates excel-compatible workbook content', () => {
    const file = createResearchHistoryDatasetExportFile(dataset, 'excel', options)

    expect(file.fileName).toBe('research-history-dataset-project-1.xls')
    expect(file.content).toContain('<?mso-application progid="Excel.Sheet"?>')
    expect(file.content).toContain('<Worksheet ss:Name="History Dataset">')
    expect(file.content).toContain('<Data ss:Type="String">Core Team</Data>')
  })
})
