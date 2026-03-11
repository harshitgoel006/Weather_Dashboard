export const getFavorites = () => {

  const data = localStorage.getItem("favorites")

  return data ? JSON.parse(data) : []

}

export const saveFavorite = (city) => {

  const favorites = getFavorites()

  if (!favorites.includes(city)) {

    favorites.push(city)

    localStorage.setItem("favorites", JSON.stringify(favorites))

  }

}

export const removeFavorite = (city) => {

  const favorites = getFavorites().filter(c => c !== city)

  localStorage.setItem("favorites", JSON.stringify(favorites))

}