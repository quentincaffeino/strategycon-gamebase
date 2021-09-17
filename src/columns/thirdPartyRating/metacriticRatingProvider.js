import { AbstractRatingProvider } from "../../utils/AbstractRatingProvider";

class MetacriticRatingProvider extends AbstractRatingProvider {
  /**
   * @private
   * @param {array} gameId
   * @returns {string}
   */
  gameIdToStoreKey(gameId) {
    return (
      "metacritic-rating-" +
      gameId.id.replace(" ", "_").toLowerCase() +
      "-" +
      gameId.platform.toLowerCase()
    );
  }

  /**
   * @private
   * @param {object} responseBody
   * @returns {number}
   */
  getRatingFromResponseBody(responseBody) {
    const rating = responseBody.result.score;

    if (isNaN(rating)) {
      throw "Rating is not a number";
    }

    return rating;
  }

  /**
   * @private
   * @param {array} gameId
   * @returns {string}
   */
  transformGameIdToResourceUrl(gameId) {
    return (
      `https://metacritic.udevteam.com/rest/games/${encodeURI(
        gameId.id
      )}?platform=` + encodeURI(gameId.platform)
    );
  }
}

export const metacriticRatingProvider = new MetacriticRatingProvider();
