
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
  return {
    steam_gameid: params.data.steam_gameid,
    opencritic_gameid: params.data.opencritic_gameid,
    metacritic_gameid: (params.data.metacritic_gameid || '').split(',').map(str => str.trim()).filter(str => !!str),
  }
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const target = params.eGridCell
  const value = getValue(params) || valueGetter(params)
  console.log(value)

  new ThirdPartyRatingTemplate({ target, props: { ...value, setValue: params.setValue.bind(params) } })
}


export const field = {
  headerName: "Рейтинг",
  getQuickFilterText,
  cellRenderer
}
