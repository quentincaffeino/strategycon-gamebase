
import { fetchQueue } from './fetchQueue'
import { localStorageTest } from './localStorageTest'


/**
 * Number of days to keep cache
 */
const cacheUpdateThreshold = 1

const queue = fetchQueue()


export class AbstractRatingProvider {

  /**
   * @private
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    throw "Not implemented"
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    throw "Not implemented"
  }

  /**
   * @private
   * @param {number} rating
   * @returns {object}
   */
  transformRatingToRatingCached(rating) {
    return {
      value: rating,
      createdAt: new Date
    }
  }

  /**
   * @private
   * @param {string} gameId
   * @returns {string} 
   */
  transformGameIdToResourceUrl(gameId) {
    throw "Not implemented"
  }

  /**
   * @private
   * @param {string} gameId
   * @returns {Promise<object>}
   */
  fetchRatingFor(gameId) {
    return queue.fetch(this.transformGameIdToResourceUrl(gameId))
      .then(this.getRatingFromResponseBody)
      .then(this.transformRatingToRatingCached)
  }

  /**
   * @private
   * @param {string} steamRatingKey 
   * @param {object} rating 
   */
  localStorageStoreRating(steamRatingKey, rating) {
    if (localStorageTest()) {
      localStorage.setItem(steamRatingKey, JSON.stringify(rating))
    }
  }

  /**
   * Function might return number because I used to store plain number in local storage
   * @private
   * @param {string} steamRatingKey 
   * @returns {number|object}
   */
  localStorageReadRating(steamRatingKey) {
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
   * @returns {Promise<number>}
   */
  get(gameId) {
    return new Promise((resolve, reject) => {
      const steamRatingKey = this.gameIdToStoreKey(gameId)

      /** @type {number|object} */
      let rating = this.localStorageReadRating(steamRatingKey)
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

      this.fetchRatingFor(gameId)
        .then(rating => {
          this.localStorageStoreRating(steamRatingKey, rating)
          resolve(rating.value)
        })
        .catch(reject)
    })
  }

}
