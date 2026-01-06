import { Achievements, LocalizedText } from '@/types/achievements'
import { Affirmation } from '@/types/affirmation'
import { BestDay, Mood } from '@/types/bestDay'
import { CartItemProps } from '@/types/cart'
import { Exercise } from '@/types/exercisesForRecovery'
import { ShopItemProps } from '@/types/shop'

import { CreateGoalDto, GoalEntity, UpdateGoalDto } from '../types/api-responses'

export const mockProfileData = async (accessToken: string) => {
  const profileData = {
    name: 'User name',
    email: 'user@example.com',
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
  }

  if (!accessToken) {
    throw new Error('Token is missing')
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profileData)
    }, 500)
  })
}

export const mockCartData = async (): Promise<CartItemProps[]> => {
  const cartData = [
    {
      id: '1',
      name: 'Нековзний йога-коврик',
      price: 10,
      quantity: 1,
      image:
        'https://images.pexels.com/photos/4325439/pexels-photo-4325439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      description:
        'Звукоізоляційний, ідеальний для скакалки та занять на відкритому повітрі, 68.58см x 182.88см, Синій',
    },
    {
      id: '2',
      name: 'Футболка для йоги',
      price: 20,
      quantity: 1,
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
      description:
        'Повсякденна футболка з коротким рукавом з круглим вирізом з трикотажної тканини з дизайном для медитації на всі пори року',
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cartData)
    }, 500)
  })
}

export const mockShopData = async (): Promise<ShopItemProps[]> => {
  const shopProducts = [
    {
      id: '1',
      name: 'Fjallraven',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',

      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
    {
      id: '2',
      name: 'T-Shirts ',
      price: 22.3,
      description:
        'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',

      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    },
    {
      id: '3',
      name: 'Jacket',
      price: 55.99,
      description:
        'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',

      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    },
    {
      id: '4',
      name: 'Mens Casual Slim Fit',
      price: 15.99,
      description:
        'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.',

      image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    },
    {
      id: '5',
      name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
      price: 695,
      description:
        "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",

      image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      id: '6',
      name: 'Solid Gold Petite Micropave ',
      price: 168,
      description:
        'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.',

      image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      id: '7',
      name: 'White Gold Plated Princess',
      price: 9.99,
      description:
        "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",

      image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      id: '8',
      name: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
      price: 10.99,
      description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel',

      image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg',
    },
    {
      id: '9',
      name: 'WD 2TB Elements Portable External Hard Drive - USB 3.0 ',
      price: 64,
      description:
        'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',

      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    },
    {
      id: '10',
      name: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
      price: 109,
      description:
        'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)',

      image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    },
    {
      id: '11',
      name: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
      price: 109,
      description:
        '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.',

      image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg',
    },
    {
      id: '12',
      name: 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
      price: 114,
      description:
        "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",

      image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    },
    {
      id: '13',
      name: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin',
      price: 599,
      description:
        '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz',

      image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    },
    {
      id: '14',
      name: 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ',
      price: 999.99,
      description:
        '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag',

      image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    },
    {
      id: '15',
      name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
      price: 56.99,
      description:
        'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates',
      image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    },
    {
      id: '16',
      name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
      price: 29.95,
      description:
        '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON',
      image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    },
    {
      id: '17',
      name: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
      price: 39.99,
      description:
        "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
      image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    },
    {
      id: '18',
      name: "MBJ Women's Solid Short Sleeve Boat Neck V ",
      price: 9.85,
      description:
        '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem',
      image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
    },
    {
      id: '19',
      name: "Opna Women's Short Sleeve Moisture",
      price: 7.95,
      description:
        '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort',
      image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
    },
    {
      id: '20',
      name: 'DANVOUY Womens T Shirt Casual Cotton Short',
      price: 12.99,
      description:
        '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.',
      image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg',
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shopProducts)
    }, 500)
  })
}

export const mockDailyAffirmation = async (): Promise<Affirmation> => {
  const dailyData: Affirmation = {
    id: '648a52d9fc13ae44e8000001',
    isPublished: false,
    translations: {
      en: 'Every day I become stronger and more confident on my path.',
      uk: 'Кожного дня я стаю все сильнішим та впевненим на своєму шляху.',
      pl: 'Każdego dnia staję się silniejszy i pewniejszy na swojej drodze.',
    },
    createdAt: '2024-11-19T14:35:30.742Z',
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dailyData)
    }, 500)
  })
}

