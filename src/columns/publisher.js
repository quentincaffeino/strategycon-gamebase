
/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const name = params.value
  const link = params.data.publisher_link
  if (link) {
    return '<a href="' + link + '" target="_blank">' + name + "</a>"
  } else {
    return name
  }
}

export const field = {
  field: "publisher",
  headerName: "Издатель",
  cellRenderer
}
