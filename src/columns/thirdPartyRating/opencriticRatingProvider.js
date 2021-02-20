import { AbstractRatingProvider } from "../../utils/AbstractRatingProvider";

class OpencriticRatingProvider extends AbstractRatingProvider {
  /**
   * @private
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    return "opencritic-rating-" + gameId;
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    const rating = responseBody.topCriticScore;

    if (isNaN(rating)) {
      throw "Rating is not a number";
    }

    return rating;
  }

  /**
   * @private
   * @param {string} gameId
   * @returns {string}
   */
  transformGameIdToResourceUrl(gameId) {
    return "https://api.opencritic.com/api/game/" + gameId;
  }
}

export const opencriticRatingProvider = new OpencriticRatingProvider();