export const mockDailyTip = async (): Promise<Affirmation> => {
  const dailyData: Affirmation = {
    id: '648a52d9fc13ae44e8000014',
    isPublished: false,
    translations: {
      en: 'Start your day by setting one small achievable goal — it creates momentum for greater successes!',
      uk: 'Почніть свій день із постановки однієї маленької досяжної цілі — це створює імпульс для більших успіхів!',
      pl: 'Rozpocznij swój dzień od wyznaczenia jednego małego, osiągalnego celu — to tworzy impuls do większych sukcesów!',
    },
    createdAt: '2025-11-19T14:35:30.742Z',
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dailyData)
    }, 500)
  })
}

export const mockExercisesRecoveryData = async (): Promise<Exercise[]> => {
  const exercises: Exercise[] = [
    {
      title: 'Дихальна практика',
      description: '5-хвилинна вправа для заспокоєння',
      icon: 'lungs',
    },
    {
      title: 'Коротка медитаці',
      description: 'Медитація для фокусу та спокою',
      icon: 'headphones',
    },
    {
      title: 'Антистрес аудіо',
      description: 'Заспокійливі звуки природи',
      icon: 'human',
    },
    {
      title: 'Заспокой мене зараз',
      description: 'Екстрений режим для зняття тривоги',
      icon: 'sos',
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(exercises)
    }, 500)
  })
}

export const mockAffirmations = async (): Promise<Affirmation[]> => {
  const affirmations: Affirmation[] = [
    {
      id: '648a52d9fc13ae44e8000001',
      isPublished: false,
      translations: {
        uk: 'Мої думки створюють мою реальність, і я обираю позитивні думки.',
        en: 'My thoughts create my reality, and I choose positive thoughts.',
        pl: 'Moje myśli tworzą moją rzeczywistość, więc wybieram pozytywne myśli',
      },
      createdAt: '2024-11-19T14:35:30.742Z',
    },
    {
      id: '64ccf9e2fc13ae44e800a001',
      isPublished: false,
      translations: {
        uk: 'Спробуй поставити таймер на 3 хвилини і просто дихай. Більше нічого.',
        en: 'Try setting a timer for 3 minutes and just breathe. Nothing else.',
        pl: 'Ustaw minutnik na 3 minuty i po prostu oddychaj. Nic więcej.',
      },
      createdAt: '2025-08-06T09:17:42.312Z',
    },
    {
      id: '64ccfa13fc13ae44e800a002',
      isPublished: false,
      translations: {
        uk: 'Я вірю в себе і свої можливості досягти успіху.',
        en: 'I believe in myself and my ability to succeed.',
        pl: 'Wierzę w siebie i w moje możliwości osiągnięcia sukcesu.',
      },
      createdAt: '2025-08-05T15:48:10.129Z',
    },
    {
      id: '64ccfa45fc13ae44e800a003',
      isPublished: false,
      translations: {
        uk: 'Дозволь собі просту радість — улюблену пісню, серіал, теплу ковдру. Це не дрібниці.',
        en: 'Allow yourself simple joys — a favorite song, a show, a warm blanket. These are not trivial things.',
        pl: 'Pozwól sobie na proste radości — ulubioną piosenkę, serial, ciepły koc. To nie są błahostki.',
      },
      createdAt: '2025-07-31T21:04:55.657Z',
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(affirmations)
    }, 500)
  })
}

