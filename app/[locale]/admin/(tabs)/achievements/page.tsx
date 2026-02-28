import AchievementCard from '@/components/admin/AchievementCard'

const cards = [
  {
    iconClass: 'fi-rr-plane',
    title: 'Початок шляху',
    subtitle: 'Зробити перший запис настрою',
    count: 0,
    cardClass: 'time-once',
  },
  {
    iconClass: 'fi-rr-sun',
    title: 'Турбота 3 дні поспіль',
    subtitle: 'Відвідати платформу три дні підряд',
    count: 0,
    cardClass: 'time-some',
  },
  {
    iconClass: 'fi-rr-trophy',
    title: 'Стійкість',
    subtitle: 'Користуватися платформою 30 днів',
    count: 0,
    cardClass: 'time-long',
  },
  {
    iconClass: 'fi-rr-sparkles',
    title: 'Тиждень з нами',
    subtitle: '7 днів поспіль із практиками. Це вже справжній ритм',
    count: 0,
    cardClass: 'time-some',
  },
  {
    iconClass: 'fi-rr-document',
    title: 'Моя стабільність',
    subtitle: 'Створити записи настрою 14 днів підряд',
    count: 0,
    cardClass: 'time-some',
  },
  {
    iconClass: 'fi-rr-heart',
    title: 'Щирість із собою',
    subtitle: 'Зробити 15 записів настрою з нотаткою',
    count: 0,
    cardClass: 'time-some',
  },
  {
    iconClass: 'fi-rr-calendar',
    title: 'Стійкість у дії',
    subtitle: 'Користуватися платформою 3 місяці',
    count: 0,
    cardClass: 'time-long',
  },
  {
    iconClass: 'fi-rr-edit',
    title: 'Письменник',
    subtitle: 'Створити 10 записів у щоденнику',
    count: 0,
    cardClass: 'time-some',
  },
  {
    iconClass: 'fi-rr-search',
    title: 'Відкриття себе',
    subtitle: 'Пройти перший тест',
    count: 0,
    cardClass: 'time-once',
  },
]

export default function AdminAchievementsPage() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Досягнення</h2>

      <section className="mb-6">
        <h3 className="mb-3 text-lg font-medium">Один раз</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards
            .filter((c) => c.cardClass === 'time-once')
            .map((c) => (
              <AchievementCard
                key={c.title}
                iconClass={c.iconClass}
                title={c.title}
                subtitle={c.subtitle}
                count={c.count}
                cardClass={c.cardClass}
              />
            ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-lg font-medium">Деякий час</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards
            .filter((c) => c.cardClass === 'time-some')
            .map((c) => (
              <AchievementCard
                key={c.title}
                iconClass={c.iconClass}
                title={c.title}
                subtitle={c.subtitle}
                count={c.count}
                cardClass={c.cardClass}
              />
            ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 text-lg font-medium">Довго</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards
            .filter((c) => c.cardClass === 'time-long')
            .map((c) => (
              <AchievementCard
                key={c.title}
                iconClass={c.iconClass}
                title={c.title}
                subtitle={c.subtitle}
                count={c.count}
                cardClass={c.cardClass}
              />
            ))}
        </div>
      </section>
    </div>
  )
}
