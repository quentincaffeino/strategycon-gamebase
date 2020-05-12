
import { svelteCellRenderer } from '../../utils/svelteCellRenderer'

import NameTemplate from './name.svelte';


/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  return params.data.name
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  return {
    name: params.data.name,
    link: params.data.link ? new URL(params.data.link) : null,
    image: params.data.image,
  }
}

export const field = {
  headerName: "Игра",
  // filter: "agTextColumnFilter",
  getQuickFilterText,
  valueGetter,
  cellRenderer: svelteCellRenderer.bind(undefined, NameTemplate)
}
