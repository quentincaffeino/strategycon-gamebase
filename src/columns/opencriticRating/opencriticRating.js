
import { getValue } from '../../utils/getValue'
import { applyRating } from '../../utils/applyRating'
import { opencriticRatingProvider } from "./opencriticRatingProvider"


const noDataText = '—'

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
  const text = Math.round(rating)
  const color = getRatingColor(rating)

  return {
    text,
    color,
    html: '<b>' + text + '</b>',
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

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const el = params.eGridCell
  const rating = getValue(params)
  const gameId = params.data.opencritic_gameid

  if (gameId) {
    if (rating) {
      applyRating(el, rating)
    } else {
      opencriticRatingProvider.get(gameId)
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
  headerName: "Opencritic",
  getQuickFilterText,
  cellRenderer
}
