
import { fetchQueue } from './fetchQueue'
import { localStorageTest } from './localStorageTest'


const queue = fetchQueue()


function gameIdToStoreKey(gameId) {
  return "steam-rating-" + gameId
}

function parseRating(responseBody) {
  const rating = (responseBody.query_summary.total_positive /
    responseBody.query_summary.total_reviews) *
    100;

  if (isNaN(rating)) {
    throw "Rating is not a number"
  }

  return rating
}

function storeRating(steamRatingKey, rating) {
  if (localStorageTest()) {
    localStorage.setItem(steamRatingKey, rating)
  }
}

export function get(gameId) {
  return new Promise((resolve, reject) => {
    const steamRatingKey = gameIdToStoreKey(gameId)

    let rating
    if (localStorageTest() && (rating = localStorage.getItem(steamRatingKey)) && !isNaN(rating)) {
      resolve(rating)
      return
    } else {
      queue.fetch(
        "https://cors-anywhere.herokuapp.com/https://store.steampowered.com/appreviews/" +
        gameId +
        "?json=1&language=all"
      )
        .then(parseRating)
        .then(rating => {
          resolve(rating)
          storeRating(steamRatingKey, rating)
        })
        .catch(reject)
    }
  })
}
