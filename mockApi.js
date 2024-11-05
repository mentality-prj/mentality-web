export const mockProfileData = async (accessToken) => {
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
