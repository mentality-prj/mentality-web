import { render, screen } from '@testing-library/react'

import { parseNumberedList, StyledDescription } from './StyledDescription'

// ---------------------------------------------------------------------------
// parseNumberedList — unit tests (pure function)
// ---------------------------------------------------------------------------

describe('parseNumberedList', () => {
  describe('returns null for non-numbered text', () => {
    it('plain sentence', () => {
      expect(parseNumberedList('Просто звичайний текст.')).toBeNull()
    })

    it('text starting with a word', () => {
      expect(parseNumberedList('Знайдіть тихе місце.')).toBeNull()
    })

    it('year at the start', () => {
      expect(parseNumberedList('2024 рік став особливим.')).toBeNull()
    })

    it('empty string', () => {
      expect(parseNumberedList('')).toBeNull()
    })
  })

  describe('parses standard numbered list', () => {
    const input =
      '1. Знайдіть тихе місце. 2. Сідайте зручно. 3. Закрийте очі. 4. Глибоко вдихніть і видихніть. 5. Спробуйте відчути своє тіло та розслабитися.'

    it('returns correct number of items', () => {
      expect(parseNumberedList(input)).toHaveLength(5)
    })

    it('extracts numbers correctly', () => {
      const items = parseNumberedList(input)!
      expect(items.map((i) => i.num)).toEqual(['1', '2', '3', '4', '5'])
    })

    it('extracts text without trailing period', () => {
      const items = parseNumberedList(input)!
      expect(items[0].text).toBe('Знайдіть тихе місце')
      expect(items[2].text).toBe('Закрийте очі')
    })
  })

  describe('handles item text that starts with a digit', () => {
    it('does not skip item starting with number', () => {
      const items = parseNumberedList('1. 30 хвилин медитації. 2. Закрийте очі.')
      expect(items).toHaveLength(2)
      expect(items![0].text).toBe('30 хвилин медитації')
    })
  })

  describe('does not split on ordinal numbers inside item text', () => {
    it('ordinal "3." inside sentence is not treated as new item', () => {
      const items = parseNumberedList('1. Виконайте 3. рази глибоко дихати. 2. Розслабтеся.')
      expect(items).toHaveLength(2)
      expect(items![0].text).toBe('Виконайте 3. рази глибоко дихати')
    })
  })

  describe('handles single item', () => {
    it('single numbered sentence', () => {
      const items = parseNumberedList('1. Один єдиний пункт.')
      expect(items).toHaveLength(1)
      expect(items![0]).toEqual({ num: '1', text: 'Один єдиний пункт' })
    })
  })

  describe('handles multi-sentence items', () => {
    it('item with two sentences stays intact', () => {
      const items = parseNumberedList('1. Знайдіть місце. Сядьте зручно. 2. Закрийте очі.')
      expect(items).toHaveLength(2)
      expect(items![0].text).toBe('Знайдіть місце. Сядьте зручно')
    })
  })

  describe('handles Polish/English locale text (same format)', () => {
    it('parses English numbered text', () => {
      const items = parseNumberedList('1. Find a quiet place. 2. Sit comfortably. 3. Close your eyes.')
      expect(items).toHaveLength(3)
      expect(items![1].text).toBe('Sit comfortably')
    })
  })

  describe('text with year/numbers but no list', () => {
    it('does not parse text with a year as list', () => {
      expect(parseNumberedList('У 2024 році було добре. Потім стало краще.')).toBeNull()
    })
  })

  describe('handles unnumbered first item (word number like "Jeden")', () => {
    const input =
      'Jeden. Znajdźcie spokojne miejsce. 2. Usiądź wygodnie. 3. Zamknij oczy. 4. Weź głęboki oddech i wydech. 5 Spróbujcie poczuć swoje ciało i się odprężyć.'

    it('returns 5 items', () => {
      expect(parseNumberedList(input)).toHaveLength(5)
    })

    it('assigns num "1" to the unnumbered first item', () => {
      expect(parseNumberedList(input)![0].num).toBe('1')
    })

    it('keeps full text of unnumbered first item', () => {
      expect(parseNumberedList(input)![0].text).toBe('Jeden. Znajdźcie spokojne miejsce')
    })

    it('parses items 2–4 normally', () => {
      const items = parseNumberedList(input)!
      expect(items[1]).toEqual({ num: '2', text: 'Usiądź wygodnie' })
      expect(items[2]).toEqual({ num: '3', text: 'Zamknij oczy' })
      expect(items[3]).toEqual({ num: '4', text: 'Weź głęboki oddech i wydech' })
    })

    it('parses item 5 that has no period after the number', () => {
      expect(parseNumberedList(input)![4]).toEqual({
        num: '5',
        text: 'Spróbujcie poczuć swoje ciało i się odprężyć',
      })
    })
  })

  describe('handles missing period after item number', () => {
    it('parses "N text" (no period) as a valid item', () => {
      const items = parseNumberedList('1. Знайдіть місце. 2. Сядьте. 3 Закрийте очі.')
      expect(items).toHaveLength(3)
      expect(items![2]).toEqual({ num: '3', text: 'Закрийте очі' })
    })
  })

  describe('handles newline-separated numbered list', () => {
    it('parses items split by new lines without sentence-ending periods', () => {
      const items = parseNumberedList('1. Знайдіть місце\n2. Сядьте зручно\n3. Закрийте очі')
      expect(items).toHaveLength(3)
      expect(items![0]).toEqual({ num: '1', text: 'Знайдіть місце' })
      expect(items![1]).toEqual({ num: '2', text: 'Сядьте зручно' })
      expect(items![2]).toEqual({ num: '3', text: 'Закрийте очі' })
    })

    it('parses CRLF-separated text as well', () => {
      const items = parseNumberedList('1. Find a quiet place\r\n2. Sit comfortably\r\n3. Close your eyes')
      expect(items).toHaveLength(3)
      expect(items![1]).toEqual({ num: '2', text: 'Sit comfortably' })
    })
  })

  describe('does not split on decimals inside item text', () => {
    it('keeps decimal values inside the same item', () => {
      const items = parseNumberedList('1. Дихайте 1.5 хвилини. 2. Відпочиньте.')
      expect(items).toHaveLength(2)
      expect(items![0].text).toBe('Дихайте 1.5 хвилини')
    })
  })

  describe('handles sentence-ending punctuation inside items', () => {
    it('splits items after ! and ? markers', () => {
      const items = parseNumberedList('1. Вдихніть! 2. Сядьте спокійно? 3. Розслабтеся…')
      expect(items).toHaveLength(3)
      expect(items![0]).toEqual({ num: '1', text: 'Вдихніть!' })
      expect(items![1]).toEqual({ num: '2', text: 'Сядьте спокійно?' })
      expect(items![2]).toEqual({ num: '3', text: 'Розслабтеся…' })
    })
  })

  describe('unnumbered first item alone is not a list', () => {
    it('returns null when text has no sequential numbered items after word-number', () => {
      expect(parseNumberedList('Jeden. Tylko jedno zdanie.')).toBeNull()
    })
  })
})

