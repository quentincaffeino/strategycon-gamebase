
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

export const field = {
  headerName: "Игра",
  filter: "agTextColumnFilter",
  valueGetter,
  cellRenderer: svelteCellRenderer.bind(undefined, NameTemplate)
}
