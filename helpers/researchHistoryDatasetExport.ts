import { ResearchHistoryDataset } from '@/types/research'

type ResearchHistoryDatasetExportOptions = {
  cohortNamesById: Map<string, string>
  dateRangeLabel: string
  diagnosticsLabel: string
  fileBaseName: string
  notAvailableLabel: string
  subjectLabel: string
  subjectLabelPrefix: string
  cohortLabel: string
}

export type ResearchHistoryDatasetExportFormat = 'csv' | 'xml' | 'excel'

export type ResearchHistoryDatasetExportFile = {
  content: string
  extension: string
  fileName: string
  mimeType: string
}

type ResearchHistoryDatasetExportTable = {
  headers: string[]
  rows: string[][]
}

function escapeCsvValue(value: string): string {
  // Neutralize CSV formula injection: prefix cells that start with formula characters
  const sanitized = /^[=+\-@]/.test(value) ? `'${value}` : value

  return `"${sanitized.replace(/"/g, '""')}"`
}

function escapeXmlValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getDatasetFieldValue(item: ResearchHistoryDataset['items'][number], column: string): string | null {
  return item.fields[column] ?? null
}

function buildExportTable(
  dataset: ResearchHistoryDataset,
  {
    cohortNamesById,
    dateRangeLabel,
    diagnosticsLabel,
    notAvailableLabel,
    subjectLabel,
    subjectLabelPrefix,
    cohortLabel,
  }: ResearchHistoryDatasetExportOptions
): ResearchHistoryDatasetExportTable {
  const headers = [subjectLabel, cohortLabel, dateRangeLabel, diagnosticsLabel, ...dataset.columns]
  const rows = dataset.items.map((item, index) => {
    const subjectValue = `${subjectLabelPrefix} ${index + 1}`
    const cohortValue = cohortNamesById.get(item.cohort) || item.cohort || notAvailableLabel
    const fieldValues = dataset.columns.map((column) => getDatasetFieldValue(item, column) || notAvailableLabel)

    return [
      subjectValue,
      cohortValue,
      item.dateRange || notAvailableLabel,
      item.diagnostics || notAvailableLabel,
      ...fieldValues,
    ]
  })

  return { headers, rows }
}

function buildCsvContent(table: ResearchHistoryDatasetExportTable): string {
  const csvRows = [table.headers, ...table.rows].map((row) => row.map(escapeCsvValue).join(','))

  return csvRows.join('\n')
}

function buildXmlContent(table: ResearchHistoryDatasetExportTable): string {
  const rowsXml = table.rows
    .map(
      (row) =>
        `  <row>${row
          .map(
            (value, index) => `<cell header="${escapeXmlValue(table.headers[index])}">${escapeXmlValue(value)}</cell>`
          )
          .join('')}</row>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<historyDataset>\n${rowsXml}\n</historyDataset>`
}

function buildExcelContent(table: ResearchHistoryDatasetExportTable): string {
  const headerRow = `<Row>${table.headers
    .map((header) => `<Cell><Data ss:Type="String">${escapeXmlValue(header)}</Data></Cell>`)
    .join('')}</Row>`
  const dataRows = table.rows
    .map(
      (row) =>
        `<Row>${row
          .map((value) => `<Cell><Data ss:Type="String">${escapeXmlValue(value)}</Data></Cell>`)
          .join('')}</Row>`
    )
    .join('')

  return `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">\n  <Worksheet ss:Name="History Dataset">\n    <Table>\n      ${headerRow}\n      ${dataRows}\n    </Table>\n  </Worksheet>\n</Workbook>`
}

export function createResearchHistoryDatasetExportFile(
  dataset: ResearchHistoryDataset,
  format: ResearchHistoryDatasetExportFormat,
  options: ResearchHistoryDatasetExportOptions
): ResearchHistoryDatasetExportFile {
  const table = buildExportTable(dataset, options)

  switch (format) {
    case 'csv':
      return {
        content: buildCsvContent(table),
        extension: 'csv',
        fileName: `${options.fileBaseName}.csv`,
        mimeType: 'text/csv;charset=utf-8',
      }
    case 'xml':
      return {
        content: buildXmlContent(table),
        extension: 'xml',
        fileName: `${options.fileBaseName}.xml`,
        mimeType: 'application/xml;charset=utf-8',
      }
    case 'excel':
      return {
        content: buildExcelContent(table),
        extension: 'xls',
        fileName: `${options.fileBaseName}.xls`,
        mimeType: 'application/vnd.ms-excel;charset=utf-8',
      }
    default:
      return {
        content: buildCsvContent(table),
        extension: 'csv',
        fileName: `${options.fileBaseName}.csv`,
        mimeType: 'text/csv;charset=utf-8',
      }
  }
}
