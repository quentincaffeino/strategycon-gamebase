
import feather from 'feather-icons'

import { getValue } from '../utils/getValue'
import { applyRating } from '../utils/applyRating'
import * as steamRatingProvider from "../utils/steamRatingProvider"


const noDataText = 'Нет данных'

function getRatingColor(rating) {
  if (rating < 40.0) {
    return "red"
  } else if (rating < 61.0) {
    return "orange"
  } else {
    return "green"
  }
}

function transformRating(rating) {
  const text = Math.round(rating) + '%'
  const color = getRatingColor(rating)

  return {
    text,
    color,
    html: '<div class="steam-rating">' + text + ' ' + feather.icons['thumbs-up'].toSvg({ color: 'green' }) + '</div>',
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  if (params.value) {
    return params.value.text;
  }
}

function cellRenderer(params) {
  const el = params.eGridCell
  const rating = getValue(params)
  const gameId = params.data.steam_gameid

  if (gameId) {
    if (rating) {
      applyRating(el, rating)
    } else {
      steamRatingProvider.get(gameId)
        .then(rating => {
          rating = transformRating(rating)
          params.setValue(rating)
          applyRating(el, rating)
        })
        .catch(() => {
          el.innerText = noDataText
        })
    }
  } else {
    el.innerText = noDataText
  }
}

export const field = {
  field: "steam_rating",
  headerName: "Steam",
  getQuickFilterText,
  cellRenderer
}