export const mockTips = async (): Promise<Affirmation[]> => {
  const tips = [
    {
      id: '650a12b3fc13ae44e800c101',
      isPublished: false,
      translations: {
        uk: 'Я заслуговую на щастя і внутрішній спокій.',
        en: 'I deserve happiness and inner peace.',
        pl: 'Zasługuję na szczęście i wewnętrzny spokój.',
      },
      createdAt: '2025-08-06T10:12:45.000Z',
    },
    {
      id: '650a12e7fc13ae44e800c102',
      isPublished: false,
      translations: {
        uk: 'Навіть маленький крок уперед — це все одно прогрес.',
        en: 'Even a small step forward is still progress.',
        pl: 'Nawet mały krok do przodu to wciąż postęp.',
      },
      createdAt: '2025-08-05T14:25:30.000Z',
    },
    {
      id: '650a1312fc13ae44e800c103',
      isPublished: false,
      translations: {
        uk: 'Твої почуття мають значення. Прислухайся до себе.',
        en: 'Your feelings matter. Listen to yourself.',
        pl: 'Twoje uczucia mają znaczenie. Wsłuchaj się w siebie.',
      },
      createdAt: '2025-08-04T08:47:10.000Z',
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tips)
    }, 500)
  })
}

export const mockAchievements = async (): Promise<Achievements[]> => {
  const achievements: Achievements[] = [
    {
      id: 101001,
      icon: 'clap',
      title: {
        uk: 'Початок шляху',
        en: 'The Beginning',
        pl: 'Początek drogi',
      },
      description: {
        uk: 'Зробити перший запис настрою',
        en: 'Make your first mood entry',
        pl: 'Zrób pierwszy wpis nastroju',
      },
      status: 'unlocked',
      progress: 1,
      currentProgress: 1,
    },
    {
      id: 101002,
      icon: 'sun',
      title: {
        uk: 'Турбота 3 дні поспіль',
        en: 'Care for 3 days in a row',
        pl: 'Opieka przez 3 dni z rzędu',
      },
      description: {
        uk: 'Відвідати платформу три дні підряд',
        en: 'Visit the platform three days in a row',
        pl: 'Odwiedzaj platformę trzy dni z rzędu',
      },
      status: 'locked',
      progress: 3,
      currentProgress: 0,
    },
    {
      id: 101003,
      icon: 'sparkles',
      title: {
        uk: 'Мить для себе',
        en: 'A Moment for Yourself',
        pl: 'Chwila dla siebie',
      },
      description: {
        uk: 'Завершити першу медитацію',
        en: 'Complete your first meditation',
        pl: 'Ukończ pierwszą medytację',
      },
      status: 'locked',
      progress: 1,
      currentProgress: 0,
    },
    {
      id: 101004,
      icon: 'dizzy',
      title: {
        uk: 'Тиждень з нами',
        en: 'A Week with Us',
        pl: 'Tydzień z nami',
      },
      description: {
        uk: '7 днів поспіль із практиками. Це вже справжній ритм',
        en: '7 days in a row with practices. That’s a real rhythm',
        pl: '7 dni z rzędu z praktykami. To już prawdziwy rytm',
      },
      status: 'locked',
      progress: 7,
      currentProgress: 3,
    },
    {
      id: 101005,
      icon: 'chart',
      title: {
        uk: 'Моя стабільність',
        en: 'My Stability',
        pl: 'Moja stabilność',
      },
      description: {
        uk: 'Створювати записи настрою 14 днів підряд',
        en: 'Create mood entries 14 days in a row',
        pl: 'Twórz wpisy nastroju przez 14 dni z rzędu',
      },
      status: 'unlocked',
      progress: 14,
      currentProgress: 14,
    },
    {
      id: 101006,
      icon: 'meditation',
      title: {
        uk: 'Медитатор',
        en: 'Meditator',
        pl: 'Medytator',
      },
      description: {
        uk: 'Завершити 5 медитацій',
        en: 'Complete 5 meditations',
        pl: 'Ukończ 5 medytacji',
      },
      status: 'locked',
      progress: 5,
      currentProgress: 1,
    },
    {
      id: 101007,
      icon: 'pen',
      title: {
        uk: 'Письменник',
        en: 'Writer',
        pl: 'Pisarz',
      },
      description: {
        uk: 'Створено 10 записів у щоденнику',
        en: 'Create 10 journal entries',
        pl: 'Stwórz 10 wpisów w dzienniku',
      },
      status: 'locked',
      progress: 10,
      currentProgress: 0,
    },
    {
      id: 101008,
      icon: 'puzzle',
      title: {
        uk: 'Зрозуміти себе',
        en: 'Understand Yourself',
        pl: 'Zrozumieć siebie',
      },
      description: {
        uk: 'Пройти 3 тести й вже буде ясніше. Ти складаєш свій власний пазл',
        en: 'Complete 3 tests and things will be clearer. You are building your own puzzle',
        pl: 'Ukończ 3 testy i będzie jaśniej. Układasz własną układankę',
      },
      status: 'unlocked',
      progress: 3,
      currentProgress: 3,
    },
    {
      id: 101009,
      icon: 'muscle',
      title: {
        uk: 'Стійкість',
        en: 'Resilience',
        pl: 'Wytrwałość',
      },
      description: {
        uk: 'Користування платформою 30 днів',
        en: 'Use the platform for 30 days',
        pl: 'Korzystanie z platformy przez 30 dni',
      },
      status: 'locked',
      progress: 30,
      currentProgress: 6,
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(achievements)
    }, 500)
  })
}

