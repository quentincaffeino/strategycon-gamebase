
import { steamRatingProvider } from "./steamRatingProvider"
import { opencriticRatingProvider } from "./opencriticRatingProvider"


const noDataText = '—'


/**
 * @param {number} rating 
 * @returns {string}
 */
function getRatingColor(rating) {
  if (rating < 40.0) {
    return "red"
  } else if (rating < 61.0) {
    return "orange"
  } else {
    return "green"
  }
}


/**
 * @param {string} gameId 
 * @param {number} rating 
 * @returns {Object}
 */
function transformSteamRating(gameId, rating) {
  const text = Math.round(rating) + '%'
  const color = getRatingColor(rating)

  return {
    gameId,
    text,
    color,
  }
}

/**
 * @param {string} gameId
 * @param {number} rating
 * @returns {Object}
 */
function transformOpencriticRating(gameId, rating) {
  const text = Math.round(rating)
  const color = getRatingColor(rating)

  return {
    gameId,
    text,
    color,
  }
}


/**
 * @param {string} gameId
 * @returns {Promise<Object>}
 */
function getSteamRatingFor(gameId) {
  return steamRatingProvider.get(gameId)
    .then(transformSteamRating.bind(undefined, gameId))
}

/**
 * @param {string} gameId
 * @returns {Promise<Object>}
 */
function getOpencriticRatingFor(gameId) {
  return opencriticRatingProvider.get(gameId)
    .then(transformOpencriticRating.bind(undefined, gameId))
}

/**
 * @param {string} provider 
 * @param {string} gameId
 * @returns {Promise<Object>}
 */
export function getRatingFor(provider, gameId) {
  switch (provider) {
    case 'steam':
      return getSteamRatingFor(gameId)

    case 'opencritic':
      return getOpencriticRatingFor(gameId)
  }
}
