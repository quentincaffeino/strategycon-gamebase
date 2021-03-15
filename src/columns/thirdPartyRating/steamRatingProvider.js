import { AbstractRatingProvider } from "../../utils/AbstractRatingProvider";

class SteamRatingProvider extends AbstractRatingProvider {
  /**
   * @returns {bool}
   */
  hasDataCollection() {
    return true;
  }

  /**
   * @private
   * @param {any} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    return "steam-rating-" + gameId;
  }

  /**
   * @protected
   * @returns {string}
   */
  getDataCollectionKey() {
    return "steam_rating";
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    const rating =
      (responseBody.query_summary.total_positive /
        responseBody.query_summary.total_reviews) *
      100;

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
    return "https://strategycon.ru/gamebase/steam/index.php/" + gameId;
  }
}

export const steamRatingProvider = new SteamRatingProvider();
