
import { AbstractRatingProvider } from "../../utils/AbstractRatingProvider";


class SteamRatingProvider extends AbstractRatingProvider {

  /**
   * @private
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    return "steam-rating-" + gameId
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    const rating = (responseBody.query_summary.total_positive /
      responseBody.query_summary.total_reviews) *
      100;

    if (isNaN(rating)) {
      throw "Rating is not a number"
    }

    return rating
  }

  /**
   * @private
   * @param {string} gameId
   * @returns {string} 
   */
  transformGameIdToResourceUrl(gameId) {
    return "https://cors-anywhere.herokuapp.com/https://store.steampowered.com/appreviews/" +
      gameId +
      "?json=1&language=all"
  }

}

export const steamRatingProvider = new SteamRatingProvider
