import { type FundingAudience, getFundingDeck } from './funding-decks'

export type DeckLocale = 'uk' | 'en' | 'pl'
export type DeckAudience = 'teams' | 'individuals' | 'research' | FundingAudience
export type DeckSlide = { title: string; description: string; points: string[] }
export type ProductDeck = { title: string; subtitle: string; slides: DeckSlide[] }

const productDecks: Record<DeckLocale, Record<'teams' | 'individuals' | 'research', ProductDeck>> = {
  uk: {
    teams: {
      title: 'Dzvin.co для команд',
      subtitle: 'Від командних сигналів до відповідальної дії',
      slides: [
        {
          title: 'Командний добробут потребує системного підходу',
          description: 'Коли дані розрізнені, керівництво важче бачить зміну ситуації.',
          points: ['Окреме опитування дає зріз', 'Потрібна динаміка та наступний крок'],
        },
        {
          title: 'Рішення для HR та керівників',
          description: 'Повторні спостереження, групові зрізи й керований процес опрацювання ризикових подій.',
          points: [
            'Організаційні групи й права доступу',
            'Тренди стресу, настрою, енергії та фокусу',
            'Сигнали ризику й управлінські дії',
          ],
        },
        {
          title: 'Як менеджер працює з Dzvin.co',
          description: 'Від загальної картини до конкретного сигналу та подальшої дії.',
          points: [
            '1. Обрати період і дозволені групи',
            '2. Оцінити зміну показників',
            '3. Перевірити подію ризику',
            '4. Визначити й зафіксувати дію',
          ],
        },
        {
          title: 'Відповідальний доступ до даних',
          description: 'Роль менеджера, адміністратора й користувача визначає доступні сценарії.',
          points: ['Командна структура і дозволи', 'Групова аналітика', 'Контроль доступу до дослідницьких даних'],
        },
        {
          title: 'Як вимірювати результат',
          description: 'Комерційну цінність треба підтверджувати пілотом, а не обіцянкою відсотків.',
          points: ['Час до розгляду сигналу', 'Регулярність участі', 'Опрацювання подій', 'Витрати процесу'],
        },
        {
          title: 'Економічна модель',
          description: 'Порівняйте виміряний ефект із витратами ліцензії та впровадження.',
          points: ['Встановіть базову точку', 'Заміряйте фактичну зміну', 'Розрахуйте можливу вартість змін'],
        },
        {
          title: 'Наступний крок — цільовий пілот',
          description: 'Почніть з однієї команди, відповідальної особи та метрики.',
          points: ['Демонстрація з дозволеними даними', 'Узгоджені критерії успіху', 'Рішення за результатом пілоту'],
        },
      ],
    },
    individuals: {
      title: 'Dzvin.co для людини',
      subtitle: 'Помічайте зміни, а не лише сьогоднішній стан',
      slides: [
        {
          title: 'Бачити свій стан у динаміці',
          description: 'Окрема відмітка не показує повної історії.',
          points: ['Стрес, настрій, енергія й фокус змінюються', 'Регулярність додає контекст'],
        },
        {
          title: 'Коротка щоденна самооцінка',
          description: 'Зберігайте спостереження в одному місці.',
          points: ['Чотири показники стану', 'Нотатки та опитувальники'],
        },
        {
          title: 'Особиста історія',
          description: 'Переглядайте, як змінювалися власні записи.',
          points: ['Послідовність відміток', 'Можливість помітити повторювані патерни'],
        },
        {
          title: 'Наступна доступна дія',
          description: 'Після оцінки можна перейти до вправи, практики або цілі.',
          points: ['Короткі вправи', 'Особисті цілі'],
        },
        {
          title: 'Повернення до спостереження',
          description: 'Наступний запис доповнює власну картину.',
          points: ['Оцінка → практика → повторна оцінка', 'Усе в одній особистій історії'],
        },
        {
          title: 'На що звернути увагу',
          description: 'Оцінюйте простоту використання та корисність власної історії.',
          points: ['Чи зручно повертатися?', 'Чи легко бачити зміни?'],
        },
        {
          title: 'Відкрийте особисті сервіси',
          description: 'Ознайомтеся з Dzvin.co й оберіть потрібний сценарій.',
          points: ['Щоденна самооцінка', 'Історія, практики й цілі'],
        },
      ],
    },
    research: {
      title: 'Dzvin.co для досліджень',
      subtitle: 'Керований дослідницький процес і прозорі результати',
      slides: [
        {
          title: 'Дослідницьким даним потрібен контекст',
          description: 'Проєкти, когорти й повторні спостереження мають працювати разом.',
          points: ['Важлива зіставність', 'Важлива простежуваність'],
        },
        {
          title: 'Research Workspace',
          description: 'Простір для організації дослідницького проєкту.',
          points: ['Проєкти й учасники', 'Ролі й права доступу'],
        },
        {
          title: 'Когорти й історичні дані',
          description: 'Розглядайте групи спостережень у межах визначеного процесу.',
          points: ['Налаштування когорт', 'Історія спостережень'],
        },
        {
          title: 'Інспекція й експорт',
          description: 'Доступні інструменти для перевірки даних і контрольованої звітності.',
          points: ['Інспекція', 'Заявки на експорт', 'Аудит'],
        },
        {
          title: 'Від даних до перевірки',
          description: 'Критерії результату треба визначити до оцінювання програми.',
          points: ['Методика вимірювання', 'Зіставні періоди', 'Результати без непідтверджених висновків'],
        },
        {
          title: 'Що отримує організація',
          description: 'Єдиний робочий маршрут від підготовки до звітних матеріалів.',
          points: ['Керована структура', 'Дозволи та історія операцій'],
        },
        {
          title: 'Обговорімо дослідницьку задачу',
          description: 'Узгодимо демонстрацію релевантного сценарію.',
          points: ['Склад учасників', 'Доступ і дані', 'Критерій оцінки'],
        },
      ],
    },
  },
  en: {
    teams: {
      title: 'Dzvin.co for organizations',
      subtitle: 'From team signals to accountable action',
      slides: [
        {
          title: 'Team wellbeing needs a structured process',
          description: 'Fragmented information makes it harder to identify change.',
          points: ['One survey is a snapshot', 'Patterns and follow-up provide context'],
        },
        {
          title: 'Built for HR and team leaders',
          description: 'Repeated observations, group insight and risk-event handling in one product.',
          points: [
            'Organization structure and permissions',
            'Mood, stress, energy and focus trends',
            'Risk signals and manager actions',
          ],
        },
        {
          title: "A manager's workflow",
          description: 'Move from a summary to a particular signal and a responsible next step.',
          points: [
            '1. Select authorized groups and period',
            '2. Review changing indicators',
            '3. Examine a risk event',
            '4. Record an action',
          ],
        },
        {
          title: 'Accountable access',
          description: 'Managers, administrators and individuals have different permissions.',
          points: ['Scoped team views', 'Managed organization structure', 'Role-dependent access'],
        },
        {
          title: 'Measure what matters',
          description: 'Test operational value rather than promise unsupported percentages.',
          points: ['Time to review a signal', 'Repeat participation', 'Events followed up', 'Process cost'],
        },
        {
          title: 'Economic evaluation',
          description: 'Compare observed pilot effects with licensing and setup costs.',
          points: ['Establish a baseline', 'Measure actual change', 'Assess value using your own costs'],
        },
        {
          title: 'Start with one pilot',
          description: 'Choose a team, an owner and a measurable outcome.',
          points: ['Demonstrate an authorized workflow', 'Agree success criteria', 'Evaluate the pilot'],
        },
      ],
    },
    individuals: {
      title: 'Dzvin.co for individuals',
      subtitle: "Understand changes, not just today's score",
      slides: [
        {
          title: 'Understand the trend',
          description: 'A single daily observation cannot tell the whole story.',
          points: ['Stress, mood, energy and focus vary', 'Repeated check-ins add context'],
        },
        {
          title: 'A simple check-in',
          description: 'Keep everyday observations in one place.',
          points: ['Four dimensions', 'Notes and questionnaires'],
        },
        {
          title: 'Personal history',
          description: 'Look at how your earlier entries change over time.',
          points: ['Time-ordered observations', 'Notice recurring patterns'],
        },
        {
          title: 'An available next step',
          description: 'Explore practices and goals after recording your state.',
          points: ['Short exercises', 'Personal goals'],
        },
        {
          title: 'Return and review',
          description: 'A later check-in adds context to the first.',
          points: ['Observe → practice → check in again', 'One personal timeline'],
        },
        {
          title: 'What to evaluate',
          description: 'Consider ease of use and whether your own history is useful.',
          points: ['Can you return regularly?', 'Is it easy to understand change?'],
        },
        {
          title: 'Explore Dzvin.co',
          description: 'See the available personal product experiences.',
          points: ['Daily check-ins', 'History, exercises and goals'],
        },
      ],
    },
    research: {
      title: 'Dzvin.co for research',
      subtitle: 'Structured programs and traceable observations',
      slides: [
        {
          title: 'Research needs a clear workflow',
          description: 'Projects, cohorts and outcomes should be connected.',
          points: ['Repeatability matters', 'Traceability matters'],
        },
        {
          title: 'Research Workspace',
          description: 'Organize study projects and participant roles.',
          points: ['Project overview', 'Members and permissions'],
        },
        {
          title: 'Cohorts and historical records',
          description: 'Review observations within a defined study process.',
          points: ['Cohort settings', 'Historical datasets'],
        },
        {
          title: 'Inspection and exports',
          description: 'Examine data and manage requests for reporting.',
          points: ['Inspection surfaces', 'Export requests', 'Audit trail'],
        },
        {
          title: 'From data to evaluation',
          description: 'Agree success measures before a study is assessed.',
          points: ['Measurement protocol', 'Comparable periods', 'Careful interpretation'],
        },
        {
          title: 'Research output',
          description: 'A consistent path from program setup to reporting.',
          points: ['Defined access', 'Operational traceability'],
        },
        {
          title: 'Discuss your study',
          description: 'Arrange a relevant product demonstration.',
          points: ['Participants and cohort', 'Access and data', 'Evaluation design'],
        },
      ],
    },
  },
  pl: {
    teams: {
      title: 'Dzvin.co dla organizacji',
      subtitle: 'Od sygnałów zespołu do odpowiedzialnych działań',
      slides: [
        {
          title: 'Dobrostan zespołów wymaga procesu',
          description: 'Rozproszone dane utrudniają dostrzeżenie zmian.',
          points: ['Jedna ankieta pokazuje tylko chwilę', 'Ważne są trendy i dalsze działania'],
        },
        {
          title: 'Dla HR i kierowników',
          description: 'Powtarzane obserwacje, widoki grupowe i obsługa zdarzeń ryzyka.',
          points: [
            'Struktura i uprawnienia',
            'Trendy nastroju, stresu, energii i koncentracji',
            'Zdarzenia i działania',
          ],
        },
        {
          title: 'Proces menedżera',
          description: 'Od podsumowania do konkretnego sygnału i odpowiedniej reakcji.',
          points: ['1. Wybierz grupy i okres', '2. Przeanalizuj trendy', '3. Sprawdź zdarzenie', '4. Zapisz działanie'],
        },
        {
          title: 'Zarządzanie dostępem',
          description: 'Menedżerowie, administratorzy i osoby mają odrębne role.',
          points: ['Dostęp do właściwych grup', 'Struktura organizacyjna', 'Uprawnienia'],
        },
        {
          title: 'Mierzenie wartości',
          description: 'Wartość pilotażu trzeba sprawdzić, a nie obiecywać procentów.',
          points: ['Czas reakcji na sygnał', 'Regularność udziału', 'Obsłużone zdarzenia', 'Koszt procesu'],
        },
        {
          title: 'Ocena ekonomiczna',
          description: 'Porównaj zaobserwowane zmiany z kosztami rozwiązania.',
          points: ['Ustal punkt odniesienia', 'Zmierz wynik', 'Uwzględnij koszty licencji i wdrożenia'],
        },
        {
          title: 'Pilotaż jako kolejny krok',
          description: 'Wybierz zespół, osobę odpowiedzialną i kryterium sukcesu.',
          points: ['Demonstracja', 'Uzgodnione mierniki', 'Ocena pilotażu'],
        },
      ],
    },
    individuals: {
      title: 'Dzvin.co dla osób',
      subtitle: 'Dostrzegaj zmiany, nie tylko dzisiejszy wynik',
      slides: [
        {
          title: 'Zrozum własną dynamikę',
          description: 'Pojedyncza samoocena nie pokazuje całej historii.',
          points: ['Stres, nastrój, energia i koncentracja się zmieniają', 'Powtórzenia dają kontekst'],
        },
        {
          title: 'Krótka samoocena',
          description: 'Zapisuj obserwacje w jednym miejscu.',
          points: ['Cztery wymiary', 'Notatki i kwestionariusze'],
        },
        {
          title: 'Osobista historia',
          description: 'Przeglądaj wcześniejsze wpisy i zmiany.',
          points: ['Historia pomiarów', 'Powtarzające się wzorce'],
        },
        {
          title: 'Następny krok',
          description: 'Korzystaj z dostępnych praktyk i celów.',
          points: ['Krótkie ćwiczenia', 'Osobiste cele'],
        },
        {
          title: 'Wróć do obserwacji',
          description: 'Kolejny wpis uzupełnia wcześniejszy.',
          points: ['Pomiar → praktyka → nowy pomiar', 'Spójna historia'],
        },
        {
          title: 'Co ocenić',
          description: 'Wygodę i przydatność własnych obserwacji.',
          points: ['Czy łatwo wracać?', 'Czy zmiany są zrozumiałe?'],
        },
        {
          title: 'Poznaj Dzvin.co',
          description: 'Sprawdź dostępne narzędzia osobiste.',
          points: ['Codzienne wpisy', 'Historia i ćwiczenia'],
        },
      ],
    },
    research: {
      title: 'Dzvin.co dla badań',
      subtitle: 'Uporządkowane programy i śledzenie wyników',
      slides: [
        {
          title: 'Badania potrzebują struktury',
          description: 'Projekty, kohorty i wyniki powinny tworzyć spójny proces.',
          points: ['Porównywalność', 'Możliwość śledzenia'],
        },
        {
          title: 'Research Workspace',
          description: 'Organizacja projektów i uprawnień.',
          points: ['Przegląd projektów', 'Członkowie i role'],
        },
        {
          title: 'Kohorty i historia',
          description: 'Powtarzane obserwacje w ramach programu.',
          points: ['Ustawienia kohort', 'Dane historyczne'],
        },
        {
          title: 'Inspekcja i eksport',
          description: 'Weryfikacja danych i raportowanie.',
          points: ['Inspekcja', 'Wnioski o eksport', 'Audyt'],
        },
        {
          title: 'Od danych do oceny',
          description: 'Ustal kryteria przed oceną programu.',
          points: ['Metoda pomiaru', 'Porównywalne okresy', 'Ostrożne wnioski'],
        },
        {
          title: 'Rezultat dla badaczy',
          description: 'Spójny proces od projektu do raportów.',
          points: ['Kontrola dostępu', 'Możliwość weryfikacji'],
        },
        {
          title: 'Omówmy program',
          description: 'Przygotujmy demo dopasowane do badania.',
          points: ['Uczestnicy i kohorty', 'Dane i dostęp', 'Kryteria oceny'],
        },
      ],
    },
  },
}

export const deckAudiences: DeckAudience[] = ['investment', 'grant', 'teams', 'individuals', 'research']

export function getProductDeck(locale: string, audience: DeckAudience): ProductDeck {
  const language: DeckLocale = locale === 'en' || locale === 'pl' ? locale : 'uk'
  if (audience === 'investment' || audience === 'grant') return getFundingDeck(language, audience)
  return productDecks[language][audience]
}
