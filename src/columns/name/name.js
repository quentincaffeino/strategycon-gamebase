
import { svelteCellRenderer } from '../../utils/svelteCellRenderer'

import NameTemplate from './name.svelte';


/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  return {
    name: params.data.name,
    link: params.data.link,
    image: params.data.image,
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  return params.data.name
}

export const field = {
  headerName: "Игра",
  // filter: "agTextColumnFilter",
  getQuickFilterText,
  valueGetter,
  cellRenderer: svelteCellRenderer.bind(undefined, NameTemplate)
}
