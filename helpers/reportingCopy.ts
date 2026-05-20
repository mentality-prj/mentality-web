import { ConfidenceLevel, RiskEventActionKind, RiskLevel } from '@/types/reporting'

type ReportingCopy = {
  common: {
    noData: string
    notAvailable: string
    hiddenByPolicy: string
    unavailableDiagnostics: string
    refresh: string
    retry: string
    all: string
    from: string
    to: string
    confidence: string
    invalidDateOrder: string
    invalidDateRange: string
    loadFailed: string
  }
  confidence: {
    levels: Record<ConfidenceLevel, string>
    reasons: Record<ConfidenceLevel, string>
    improvements: Record<ConfidenceLevel, string>
  }
  riskLevels: Record<RiskLevel, string>
  riskStatuses: Record<string, string>
  actions: Record<RiskEventActionKind, string>
  guardReasons: Record<string, string>
  reportOverview: {
    title: string
    companyHealthSummary: string
    actionsList: string
    teamRanking: string
    signalsSummary: string
    interpretationGuidance: string
    executiveSummary: string
    confidenceStrip: string
    diagnosticsLink: string
    totalEstimatedRisk: string
    attritionCost: string
    productivityLoss: string
    topTeam: string
  }
  riskFeed: {
    title: string
    operationalSubtitle: string
    diagnosticsSubtitle: string
    diagnosticsLegend: string
    severity: string
    severityFilterLabel: string
    status: string
    statusFilterLabel: string
    confidence: string
    confidenceFilterLabel: string
    explanation: string
    recommendedActions: string
    details: string
    debug: string
    debugOnly: string
    signal: string
    financialRange: string
    lastSeenAt: string
    effectSize: string
    history: string
    performedActions: string
    outcome: string
    evidenceStrength: string
    dataCoverage: string
    sampleSize: string
    targetNoEvents: string
    resolveTitle: string
    resolvePlaceholder: string
    markResolved: string
  }
  explainability: {
    title: string
    whatHappened: string
    whyShown: string
    reliability: string
    recommendedAction: string
  }
  diagnostics: {
    inspectionTitle: string
    team: string
    teamPlaceholder: string
    noTeamsAvailable: string
    clearTeamSelection: string
    riskScore: string
    anomaly: string
    probability: string
    modelVersion: string
    diagnosticsTab: string
    detailsTab: string
    auditTrail: string
    policySummary: string
    totalEvents: string
    drift: string
    calibration: string
    stateSpace: string
    predictedNextState: string
    coupling: string
    synchronization: string
    modelTrust: string
  }
  personalRisk: {
    overviewTitle: string
    timelineTitle: string
    currentRisk: string
    deviationFromBaseline: string
    recentTrend: string
    topInsights: string
    updatedTime: string
    whySeeingThis: string
    recentChanges: string
    contributingFactors: string
    dataCompleteness: string
    trendDirection: string
    baselineReference: string
    baselineShiftTitle: string
    recoveryStateTitle: string
    patternStateTitle: string
    explanationSummary: string
    period7d: string
    period14d: string
    period30d: string
    tensionAboveBaseline: string
    recoverySlowed: string
    patternUnstable: string
    stablePattern: string
  }
  teamDynamics: {
    title: string
    aggregateTrend: string
    propagationRisk: string
    synchronizedDeterioration: string
    insightCards: string
    heatmap: string
    trendDetail: string
    keyChanges: string
    recommendedInterventions: string
    privacyState: string
    masked: string
  }
}

