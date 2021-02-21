import debug from "debug";

import { fetchQueue } from "./fetchQueue";
import { localStorageTest } from "./localStorageTest";

const log = debug("gamestable:AbstractRatingProvider");

/**
 * Number of days to keep cache
 */
const cacheUpdateThreshold = 1;

const queue = fetchQueue();

export class AbstractRatingProvider {
  /**
   * @returns {bool}
   */
  hasDataCollection() {
    return false;
  }

  /**
   * @protected
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    throw "Not implemented";
  }

  /**
   * @protected
   * @param {any} gameId
   * @returns {string}
   */
  getDataCollectionKey(gameId) {
    throw "Not implemented";
  }

  /**
   * @protected
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    throw "Not implemented";
  }

  /**
   * @private
   * @param {number} rating
   * @returns {object}
   */
  transformRatingToRatingCached(rating) {
    return {
      value: rating,
      updatedAt: new Date(),
    };
  }

  /**
   * @protected
   * @param {any} gameId
   * @returns {string}
   */
  transformGameIdToResourceUrl(gameId) {
    throw "Not implemented";
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {Promise<object>}
   */
  fetchRatingFor(gameId) {
    log("fetchRatingFor(gameId: %o)", gameId);

    const resourceUrl = this.transformGameIdToResourceUrl(gameId);
    log("fetchRatingFor(gameId: %o) -> resourceUrl: %o", gameId, resourceUrl);

    return queue
      .fetch(resourceUrl)
      .then(this.getRatingFromResponseBody)
      .then(this.transformRatingToRatingCached);
  }

  /**
   * @private
   * @param {string} ratingKey
   * @param {object} rating
   */
  localStorageStoreRating(ratingKey, rating) {
    log(
      "localStorageStoreRating(ratingKey: %o, rating: %o)",
      ratingKey,
      rating
    );

    if (localStorageTest()) {
      localStorage.setItem(ratingKey, JSON.stringify(rating));
    }
  }

  /**
   * Function might return number because I used to store plain number in local storage
   * @private
   * @param {string} ratingKey
   * @returns {number|object|undefined}
   */
  localStorageReadRating(ratingKey) {
    let rating;

    if (localStorageTest() && (rating = localStorage.getItem(ratingKey))) {
      if (typeof rating === "string") {
        try {
          rating = JSON.parse(rating);

          if (typeof rating === "object" && "updatedAt" in rating) {
            rating.updatedAt = new Date(rating.updatedAt);
          }
        } catch (e) {
          if (!(e instanceof SyntaxError)) throw e;
          console.log(e);
        }
      }
    }

    return rating;
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {object|null}
   */
  _getItemFromDataCollection(gameId) {
    if (localStorageTest()) {
      const collectionRaw = localStorage.getItem(
        "data-collection-" + this.getDataCollectionKey()
      );
      if (collectionRaw) {
        const collection = JSON.parse(collectionRaw);

        for (const game of collection) {
          if ("game_id" in game && game["game_id"] == gameId) {
            if (typeof game === "object" && "modified_on" in game) {
              game.modified_on = new Date(game.modified_on);
            }
            return game;
          }
        }
      }
    }

    return null;
  }

  /**
   * @private
   * @param {any} gameId
   * @param {boolean} ignoreIsOld
   * @returns {object|null}
   */
  _getValueFromDataCollection(gameId, ignoreIsOld = false) {
    const game = this._getItemFromDataCollection(gameId);

    if (game && game.rating != 0) {
      log("_getValueFromDataCollection(gameId: %o): game: %o", gameId, game);

      if (ignoreIsOld) {
        log("_getValueFromDataCollection(gameId: %o): ignoring isOld");
      } else if (!ignoreIsOld && game.modified_on && isOld(game.modified_on)) {
        log("_getValueFromDataCollection(gameId: %o): is old enough", gameId);

        return null;
      }

      log(
        "_getValueFromDataCollection(gameId: %o) -> rating: %o",
        gameId,
        game.rating
      );
      return game.rating;
    }

    return null;
  }

  /**
   * @private
   * @param {any} gameId
   * @param {number} rating
   * @returns {void}
   */
  _storeValueInDataCollection(gameId, rating) {
    log("_storeValueInDataCollection(gameId: %o, rating: %o)", gameId, rating);

    if (!rating || rating <= 0) return;

    const game = this._getItemFromDataCollection(gameId);
    log(
      "_storeValueInDataCollection(gameId: %o, rating: %o) -> game: %o",
      gameId,
      rating,
      game
    );

    if (game && game.id) {
      log(
        "_storeValueInDataCollection(gameId: %o, rating: %o) Updating",
        gameId,
        rating
      );

      queue.fetch(
        "https://gametable.strategycon.ru/gamestable/items/" +
          this.getDataCollectionKey() +
          "/" +
          game.id,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: Math.round(rating),
          }),
        }
      );
    } else {
      log(
        "_storeValueInDataCollection(gameId: %o, rating: %o): Creating",
        gameId,
        rating
      );

      queue.fetch(
        "https://gametable.strategycon.ru/gamestable/items/" +
          this.getDataCollectionKey(),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: gameId,
            rating: Math.round(rating),
          }),
        }
      );
    }
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {object|null}
   */
  _getValueFromStore(gameId) {
    log("_getValueFromStore(gameId: %o)", gameId);

    const ratingKey = this.gameIdToStoreKey(gameId);
    log("_getValueFromStore(gameId: %o) -> ratingKey: %o", gameId, ratingKey);

    /** @type {number|object|undefined} */
    let rating = this.localStorageReadRating(ratingKey);
    log("_getValueFromStore(gameId: %o) -> rating: %o", gameId, rating);

    if (rating) {
      // Old way of storing - just a plain number
      if (typeof rating === "number") {
        return rating;
        // pass through to fetch new rating with updatedAt time
      } else if (typeof rating === "object") {
        if (rating.updatedAt && isOld(rating.updatedAt)) {
          return null;
        }

        return rating.value;
      }
    }

    return null;
  }

  /**
   * @param {any} gameId
   * @returns {Promise<number>}
   */
  get(gameId) {
    log("get(gameId: %o)", gameId);

    return new Promise((resolve, reject) => {
      let rating;

      try {
        rating = this._getValueFromDataCollection(gameId);
        if (rating) return resolve(rating);
      } catch (_) {}

      rating = this._getValueFromStore(gameId);
      if (rating) {
        if (this.hasDataCollection()) {
          this._storeValueInDataCollection(gameId, rating);
        } else {
          this.localStorageStoreRating(this.gameIdToStoreKey(gameId), rating);
        }

        return resolve(rating);
      }

      this.fetchRatingFor(gameId)
        .then((rating) => {
          log("get(gameId: %o): fetchRatingFor -> rating: %o", gameId, rating);

          if (this.hasDataCollection()) {
            this._storeValueInDataCollection(gameId, rating.value);
          } else {
            this.localStorageStoreRating(
              this.gameIdToStoreKey(gameId),
              rating.value
            );
          }

          resolve(rating.value);
        })
        .catch((e) => {
          if (typeof e === "object" && e instanceof SyntaxError) {
            try {
              rating = this._getValueFromDataCollection(gameId, true);
              if (rating) return resolve(rating);
            } catch (_) {}
          } else {
            reject(e);
          }
        });
    });
  }
}

function isOld(updatedAt) {
  // If value was fetched less than a day ago, don't refetch
  const daysDiff = parseInt((new Date() - updatedAt) / (24 * 3600 * 1000));
  return daysDiff >= cacheUpdateThreshold;
}
