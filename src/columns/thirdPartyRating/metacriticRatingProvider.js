
import { AbstractRatingProvider } from "../../utils/AbstractRatingProvider";


class MetacriticRatingProvider extends AbstractRatingProvider {

  /**
   * @private
   * @param {array} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    return "metacritic-rating-" + gameId[0].replace(' ', '_').toLowerCase() + '-' + gameId[1].toLowerCase()
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    const rating = responseBody.result.score;

    if (isNaN(rating)) {
      throw "Rating is not a number"
    }

    return rating
  }

  /**
   * @private
   * @param {array} gameId
   * @returns {string} 
   */
  transformGameIdToResourceUrl(gameId) {
    return `https://metacritic.udevteam.com/rest/games/${encodeURI(gameId[0])}?platform=` + encodeURI(gameId[1])
  }

}

export const metacriticRatingProvider = new MetacriticRatingProvider
