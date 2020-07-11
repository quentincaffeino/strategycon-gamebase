
import { getValue } from '../../utils/getValue'

import ThirdPartyRatingTemplate from './thirdPartyRating.svelte';


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
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  // Opencritic
  const parts = (params.data.opencritic_url || '').split('/')
  let opencritic_gameid;
  if (parts && parts.length) {
    opencritic_gameid = parts[parts.length - 2]
  }

  // Metacritic
  let metacritic_gameid = (params.data.metacritic_gameid || '').split(',').map(str => str.trim()).filter(str => !!str)
  if (!metacritic_gameid.length) {
    metacritic_gameid = undefined
  }

  return {
    steam_gameid: params.data.steam_gameid,
    opencritic_gameid,
    opencritic_url: params.data.opencritic_url,
    metacritic_gameid
  }
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const target = params.eGridCell
  const value = getValue(params) || valueGetter(params)

  new ThirdPartyRatingTemplate({ target, props: { props: value, setValue: params.setValue.bind(params) } })
}


export const field = {
  headerName: "Рейтинг",
  getQuickFilterText,
  cellRenderer
}