export const mockBestDay = async (): Promise<BestDay> => {
  const bestDay: BestDay = {
    mood: 'very good',
    stress: 'absent',
    date: '2025-08-06T10:12:45.000Z',
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bestDay)
    }, 500)
  })
}

export const mockMoodMarks = async (): Promise<Record<Mood, number>> => {
  const moodMarks = {
    'very good': 2,
    good: 4,
    neutral: 0,
    bad: 12,
    'very bad': 3,
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(moodMarks)
    }, 500)
  })
}

export const mockStressLevel = async (): Promise<number> => {
  const stressLevelData = 25

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stressLevelData)
    }, 500)
  })
}

export const mockTodayObservations = async (): Promise<LocalizedText[]> => {
  const observations = [
    {
      uk: 'Твоя активність на хорошому рівні - так тримати!',
      en: 'Your activity is at a good level - keep it up!',
      pl: 'Twoja aktywność jest na dobrym poziomie - tak trzymaj!',
    },
    {
      uk: 'Ти зберігаєш стабільність у своїх діях – це приносить результат!',
      en: 'You are maintaining consistency in your actions – this brings results!',
      pl: 'Utrzymujesz konsekwencję w swoich działaniach – to przynosi efekty!',
    },
    {
      uk: 'Кожен маленький крок наближає тебе до більшої мети.',
      en: 'Every small step brings you closer to a bigger goal.',
      pl: 'Każdy mały krok przybliża Cię do większego celu.',
    },
  ]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(observations)
    }, 500)
  })
}
//Goals
export type GetGoalsResult = { data: GoalEntity[] } | { error: string }

export const goalsDb: GoalEntity[] = [
  {
    id: '1',
    userId: 'user1',
    text: 'Finish the React project',
    repeat: 5,
    check: 5,
    status: 'completed',
  },
  {
    id: '2',
    userId: 'user1',
    text: 'Finish the React project 2',
    repeat: 7,
    check: 5,
    status: 'in progress',
  },
]

export function delay(ms = 400) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function mockGetGoals() {
  await delay()

  try {
    return {
      data: [...goalsDb],
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function mockCreateGoal(goalData: CreateGoalDto) {
  await delay()
  const newGoal: GoalEntity = {
    id: (goalsDb.length + 1).toString(),
    userId: 'user1',
    text: goalData.text,
    repeat: goalData.repeat,
    check: 0,
    status: 'pending',
  }
  try {
    goalsDb.push(newGoal)
    return { data: newGoal }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function mockUpdateGoal(goalId: string, goalData: UpdateGoalDto) {
  await delay()

  try {
    const goalIndex = goalsDb.findIndex((g) => g.id === goalId)
    if (goalIndex === -1) {
      return { error: 'Goal not found' }
    }

    goalsDb[`${goalIndex}`] = {
      ...goalsDb[`${goalIndex}`],
      ...goalData,
    }
    console.log('Updated goal:', goalsDb)

    return { data: goalsDb[`${goalIndex}`] }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function mockDeleteGoal(goalId: string) {
  await delay()

  try {
    const goalIndex = goalsDb.findIndex((g) => g.id === goalId)
    if (goalIndex === -1) {
      return { error: 'Goal not found' }
    }

    goalsDb.splice(goalIndex, 1)
    return { data: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
