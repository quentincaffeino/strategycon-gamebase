
import { fetchQueue } from './fetchQueue'
import { localStorageTest } from './localStorageTest'


/**
 * Number of days to keep cache
 */
const cacheUpdateThreshold = 1

const queue = fetchQueue()


export class AbstractRatingProvider {

  /**
   * @protected
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    throw "Not implemented"
  }

  /**
   * @protected
   * @param {any} gameId
   * @returns {string}
   */
  getDataCollectionKey(gameId) {
    throw "Not implemented"
  }

  /**
   * @protected
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
      updatedAt: new Date
    }
  }

  /**
   * @protected
   * @param {any} gameId
   * @returns {string} 
   */
  transformGameIdToResourceUrl(gameId) {
    throw "Not implemented"
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {Promise<object>}
   */
  fetchRatingFor(gameId) {
    return queue.fetch(this.transformGameIdToResourceUrl(gameId))
      .then(this.getRatingFromResponseBody)
      .then(this.transformRatingToRatingCached)
  }

  /**
   * @private
   * @param {string} ratingKey 
   * @param {object} rating 
   */
  localStorageStoreRating(ratingKey, rating) {
    if (localStorageTest()) {
      localStorage.setItem(ratingKey, JSON.stringify(rating))
    }
  }

  /**
   * Function might return number because I used to store plain number in local storage
   * @private
   * @param {string} ratingKey 
   * @returns {number|object|undefined}
   */
  localStorageReadRating(ratingKey) {
    let rating

    if (localStorageTest() && (rating = localStorage.getItem(ratingKey))) {
      if (typeof rating === 'string') {
        try {
          rating = JSON.parse(rating)

          if (typeof rating === 'object' && 'updatedAt' in rating) {
            rating.updatedAt = new Date(rating.updatedAt)
          }

        } catch (e) {
          if (!(e instanceof SyntaxError)) throw e
          console.log(e)
        }
      }
    }

    return rating
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {object|null}
   */
  _getItemFromDataCollection(gameId) {
    if (localStorageTest()) {
      const collectionRaw = localStorage.getItem("data-collection-" + this.getDataCollectionKey())
      if (collectionRaw) {
        const collection = JSON.parse(collectionRaw)

        for (const game of collection) {
          if ("game_id" in game && game["game_id"] == gameId) {
            if (typeof game === 'object' && 'modified_on' in game) {
              game.modified_on = new Date(game.modified_on)
            }
            return game
          }
        }
      }
    }

    return null
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {object|null}
   */
  _getValueFromDataCollection(gameId) {
    const game = this._getItemFromDataCollection(gameId)

    if (game && game.rating != 0) {
      if (game.modified_on && isOld(game.modified_on)) {
        return null
      }

      return game.rating
    }

    return null
  }

  /**
   * @private
   * @param {any} gameId
   * @param {number} rating
   * @returns {void}
   */
  _storeValueInDataCollection(gameId, rating) {
    const game = this._getItemFromDataCollection(gameId)

    if (!rating || rating <= 0) return

    if (game && game.id) {
      queue.fetch('https://gametable.strategycon.ru/gamestable/items/' + this.getDataCollectionKey() + '/' + game.id, {
        method: "PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: Math.round(rating)
        })
      })
    } else {
      queue.fetch('https://gametable.strategycon.ru/gamestable/items/' + this.getDataCollectionKey(), {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game_id: gameId,
          rating: Math.round(rating)
        })
      })
    }
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {object|null}
   */
  _getValueFromStore(gameId) {
    const ratingKey = this.gameIdToStoreKey(gameId)

    /** @type {number|object|undefined} */
    let rating = this.localStorageReadRating(ratingKey)
    if (rating) {
      // Old way of storing - just a plain number
      if (typeof rating === 'number') {
        return rating
        // pass through to fetch new rating with updatedAt time
      } else if (typeof rating === 'object') {
        if (rating.updatedAt && isOld(rating.updatedAt)) {
          return null
        }

        return rating.value
      }
    }

    return null
  }

  /**
   * @param {any} gameId
   * @returns {Promise<number>}
   */
  get(gameId) {
    return new Promise((resolve, reject) => {
      let rating = this._getValueFromDataCollection(gameId)
      if (rating) return resolve(rating)

      rating = this._getValueFromStore(gameId)
      if (rating) {
        this._storeValueInDataCollection(gameId, rating)
        return resolve(rating)
      }

      this.fetchRatingFor(gameId)
        .then(rating => {
          this._storeValueInDataCollection(gameId, rating)
          resolve(rating.value)
        })
        .catch(reject)
    })
  }

}


function isOld(updatedAt) {
  // If value was fetched less than a day ago, don't refetch
  const daysDiff = parseInt((new Date - updatedAt) / (24 * 3600 * 1000))
  return daysDiff >= cacheUpdateThreshold
}
