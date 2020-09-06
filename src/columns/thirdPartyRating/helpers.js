import { steamRatingProvider } from "./steamRatingProvider"
import { opencriticRatingProvider } from "./opencriticRatingProvider"
import { metacriticRatingProvider } from "./metacriticRatingProvider"


/**
 * @param {number} rating 
 * @returns {string}
 */
function getSteamRatingColor(rating) {
  if (rating < 40.0) {
    return "red"
  } else if (rating < 70.0) {
    return "orange"
  } else {
    return "green"
  }
}

/**
 * @param {number} rating 
 * @returns {string}
 */
function getOpencriticRatingColor(rating) {
  if (rating < 50.0) {
    return "red"
  } else if (rating < 75.0) {
    return "orange"
  } else {
    return "green"
  }
}

/**
 * @param {number} rating 
 * @returns {string}
 */
function getMetacriticRatingColor(rating) {
  if (rating < 40.0) {
    return "red"
  } else if (rating < 61.0) {
    return "orange"
  } else {
    return "green"
  }
}


/**
 * @param {any} gameId 
 * @param {number} rating 
 * @returns {Object}
 */
function transformSteamRating(gameId, rating) {
  const text = Math.round(rating) + '%'
  const color = getSteamRatingColor(rating)

  return {
    gameId,
    value: rating,
    text,
    color,
  }
}

/**
 * @param {any} gameId
 * @param {number} rating
 * @returns {Object}
 */
function transformOpencriticRating(gameId, rating) {
  const color = getOpencriticRatingColor(rating)

  return {
    gameId,
    value: rating,
    text: '' + Math.round(rating),
    color,
  }
}

/**
 * @param {any} gameId
 * @param {number} rating
 * @returns {Object}
 */
function transformMetacriticRating(gameId, rating) {
  const color = getMetacriticRatingColor(rating)

  return {
    gameId,
    value: rating,
    text: '' + rating,
    color,
  }
}


/**
 * @param {any} gameId
 * @returns {Promise<Object>}
 */
function getSteamRatingFor(gameId) {
  return steamRatingProvider.get(gameId)
    .then(transformSteamRating.bind(undefined, gameId))
}

/**
 * @param {any} gameId
 * @returns {Promise<Object>}
 */
function getOpencriticRatingFor(gameId) {
  return opencriticRatingProvider.get(gameId)
    .then(transformOpencriticRating.bind(undefined, gameId))
}

/**
 * @param {any} gameId
 * @returns {Promise<Object>}
 */
function getMetacriticRatingFor(gameId) {
  return metacriticRatingProvider.get(gameId)
    .then(transformMetacriticRating.bind(undefined, gameId))
}

/**
 * @param {string} provider 
 * @param {any} gameId
 * @returns {Promise<Object>}
 */
export function getRatingFor(provider, gameId) {
  switch (provider) {
    case 'steam':
      return getSteamRatingFor(gameId)

    case 'opencritic':
      return getOpencriticRatingFor(gameId)

    case 'metacritic':
      return getMetacriticRatingFor(gameId)
  }
}