const COPY_BY_LOCALE: Record<'uk' | 'en' | 'pl', ReportingCopy> = {
  uk: {
    common: {
      noData: 'Немає даних',
      notAvailable: 'Недоступно',
      hiddenByPolicy: 'Приховано політикою відображення',
      unavailableDiagnostics: 'Діагностичні поля ще не підключені в поточному API.',
      refresh: 'Оновити',
      retry: 'Повторити',
      all: 'Усі',
      from: 'Від',
      to: 'До',
      confidence: 'Впевненість',
      invalidDateOrder: 'Дата завершення має бути пізніше дати початку.',
      invalidDateRange: 'Діапазон дат не може перевищувати 1 рік.',
      loadFailed: 'Не вдалося завантажити дані.',
    },
    confidence: {
      levels: {
        high: 'Висока',
        medium: 'Середня',
        low: 'Низька',
        unknown: 'Невідома',
      },
      reasons: {
        high: 'Сигнали узгоджені, а покриття даних достатнє.',
        medium: 'Сигнали є, але покриття або стабільність часткові.',
        low: 'Даних або стабільності недостатньо для сильного висновку.',
        unknown: 'Оцінка ще не має надійного сигналу впевненості.',
      },
      improvements: {
        high: 'Підтримуйте регулярні відмітки стану й актуальність даних.',
        medium: 'Допоможуть регулярніші відмітки стану та менше пропусків.',
        low: 'Потрібно більше спостережень і стабільніші вхідні дані.',
        unknown: 'Потрібен додатковий період спостереження.',
      },
    },
    riskLevels: {
      critical: 'Критичний',
      high: 'Високий',
      medium: 'Середній',
      low: 'Низький',
      unknown: 'Невідомий',
    },
    riskStatuses: {
      active: 'Активний',
      escalating: 'Ескалює',
      resolved: 'Вирішений',
      worsened: 'Погіршився',
      suppressed: 'Приглушений',
      unknown: 'Невідомий',
    },
    actions: {
      one_on_one_meeting: 'Провести 1:1 розмову',
      reduce_workload: 'Зменшити навантаження',
      team_sync: 'Провести командну синхронізацію',
    },
    guardReasons: {
      causal_attribution_blocked: 'Система не дозволяє причинно-наслідкове трактування цього зрізу.',
      company_privacy_masked: 'Частина сигналів прихована політикою приватності компанії.',
      group_level_masking: 'Групові дані масковані порогами приватності.',
      scoped_manager_view: 'Видимість обмежена керівним периметром.',
    },
    reportOverview: {
      title: 'Огляд звіту',
      companyHealthSummary: 'Стан компанії',
      actionsList: 'Список дій',
      teamRanking: 'Рейтинг команд',
      signalsSummary: 'Зведення сигналів',
      interpretationGuidance: 'Підказки для інтерпретації',
      executiveSummary: 'Підсумок для керівника',
      confidenceStrip: 'Стрічка впевненості',
      diagnosticsLink: 'Відкрити діагностичний простір',
      totalEstimatedRisk: 'Сумарний ризик',
      attritionCost: 'Втрати від відтоку',
      productivityLoss: 'Втрати продуктивності',
      topTeam: 'Команда з найвищим ризиком',
    },
    riskFeed: {
      title: 'Стрічка ризикових подій',
      operationalSubtitle: 'Операційний перелік ризик-подій для керівного зрізу.',
      diagnosticsSubtitle: 'Перелік backend risk-events у межах поточної компанії в режимі лише для читання.',
      diagnosticsLegend:
        'Серйозність = рівень ризику сигналу, статус = lifecycle-статус події в backend, впевненість = якість і стабільність сигналу.',
      severity: 'Серйозність',
      severityFilterLabel: 'Фільтр за серйозністю',
      status: 'Статус',
      statusFilterLabel: 'Фільтр за статусом',
      confidence: 'Впевненість',
      confidenceFilterLabel: 'Фільтр за впевненістю',
      explanation: 'Пояснення',
      recommendedActions: 'Рекомендовані дії',
      details: 'Деталі',
      debug: 'Діагностика',
      debugOnly: 'Вкладка діагностики доступна лише в діагностичному режимі.',
      signal: 'Сигнал',
      financialRange: 'Фінансовий діапазон',
      lastSeenAt: 'Останнє виявлення',
      effectSize: 'Розмір ефекту',
      history: 'Історія',
      performedActions: 'Виконані дії',
      outcome: 'Результат',
      evidenceStrength: 'Сила доказової бази',
      dataCoverage: 'Покриття даних',
      sampleSize: 'Розмір вибірки',
      targetNoEvents: 'Ризик-подій за поточним зрізом не знайдено.',
      resolveTitle: 'Закрити ризик',
      resolvePlaceholder: 'Додайте операційну нотатку',
      markResolved: 'Позначити як вирішений',
    },
    explainability: {
      title: 'Чому я це бачу?',
      whatHappened: 'Що сталося',
      whyShown: 'Чому це показано',
      reliability: 'Наскільки це надійно',
      recommendedAction: 'Що рекомендовано робити',
    },
    diagnostics: {
      inspectionTitle: 'Інспекція моделі',
      team: 'Команда',
      teamPlaceholder: 'Оберіть команду',
      noTeamsAvailable: 'Немає доступних команд для інспекції.',
      clearTeamSelection: 'Очистити вибір команди',
      riskScore: 'Оцінка ризику',
      anomaly: 'Аномальність',
      probability: 'Ймовірність',
      modelVersion: 'Версія моделі',
      diagnosticsTab: 'Діагностика',
      detailsTab: 'Деталі',
      auditTrail: 'Журнал аудиту',
      policySummary: 'Зведення політик',
      totalEvents: 'Усього подій',
      drift: 'Дрейф',
      calibration: 'Калібрування',
      stateSpace: 'Простір станів',
      predictedNextState: 'Прогнозований наступний стан',
      coupling: 'Зв’язаність',
      synchronization: 'Синхронізація',
      modelTrust: 'Довіра до моделі',
    },
    personalRisk: {
      overviewTitle: 'Персональний огляд ризику',
      timelineTitle: 'Персональна динаміка ризику',
      currentRisk: 'Поточний рівень ризику',
      deviationFromBaseline: 'Відхилення від звичного рівня',
      recentTrend: 'Останній тренд',
      topInsights: 'Ключові інсайти',
      updatedTime: 'Оновлено',
      whySeeingThis: 'Чому я це бачу?',
      recentChanges: 'Останні зміни',
      contributingFactors: 'Фактори впливу',
      dataCompleteness: 'Повнота даних',
      trendDirection: 'Напрям тренду',
      baselineReference: 'Базова лінія',
      baselineShiftTitle: 'Зміна відносно базової лінії',
      recoveryStateTitle: 'Стан відновлення',
      patternStateTitle: 'Стабільність патерну',
      explanationSummary: 'Пояснення побудоване на останніх змінах, факторах впливу та повноті даних.',
      period7d: '7 днів',
      period14d: '14 днів',
      period30d: '30 днів',
      tensionAboveBaseline: 'Напруга вища за звичний рівень',
      recoverySlowed: 'Відновлення сповільнилось',
      patternUnstable: 'Патерн нестабільний',
      stablePattern: 'Стан близький до звичної базової лінії',
    },
    teamDynamics: {
      title: 'Командна динаміка',
      aggregateTrend: 'Агрегований командний тренд',
      propagationRisk: 'Ризик поширення',
      synchronizedDeterioration: 'Синхронне погіршення',
      insightCards: 'Командні інсайти',
      heatmap: 'Теплова мапа команди',
      trendDetail: 'Деталі командного тренду',
      keyChanges: 'Ключові зміни',
      recommendedInterventions: 'Рекомендовані втручання',
      privacyState: 'Стан приватності',
      masked: 'Масковано',
    },
  },
  en: {
    common: {
      noData: 'No data',
      notAvailable: 'Not available',
      hiddenByPolicy: 'Hidden by policy layer',
      unavailableDiagnostics: 'Diagnostic fields are not connected in the current API surface.',
      refresh: 'Refresh',
      retry: 'Retry',
      all: 'All',
      from: 'From',
      to: 'To',
      confidence: 'Confidence',
      invalidDateOrder: 'End date must be later than start date.',
      invalidDateRange: 'Date range cannot exceed 1 year.',
      loadFailed: 'Could not load data.',
    },
    confidence: {
      levels: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        unknown: 'Unknown',
      },
      reasons: {
        high: 'Signals are consistent and data coverage is strong.',
        medium: 'Signals are present, but coverage or stability is partial.',
        low: 'Data or stability is too weak for a strong conclusion.',
        unknown: 'The estimate does not have a reliable confidence signal yet.',
      },
      improvements: {
        high: 'Keep regular check-ins and fresh data coverage.',
        medium: 'More regular check-ins and fewer gaps would help.',
        low: 'More observations and more stable input data are needed.',
        unknown: 'An additional observation window is required.',
      },
    },
    riskLevels: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      unknown: 'Unknown',
    },
    riskStatuses: {
      active: 'Active',
      escalating: 'Escalating',
      resolved: 'Resolved',
      worsened: 'Worsened',
      suppressed: 'Suppressed',
      unknown: 'Unknown',
    },
    actions: {
      one_on_one_meeting: 'Schedule a 1:1',
      reduce_workload: 'Reduce workload',
      team_sync: 'Run a team sync',
    },
    guardReasons: {
      causal_attribution_blocked: 'Causal interpretation is blocked for this slice.',
      company_privacy_masked: 'Part of the signals is hidden by company privacy policy.',
      group_level_masking: 'Group data is masked by privacy thresholds.',
      scoped_manager_view: 'Visibility is limited to the manager scope.',
    },
    reportOverview: {
      title: 'Admin Report Overview',
      companyHealthSummary: 'Company health summary',
      actionsList: 'Actions list',
      teamRanking: 'Team ranking',
      signalsSummary: 'Signals summary',
      interpretationGuidance: 'Interpretation guidance',
      executiveSummary: 'Executive summary',
      confidenceStrip: 'Confidence strip',
      diagnosticsLink: 'Open diagnostics workspace',
      totalEstimatedRisk: 'Total estimated risk',
      attritionCost: 'Attrition cost',
      productivityLoss: 'Productivity loss',
      topTeam: 'Top risk team',
    },
    riskFeed: {
      title: 'Risk Events Feed',
      operationalSubtitle: 'Operational risk events list for the current management slice.',
      diagnosticsSubtitle: 'Read-only backend risk-events feed for the currently selected company.',
      diagnosticsLegend:
        'Severity = signal risk level, status = backend event lifecycle state, confidence = signal quality and stability.',
      severity: 'Severity',
      severityFilterLabel: 'Filter by severity',
      status: 'Status',
      statusFilterLabel: 'Filter by status',
      confidence: 'Confidence',
      confidenceFilterLabel: 'Filter by confidence',
      explanation: 'Explanation',
      recommendedActions: 'Recommended actions',
      details: 'Details',
      debug: 'Debug',
      debugOnly: 'Debug tab is available only in diagnostics mode.',
      signal: 'Signal',
      financialRange: 'Financial range',
      lastSeenAt: 'Last seen',
      effectSize: 'Effect size',
      history: 'History',
      performedActions: 'Performed actions',
      outcome: 'Outcome',
      evidenceStrength: 'Evidence strength',
      dataCoverage: 'Data coverage',
      sampleSize: 'Sample size',
      targetNoEvents: 'No risk events found for the current slice.',
      resolveTitle: 'Resolve risk',
      resolvePlaceholder: 'Add an operational note',
      markResolved: 'Mark resolved',
    },
    explainability: {
      title: 'Why am I seeing this?',
      whatHappened: 'What happened',
      whyShown: 'Why this is shown',
      reliability: 'How reliable it is',
      recommendedAction: 'What to do next',
    },
    diagnostics: {
      inspectionTitle: 'ML Inspection',
      team: 'Team',
      teamPlaceholder: 'Select a team',
      noTeamsAvailable: 'No teams available for inspection.',
      clearTeamSelection: 'Clear team selection',
      riskScore: 'Risk score',
      anomaly: 'Anomaly',
      probability: 'Probability',
      modelVersion: 'Model version',
      diagnosticsTab: 'Diagnostics',
      detailsTab: 'Details',
      auditTrail: 'Audit trail',
      policySummary: 'Policy summary',
      totalEvents: 'Total events',
      drift: 'Drift',
      calibration: 'Calibration',
      stateSpace: 'State-space',
      predictedNextState: 'Predicted next state',
      coupling: 'Coupling',
      synchronization: 'Synchronization',
      modelTrust: 'Model trust',
    },
    personalRisk: {
      overviewTitle: 'Personal Risk Overview',
      timelineTitle: 'Personal Risk Timeline',
      currentRisk: 'Current risk level',
      deviationFromBaseline: 'Deviation from baseline',
      recentTrend: 'Recent trend',
      topInsights: 'Top insights',
      updatedTime: 'Updated',
      whySeeingThis: 'Why am I seeing this?',
      recentChanges: 'Recent changes',
      contributingFactors: 'Contributing factors',
      dataCompleteness: 'Data completeness',
      trendDirection: 'Trend direction',
      baselineReference: 'Baseline reference',
      baselineShiftTitle: 'Baseline shift',
      recoveryStateTitle: 'Recovery state',
      patternStateTitle: 'Pattern stability',
      explanationSummary: 'This explanation is based on recent changes, contributing factors, and data completeness.',
      period7d: '7 days',
      period14d: '14 days',
      period30d: '30 days',
      tensionAboveBaseline: 'Tension is above the typical baseline',
      recoverySlowed: 'Recovery has slowed down',
      patternUnstable: 'The pattern is unstable',
      stablePattern: 'The state is close to the typical baseline',
    },
    teamDynamics: {
      title: 'Team Dynamics',
      aggregateTrend: 'Aggregate team trend',
      propagationRisk: 'Propagation risk',
      synchronizedDeterioration: 'Synchronized deterioration',
      insightCards: 'Team-level insights',
      heatmap: 'Team heatmap',
      trendDetail: 'Team trend detail',
      keyChanges: 'Key changes',
      recommendedInterventions: 'Recommended interventions',
      privacyState: 'Privacy state',
      masked: 'Masked',
    },
  },
  pl: {
    common: {
      noData: 'Brak danych',
      notAvailable: 'Niedostępne',
      hiddenByPolicy: 'Ukryte przez zasady widoczności',
      unavailableDiagnostics: 'Pola diagnostyczne nie są jeszcze podłączone w bieżącym API.',
      refresh: 'Odśwież',
      retry: 'Ponów',
      all: 'Wszystkie',
      from: 'Od',
      to: 'Do',
      confidence: 'Pewność',
      invalidDateOrder: 'Data końcowa musi być późniejsza od początkowej.',
      invalidDateRange: 'Zakres dat nie może przekraczać 1 roku.',
      loadFailed: 'Nie udało się załadować danych.',
    },
    confidence: {
      levels: {
        high: 'Wysoka',
        medium: 'Średnia',
        low: 'Niska',
        unknown: 'Nieznana',
      },
      reasons: {
        high: 'Sygnały są spójne, a pokrycie danych jest mocne.',
        medium: 'Sygnał istnieje, ale pokrycie lub stabilność są częściowe.',
        low: 'Danych lub stabilności jest za mało na mocny wniosek.',
        unknown: 'Ocena nie ma jeszcze wiarygodnego sygnału pewności.',
      },
      improvements: {
        high: 'Utrzymuj regularne aktualizacje nastroju i świeże dane.',
        medium: 'Pomoże więcej regularnych aktualizacji i mniej luk.',
        low: 'Potrzeba więcej obserwacji i stabilniejszych danych wejściowych.',
        unknown: 'Potrzebne jest dodatkowe okno obserwacji.',
      },
    },
    riskLevels: {
      critical: 'Krytyczny',
      high: 'Wysoki',
      medium: 'Średni',
      low: 'Niski',
      unknown: 'Nieznany',
    },
    riskStatuses: {
      active: 'Aktywny',
      escalating: 'Eskalujący',
      resolved: 'Rozwiązany',
      worsened: 'Pogorszony',
      suppressed: 'Wygaszony',
      unknown: 'Nieznany',
    },
    actions: {
      one_on_one_meeting: 'Przeprowadź 1:1',
      reduce_workload: 'Zmniejsz obciążenie',
      team_sync: 'Uruchom synchronizację zespołu',
    },
    guardReasons: {
      causal_attribution_blocked: 'Interpretacja przyczynowa jest zablokowana dla tego wycinka.',
      company_privacy_masked: 'Część sygnałów jest ukryta przez politykę prywatności firmy.',
      group_level_masking: 'Dane grupowe są maskowane przez progi prywatności.',
      scoped_manager_view: 'Widoczność jest ograniczona do zakresu menedżera.',
    },
    reportOverview: {
      title: 'Przegląd raportu',
      companyHealthSummary: 'Stan firmy',
      actionsList: 'Lista działań',
      teamRanking: 'Ranking zespołów',
      signalsSummary: 'Podsumowanie sygnałów',
      interpretationGuidance: 'Wskazówki interpretacyjne',
      executiveSummary: 'Podsumowanie dla kierownictwa',
      confidenceStrip: 'Pasek pewności',
      diagnosticsLink: 'Otwórz obszar diagnostyczny',
      totalEstimatedRisk: 'Łączne ryzyko',
      attritionCost: 'Koszt odejść',
      productivityLoss: 'Strata produktywności',
      topTeam: 'Zespół o najwyższym ryzyku',
    },
    riskFeed: {
      title: 'Strumień zdarzeń ryzyka',
      operationalSubtitle: 'Operacyjna lista zdarzeń ryzyka dla bieżącego widoku menedżerskiego.',
      diagnosticsSubtitle: 'Tylko do odczytu: backendowy feed risk-events dla aktualnie wybranej firmy.',
      diagnosticsLegend:
        'Dotkliwość = poziom ryzyka sygnału, status = stan lifecycle zdarzenia w backendzie, pewność = jakość i stabilność sygnału.',
      severity: 'Dotkliwość',
      severityFilterLabel: 'Filtr według dotkliwości',
      status: 'Status',
      statusFilterLabel: 'Filtr według statusu',
      confidence: 'Pewność',
      confidenceFilterLabel: 'Filtr według pewności',
      explanation: 'Wyjaśnienie',
      recommendedActions: 'Rekomendowane działania',
      details: 'Szczegóły',
      debug: 'Diagnostyka',
      debugOnly: 'Zakładka diagnostyczna jest dostępna tylko w trybie diagnostycznym.',
      signal: 'Sygnał',
      financialRange: 'Zakres finansowy',
      lastSeenAt: 'Ostatnio widziane',
      effectSize: 'Wielkość efektu',
      history: 'Historia',
      performedActions: 'Wykonane działania',
      outcome: 'Wynik',
      evidenceStrength: 'Siła dowodów',
      dataCoverage: 'Pokrycie danych',
      sampleSize: 'Wielkość próby',
      targetNoEvents: 'Nie znaleziono zdarzeń ryzyka dla bieżącego widoku.',
      resolveTitle: 'Zamknij ryzyko',
      resolvePlaceholder: 'Dodaj notatkę operacyjną',
      markResolved: 'Oznacz jako rozwiązane',
    },
    explainability: {
      title: 'Dlaczego to widzę?',
      whatHappened: 'Co się stało',
      whyShown: 'Dlaczego to pokazano',
      reliability: 'Jak bardzo to wiarygodne',
      recommendedAction: 'Co zaleca się zrobić',
    },
    diagnostics: {
      inspectionTitle: 'Inspekcja modelu',
      team: 'Zespół',
      teamPlaceholder: 'Wybierz zespół',
      noTeamsAvailable: 'Brak dostępnych zespołów do inspekcji.',
      clearTeamSelection: 'Wyczyść wybór zespołu',
      riskScore: 'Ocena ryzyka',
      anomaly: 'Anomalia',
      probability: 'Prawdopodobieństwo',
      modelVersion: 'Wersja modelu',
      diagnosticsTab: 'Diagnostyka',
      detailsTab: 'Szczegóły',
      auditTrail: 'Dziennik audytu',
      policySummary: 'Podsumowanie polityk',
      totalEvents: 'Łącznie zdarzeń',
      drift: 'Dryf',
      calibration: 'Kalibracja',
      stateSpace: 'Przestrzeń stanów',
      predictedNextState: 'Przewidywany następny stan',
      coupling: 'Powiązanie',
      synchronization: 'Synchronizacja',
      modelTrust: 'Zaufanie do modelu',
    },
    personalRisk: {
      overviewTitle: 'Osobisty przegląd ryzyka',
      timelineTitle: 'Osobista oś ryzyka',
      currentRisk: 'Aktualny poziom ryzyka',
      deviationFromBaseline: 'Odchylenie od poziomu bazowego',
      recentTrend: 'Ostatni trend',
      topInsights: 'Najważniejsze wnioski',
      updatedTime: 'Zaktualizowano',
      whySeeingThis: 'Dlaczego to widzę?',
      recentChanges: 'Ostatnie zmiany',
      contributingFactors: 'Czynniki wpływu',
      dataCompleteness: 'Kompletność danych',
      trendDirection: 'Kierunek trendu',
      baselineReference: 'Linia bazowa',
      baselineShiftTitle: 'Zmiana względem linii bazowej',
      recoveryStateTitle: 'Stan regeneracji',
      patternStateTitle: 'Stabilność wzorca',
      explanationSummary: 'Wyjaśnienie opiera się na ostatnich zmianach, czynnikach wpływu i kompletności danych.',
      period7d: '7 dni',
      period14d: '14 dni',
      period30d: '30 dni',
      tensionAboveBaseline: 'Napięcie jest wyższe niż zwykły poziom bazowy',
      recoverySlowed: 'Regeneracja spowolniła',
      patternUnstable: 'Wzorzec jest niestabilny',
      stablePattern: 'Stan jest bliski zwykłej linii bazowej',
    },
    teamDynamics: {
      title: 'Dynamika zespołu',
      aggregateTrend: 'Łączny trend zespołu',
      propagationRisk: 'Ryzyko propagacji',
      synchronizedDeterioration: 'Synchroniczne pogorszenie',
      insightCards: 'Wnioski zespołowe',
      heatmap: 'Mapa cieplna zespołu',
      trendDetail: 'Szczegóły trendu zespołu',
      keyChanges: 'Kluczowe zmiany',
      recommendedInterventions: 'Rekomendowane interwencje',
      privacyState: 'Stan prywatności',
      masked: 'Zamaskowane',
    },
  },
}

export function getReportingCopy(locale?: string): ReportingCopy {
  switch (locale) {
    case 'en':
      return COPY_BY_LOCALE.en
    case 'pl':
      return COPY_BY_LOCALE.pl
    case 'uk':
    default:
      return COPY_BY_LOCALE.uk
  }
}
