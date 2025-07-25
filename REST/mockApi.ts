import { DailyCardProps } from '@/components/Home/DailyCard'
import { CardMyNotes } from '@/types/cardMyNotes'
import { CardRecommendation } from '@/types/cardRecommendation'
import { CartItemProps } from '@/types/cart'
import { Exercise } from '@/types/exercisesForRecovery'
import { ShopItemProps } from '@/types/shop'

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

export const mockDashboardDailyData = async (): Promise<DailyCardProps[]> => {
  const dailyData: DailyCardProps[] = [
    {
      title: 'Ваша щоденна афірмація',
      textContent: 'Кожного дня я стаю все сильнишим та впевненим на своєму шляху.',
      buttonText: 'Всі афірмації',
    },
    {
      title: 'Порада дня',
      textContent:
        'Почніть свій день із постановки однієї маленької досяжної цілі — це створює імпульс для більших успіхів!',
      buttonText: 'Всі поради',
    },
  ]
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

export const mockCardMyNotes = async (): Promise<CardMyNotes[]> => {
  const cardMyNotes: CardMyNotes[] = [
    {
      title: 'Записати думки',
      description: 'Введи щоденник своїх думок та емоцій',
      icon: 'hand-that-writes',
      link: 'my-thoughts',
    },
    {
      title: 'Психологічні тести',
      description: 'Оціни свій емоційний стан',
      icon: 'puzzle',
      link: 'tests',
    },
    {
      title: 'Афірмації та поради',
      description: 'Надихайся позитивними думками',
      icon: 'star-motion',
      link: 'affirmations',
    },
    {
      title: 'Збережене',
      description: 'Твої збережені афірмації та поради',
      icon: 'star',
      link: 'saved',
    },
  ]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cardMyNotes)
    }, 500)
  })
}

export const mockCardRecommendation = async (): Promise<CardRecommendation[]> => {
  const cardRecommendation: CardRecommendation[] = [
    {
      tag: 'Практика',
      title: 'Щоденне ведення журналу',
      description: 'Записуйте свої думки щодня для кращого розуміння емоцій',
    },
    {
      tag: 'Практика',
      title: 'Регулярні тести',
      description: 'Проходьте психологічні тести для відстеження прогресу',
    },
    {
      tag: 'Практика',
      title: 'Позитивні афірмації',
      description: 'Читайте щоденні афірмації для підтримки позитивного настрою',
    },
  ]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cardRecommendation)
    }, 500)
  })
}
