
import { defaultValueFormatter as valueFormatter } from '../utils/defaultValueFormatter'
import { getFormattedValue } from '../utils/getValue'


/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const name = getFormattedValue(params)
  const link = params.data.publisher_link
  if (link) {
    return '<a href="' + link + '" rel="noopener noreferrer" target="_blank">' + name + "</a>"
  } else {
    return name
  }
}

export const field = {
  field: "publisher",
  headerName: "Издатель",
  valueFormatter,
  cellRenderer
}