// ---------------------------------------------------------------------------
// StyledDescription — render tests
// ---------------------------------------------------------------------------

describe('StyledDescription', () => {
  it('renders <ol> for numbered list', () => {
    render(<StyledDescription text="1. Знайдіть тихе місце. 2. Сідайте зручно. 3. Закрийте очі." />)
    expect(screen.getByRole('list').tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders step numbers as visible text', () => {
    render(<StyledDescription text="1. Знайдіть тихе місце. 2. Сідайте зручно." />)
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
  })

  it('renders item text with trailing period', () => {
    render(<StyledDescription text="1. Знайдіть тихе місце." />)
    expect(screen.getByText('Знайдіть тихе місце.')).toBeInTheDocument()
  })

  it('renders <p> for plain text', () => {
    render(<StyledDescription text="Просто звичайний текст." />)
    expect(screen.getByText('Просто звичайний текст.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('renders item text that starts with a digit', () => {
    render(<StyledDescription text="1. 30 хвилин медитації. 2. Закрийте очі." />)
    expect(screen.getByText('30 хвилин медитації.')).toBeInTheDocument()
  })

  it('does not append an extra period after !, ?, or …', () => {
    render(<StyledDescription text="1. Вдихніть! 2. Сядьте спокійно? 3. Розслабтеся…" />)
    expect(screen.getByText('Вдихніть!')).toBeInTheDocument()
    expect(screen.getByText('Сядьте спокійно?')).toBeInTheDocument()
    expect(screen.getByText('Розслабтеся…')).toBeInTheDocument()
    expect(screen.queryByText('Вдихніть!.')).not.toBeInTheDocument()
  })
})
