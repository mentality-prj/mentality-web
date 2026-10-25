import type { DeckLocale, ProductDeck } from './decks'

export type FundingAudience = 'investment' | 'grant'

const fundingDecks: Record<DeckLocale, Record<FundingAudience, ProductDeck>> = {
  uk: {
    investment: {
      title: 'Dzvin.co — інвестиційна презентація',
      subtitle:
        'Pre-launch mental wellbeing × Decision Intelligence: інженерна основа, наукові гіпотези та план запуску.',
      slides: [
        {
          title: 'Інвестиційна теза',
          description:
            'Наступний етап створює основу для кваліфікованого продукту й науково перевіреної технології підтримки рішень.',
          points: [
            'Персональний продукт · корпоративні сценарії · дослідницький напрям',
            'QDIP/Decision Intelligence як перевірювана технологічна гіпотеза',
          ],
        },
        {
          title: 'Проблема',
          description:
            'Разові опитування та ризикові бали не створюють повного ланцюга від спостереження до безпечної дії.',
          points: [
            'Роз’єднані дані й неповний контекст',
            'Невизначеність і право користувача вибирати',
            'Відсутність доказів користі без належного дослідження',
          ],
        },
        {
          title: 'Продукт і ринок застосування',
          description: 'Три можливі напрямки монетизації й суспільної користі із загальною дослідницькою основою.',
          points: [
            'B2C: особисті спостереження та самопідтримка',
            'B2B: дозволені групові тенденції та підтримка рішень',
            'R&D: когорти, гіпотези, перевірка та звітність',
          ],
        },
        {
          title: 'Чому Decision Intelligence',
          description:
            'Мета — не просто прогнозувати ризик, а досліджувати пояснюваний вибір доречної дії з контролем людини.',
          points: [
            'Сигнали стану та динаміки',
            'Невизначеність, правила та межі дозволених дій',
            'Пояснення → вибір → зворотний зв’язок → оцінювання',
          ],
        },
        {
          title: 'Що вже розроблено',
          description:
            'Наявні інженерні активи: вебкомпоненти, серверні модулі, дослідницькі матеріали QDIP і компонентні тести.',
          points: [
            'Наявні UI особистого, корпоративного й R&D контурів',
            'Backend-модулі ризику та підтримки рішень',
            'Наступний етап: інтеграційна кваліфікація та незалежне оцінювання',
          ],
        },
        {
          title: 'Поточна стадія та інженерна готовність',
          description:
            'Проєкт на стадії розробки; повний продукт, зовнішні пілоти й емпіричні результати потребують подальшої перевірки.',
          points: [
            'Інженерна та безпекова інтеграція залишається завданням',
            'Дані та етичні протоколи для валідації — наступний етап',
            'Критерії завершення визначено для кожного етапу',
          ],
        },
        {
          title: 'Маршрут до запуску',
          description: 'П’ять етапів із визначеними критеріями приймання та контрольними точками.',
          points: [
            '1. Інтеграція та захист даних → 2. Методологія досліджень',
            '3. Користувацька перевірка → 4. Оцінювання DI',
            '5. Контрольований запуск, go/no-go і стійкість',
          ],
        },
        {
          title: 'Наступний інвестиційний етап',
          description:
            'Від інженерного прототипу — до перевіреного продукту, наукового оцінювання та підготовки запуску.',
          points: [
            'Інженерія та інтеграції; безпека',
            'Decision Intelligence R&D та дослідницькі протоколи',
            'Пілоти, люди, операції та інфраструктура',
          ],
        },
        {
          title: 'Стратегія комерціалізації',
          description:
            'Після валідації можна перевіряти B2B-ліцензії, партнерські дослідницькі програми та розвиток персонального продукту.',
          points: [
            'Немає заявлених продажів і CAC/LTV',
            'Ціни й масштаб перевірятимемо із ринком',
            'Unit economics — результат майбутніх досліджень',
          ],
        },
        {
          title: 'Модель інвестиційного партнерства',
          description: 'Партнерство передбачає погоджені контрольні точки, бюджет програми та умови управління результатами.',
          points: [
            'Погодити обсяг наступного траншу за реальними кошторисами',
            'Визначити етапи, звітність і критерії продовження',
            'Почати інвестиційний due diligence',
          ],
        },
      ],
    },
    grant: {
      title: 'Dzvin.co — науково-грантова презентація',
      subtitle:
        'Excellence · Impact · Implementation: Decision Intelligence in Mental Health як перевірюване дослідницьке завдання.',
      slides: [
        {
          title: 'Проєкт і дослідницька мета',
          description:
            'Побудувати й перевірити пояснювану та uncertainty-aware підтримку людських рішень у digital mental wellbeing.',
          points: ['Прикладний продукт: Dzvin.co', 'Окремий decision-intelligence технологічний напрям: QDIP'],
        },
        {
          title: 'State of the art',
          description:
            'Динамічні моделі, JITAI й micro-randomized trials уже існують; проблема — надійна, придатна до дії інтеграція в чутливому домені.',
          points: [
            'Prediction ≠ policy benefit',
            'Етичні обмеження та неповні дані',
            'Потрібне незалежне порівняння з baseline',
          ],
        },
        {
          title: 'Excellence: гіпотези новизни',
          description:
            'Перевіримо не окремий новий алгоритм, а композицію правил, моделі, невизначеності та пояснення.',
          points: [
            'Гібридні rule/model policy',
            'Калібрування й можливість abstention',
            'User override, пояснення та повторне оцінювання',
          ],
        },
        {
          title: 'Методологія',
          description: 'Порівняльні випробування на синтетичних даних і дослідження з учасниками після необхідних погоджень.',
          points: [
            'Rule-only, ML-only та hybrid baseline',
            'Calibration, Brier, detection delay, selective risk',
            'Decision utility й зрозумілість користувачеві',
          ],
        },
        {
          title: 'Інженерний baseline',
          description: 'Розроблено вебкомпоненти й серверні модулі, сформовано окремі дослідницькі напрями.',
          points: [
            'Особиста підтримка, команди, Research Workspace',
            'Прототип не дорівнює клінічній валідації',
            'Окремі integration/security gates відкриті',
          ],
        },
        {
          title: 'Impact: кому потрібна інновація',
          description: 'Людям, організаціям і дослідницьким програмам, якщо відповідні гіпотези підтвердяться.',
          points: [
            'Особиста автономія й зручні дії',
            'Дозволені командні тенденції',
            'Порівнювані дослідницькі протоколи',
          ],
        },
        {
          title: 'Implementation: робочі пакети',
          description: 'Чотири робочі пакети мають визначені результати та критерії приймання.',
          points: [
            'WP1 · Інтеграція та захист даних',
            'WP2 · Дослідження та методологія DI',
            'WP3 · Користувацька валідація',
            'WP4 · Оцінювання та підготовка запуску',
          ],
        },
        {
          title: 'Ризики та етика',
          description: 'Неповнота даних, помилкові сигнали, упередженість, приватність і безпека рекомендацій.',
          points: [
            'Інформована згода та рольовий доступ',
            'Право утриматися від рішення',
            'Go/no-go та публікація негативних результатів',
          ],
        },
        {
          title: 'Фінансова модель дослідницької програми',
          description: 'Сума й тривалість визначаються на основі команди, бюджету та правил конкретного конкурсу.',
          points: [
            'Інженерія · дослідження · етика · безпека · інфраструктура',
            'Витрати прив’язані до конкретних результатів',
            'Бюджетна модель за пакетом робіт і критеріями програми',
          ],
        },
        {
          title: 'Модель дослідницького партнерства',
          description: 'Програма передбачає партнерства для технологічного розвитку та незалежної наукової оцінки.',
          points: [
            'Визначити відповідну грантову програму',
            'Узгодити партнерства, робочі пакети та бюджет',
            'Погодити процедуру експертизи та звітності',
          ],
        },
      ],
    },
  },
  en: {
    investment: {
      title: 'Dzvin.co — investor deck',
      subtitle:
        'Pre-launch mental wellbeing × Decision Intelligence: software groundwork, testable science and a launch plan.',
      slides: [
        {
          title: 'Investment thesis',
          description: "Support a prototype's transition into a qualified product and a verifiable research program.",
          points: [
            'People-first B2C; B2B economic opportunity; distinct R&D',
            'Decision Intelligence powered research questions',
          ],
        },
        {
          title: 'The problem',
          description: 'Surveys and scores alone do not determine safe next actions.',
          points: ['Fragmented observations', 'Uncertainty and human choice', 'Effects require independent validation'],
        },
        {
          title: 'Product opportunity',
          description: 'Three user experiences with distinct sustainability hypotheses.',
          points: [
            'Personal: observation and self-support',
            'Organizations: authorized team views and action workflow',
            'Research: cohorts and structured evidence',
          ],
        },
        {
          title: 'Why Decision Intelligence',
          description: 'Study not only what might happen, but which next step is explainable and appropriate.',
          points: ['Trends and context', 'Policy constraints and uncertainty', 'Explanation → human choice → feedback'],
        },
        {
          title: 'Engineering evidence',
          description: 'Code for product interfaces, NestJS decision support and QDIP research material exists.',
          points: [
            'Personal, organizational and research surfaces',
            'Automated code tests',
            'Full release E2E and outcomes not yet demonstrated',
          ],
        },
        {
          title: 'Current development stage',
          description:
            'There are no commercial customers, completed effectiveness studies or established product-market fit.',
          points: [
            'Security and integration gates remain',
            'Research partners and protocols are needed',
            'Claims separated from hypotheses',
          ],
        },
        {
          title: 'Path to launch',
          description: 'Five evidence-gated phases with explicit milestones and acceptance criteria.',
          points: [
            'Integration → protocol → feasibility',
            'DI evaluation → controlled launch',
            'Reproducible acceptance criteria',
          ],
        },
        {
          title: 'Next investment milestone',
          description:
            'From software groundwork to a qualified product, research evidence and controlled launch readiness.',
          points: ['Integration and security', 'Decision Intelligence R&D', 'Pilots, people and infrastructure'],
        },
        {
          title: 'Commercialization strategy',
          description:
            'Future B2B contracts, funded research and personal product growth are possibilities to evaluate.',
          points: [
            'No asserted revenue or traction',
            'Pricing needs market validation',
            'Unit economics remain unknown',
          ],
        },
        {
          title: 'Investment partnership model',
          description: 'Discuss milestones, budget, governance and the suitable financing instrument.',
          points: ['Agree a costed tranche', 'Define reporting and go/no-go', 'Begin investor diligence'],
        },
      ],
    },
    grant: {
      title: 'Dzvin.co — research funding deck',
      subtitle: 'Excellence · Impact · Implementation: a falsifiable DI in mental health research program.',
      slides: [
        {
          title: 'Project objective',
          description:
            'Develop and evaluate uncertainty-aware, explainable decision support for digital mental wellbeing.',
          points: ['Dzvin.co applied domain', 'QDIP decision-intelligence research track'],
        },
        {
          title: 'State of the art',
          description:
            'JITAI, adaptive models and micro-randomized trials already exist; reliable decision policies still require careful evaluation.',
          points: [
            'Prediction is not benefit',
            'Sensitive data and incomplete observation',
            'Compare to simple baselines',
          ],
        },
        {
          title: 'Excellence: hypotheses',
          description: 'Test the integration of rules, model signals, uncertainty and transparent action selection.',
          points: ['Hybrid policies', 'Calibration and abstention', 'Explanation and user control'],
        },
        {
          title: 'Methods',
          description:
            'Start with reproducible synthetic comparisons; use participant studies only under appropriate approvals.',
          points: [
            'Rule-only, ML-only, hybrid baselines',
            'Calibration, Brier, selective risk',
            'Decision utility and comprehension',
          ],
        },
        {
          title: 'Existing groundwork',
          description: 'Personal, team and Research Workspace code plus research specifications exist.',
          points: [
            'Software prototype, not clinical proof',
            'Security/integration still gated',
            'No independent field effectiveness result',
          ],
        },
        {
          title: 'Impact',
          description:
            'Potential relevance to individuals, authorized team-support workflows and reproducible research.',
          points: ['Personal agency', 'Appropriate group context', 'Traceable study programs'],
        },
        {
          title: 'Implementation work packages',
          description: 'Link each funded package to testable deliverables.',
          points: ['WP1 Secure integration', 'WP2 DI methods and benchmarks', 'WP3 Feasibility, evidence and launch'],
        },
        {
          title: 'Ethics and risks',
          description: 'Incomplete observations, bias, privacy, harmful overconfidence and misuse.',
          points: ['Consent and data minimization', 'Abstention and human approval', 'Go/no-go with negative results'],
        },
        {
          title: 'Funding framework',
          description: "Budget and duration depend on actual costs and the target call's rules.",
          points: ['Engineering, R&D, ethics, hosting', 'Milestone-based budgeting', 'Call-specific eligible costs and governance'],
        },
        {
          title: 'Research partnership',
          description: 'Seek qualified research/funding partners for an independently assessed study.',
          points: [
            'Identify suitable call and eligibility',
            'Design consortium and protocol',
            'Agree budget and evidence plan',
          ],
        },
      ],
    },
  },
  pl: {
    investment: {
      title: 'Dzvin.co — prezentacja inwestorska',
      subtitle:
        'Prototyp mental wellbeing × Decision Intelligence: podstawa techniczna, hipotezy naukowe i plan uruchomienia.',
      slides: [
        {
          title: 'Teza inwestycyjna',
          description: 'Finansowanie umożliwia przejście od prototypu do zweryfikowanego produktu i badań.',
          points: ['B2C dla osób, potencjał B2B, odrębny R&D', 'Decision Intelligence jako hipoteza do sprawdzenia'],
        },
        {
          title: 'Problem',
          description: 'Same ankiety i wyniki ryzyka nie określają bezpiecznych kolejnych działań.',
          points: ['Rozproszone dane', 'Niepewność i wybór człowieka', 'Brak dowodu efektu bez badań'],
        },
        {
          title: 'Proponowany produkt',
          description: 'Trzy obszary z odrębnymi modelami dalszego rozwoju.',
          points: ['Osoby: obserwacja i wsparcie', 'Firmy: dozwolona analityka grup', 'Nauka: kohorty i badania'],
        },
        {
          title: 'Dlaczego DI',
          description: 'Nie tylko przewidywanie, lecz wyjaśnione działanie w granicach danych.',
          points: ['Trendy i kontekst', 'Zasady i niepewność', 'Wyjaśnienie → wybór → feedback'],
        },
        {
          title: 'Co zbudowano',
          description: 'Istnieje kod aplikacji, moduły backendowe i materiały QDIP.',
          points: ['Moduły B2C, B2B i R&D', 'Automatyczne testy', 'Kolejny etap: integracja i weryfikacja pilotażowa'],
        },
        {
          title: 'Etap rozwoju i kwalifikacja techniczna',
          description: 'Projekt na etapie rozwoju, przed niezależnymi pilotażami i walidacją wyników.',
          points: [
            'Kwalifikacja integracji i bezpieczeństwa',
            'Metodyka badań i program partnerstw',
            'Gotowość produktu określają kryteria techniczne i badawcze',
          ],
        },
        {
          title: 'Droga do uruchomienia',
          description: 'Pięć etapów weryfikowanych dowodami.',
          points: ['Integracja → protokół → feasibility', 'Ocena DI → kontrolowane uruchomienie', 'Kryteria go/no-go'],
        },
        {
          title: 'Kolejny etap inwestycyjny',
          description: 'Od prototypu do kwalifikacji produktu, oceny naukowej i przygotowania uruchomienia.',
          points: ['Integracja i ochrona danych', 'Decision Intelligence R&D', 'Pilotaże i infrastruktura'],
        },
        {
          title: 'Przyszły model biznesowy',
          description: 'B2B, badania i produkt osobisty wymagają weryfikacji rynkowej.',
          points: ['Potencjał B2B i współpracy badawczej', 'Badania gotowości do płacenia', 'Model kosztów wdrożenia i utrzymania'],
        },
        {
          title: 'Model partnerstwa inwestycyjnego',
          description: 'Ustalmy budżet, etapy, odpowiedzialność i rodzaj finansowania.',
          points: ['Kosztorys transzy', 'Warunki raportowania', 'Rozmowa due diligence'],
        },
      ],
    },
    grant: {
      title: 'Dzvin.co — prezentacja grantowa',
      subtitle: 'Excellence · Impact · Implementation: Decision Intelligence w zdrowiu psychicznym.',
      slides: [
        {
          title: 'Cel projektu',
          description: 'Budowa i ocena wyjaśnialnego wsparcia decyzji w digital mental wellbeing.',
          points: ['Dzvin.co jako produkt', 'QDIP jako kierunek technologiczny'],
        },
        {
          title: 'Stan wiedzy',
          description:
            'JITAI, adaptacja i mikro-randomizowane badania już istnieją; korzyść z polityki decyzji trzeba wykazać.',
          points: ['Prognoza ≠ korzyść', 'Braki w danych', 'Potrzeba baseline i walidacji'],
        },
        {
          title: 'Excellence: hipotezy',
          description: 'Połączenie reguł, modeli, niepewności i wyboru działania.',
          points: ['Polityki hybrydowe', 'Kalibracja i abstention', 'Zrozumiałe wyjaśnienia'],
        },
        {
          title: 'Metodyka',
          description: 'Testy syntetyczne, a następnie badania z ludźmi po odpowiednich zgodach.',
          points: [
            'Rule-only / ML-only / hybrid',
            'Brier, kalibracja, selective risk',
            'Decision utility i zrozumiałość',
          ],
        },
        {
          title: 'Podstawa inżynierska',
          description: 'Istnieją moduły produktu i dokumentacja naukowa.',
          points: ['Zakres gotowości technicznej prototypu', 'Otwarte warunki bezpieczeństwa', 'Badania z udziałem ludzi w kolejnym etapie'],
        },
        {
          title: 'Impact',
          description: 'Potencjalna wartość dla osób, zespołów i nauki.',
          points: ['Autonomia użytkownika', 'Uprawnione dane zespołów', 'Powtarzalne badania'],
        },
        {
          title: 'Implementation',
          description: 'Pakiety prac z kryteriami odbioru.',
          points: ['WP1 Integracja i ochrona danych', 'WP2 Metodyka i ocena DI', 'WP3 Walidacja użytkowników', 'WP4 Dowody i gotowość do uruchomienia'],
        },
        {
          title: 'Ryzyka i etyka',
          description: 'Błędy, bias, prywatność, brak danych, szkodliwe rekomendacje.',
          points: ['Zgoda i minimalizacja', 'Abstention i kontrola człowieka', 'Go/no-go i wyniki negatywne'],
        },
        {
          title: 'Finansowanie',
          description: 'Wartość i czas projektu wynikają z kosztorysu oraz zasad konkursu.',
          points: ['Rozwój, R&D, etyka, hosting', 'Budżet według rezultatów', 'Koszty kwalifikowalne i struktura partnerstwa'],
        },
        {
          title: 'Partnerstwo',
          description: 'Poszukujemy finansowania i niezależnych partnerów badawczych.',
          points: ['Wybór programu', 'Konsorcjum i protokół', 'Wspólny plan finansowania'],
        },
      ],
    },
  },
}

export function getFundingDeck(locale: DeckLocale, audience: FundingAudience): ProductDeck {
  return fundingDecks[locale][audience]
}
