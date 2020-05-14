
import { fetchQueue } from './fetchQueue'
import { localStorageTest } from './localStorageTest'


/**
 * Number of days to keep cache
 */
const cacheUpdateThreshold = 1

const queue = fetchQueue()


/**
 * @param {any} gameId
 * @returns {string}
 */
function gameIdToStoreKey(gameId) {
  return "steam-rating-" + gameId
}

/**
 * @param {object} responseBody
 * @returns {number}
 */
function getRatingFromResponseBody(responseBody) {
  const rating = (responseBody.query_summary.total_positive /
    responseBody.query_summary.total_reviews) *
    100;

  if (isNaN(rating)) {
    throw "Rating is not a number"
  }

  return rating
}

/**
 * @param {number} rating
 * @returns {object}
 */
function transformRating2RatingCached(rating) {
  return {
    value: rating,
    createdAt: new Date
  }
}

/**
 * @param {string} gameId
 * @returns {Promise<object>}
 */
function fetchRatingFor(gameId) {
  return queue.fetch(
    "https://cors-anywhere.herokuapp.com/https://store.steampowered.com/appreviews/" +
    gameId +
    "?json=1&language=all"
  )
    .then(getRatingFromResponseBody)
    .then(transformRating2RatingCached)
}

/**
 * @param {string} steamRatingKey 
 * @param {object} rating 
 */
function localStorageStoreRating(steamRatingKey, rating) {
  if (localStorageTest()) {
    localStorage.setItem(steamRatingKey, JSON.stringify(rating))
  }
}

/**
 * Function might return number because I used to store plain number in local storage
 * @param {string} steamRatingKey 
 * @returns {number|object}
 */
function localStorageReadRating(steamRatingKey) {
  let rating
  if (localStorageTest() && (rating = localStorage.getItem(steamRatingKey)) && typeof rating === 'string') {
    try {
      rating = JSON.parse(rating)

      if (typeof rating === 'object' && 'createdAt' in rating) {
        rating.createdAt = new Date(rating.createdAt)
      }

      return rating
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e
      console.log(e)
    }
  }
}

/**
 * @param {string} gameId 
 */
export function get(gameId) {
  return new Promise((resolve, reject) => {
    const steamRatingKey = gameIdToStoreKey(gameId)

    /** @type {number|object} */
    let rating = localStorageReadRating(steamRatingKey)
    if (rating) {
      // Old way of storing - just a plain number
      if (typeof rating === 'number') {
        resolve(rating)
        // pass through to fetch new rating with createdAt time
      } else if (typeof rating === 'object') {
        resolve(rating.value)

        if (rating.createdAt) {
          // If value was fetched less than a day ago, don't refetch
          const daysDiff = parseInt((new Date - rating.createdAt) / (24 * 3600 * 1000))
          if (daysDiff < cacheUpdateThreshold) {
            return
          }
        }
      }
    }

    fetchRatingFor(gameId)
      .then(rating => {
        localStorageStoreRating(steamRatingKey, rating)
        resolve(rating.value)
      })
      .catch(reject)
  })
}
