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

export const mockCartData = async (accessToken) => {
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

  if (!accessToken) {
    throw new Error('Token is missing')
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cartData)
    }, 500)
  })
}
