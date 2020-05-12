
/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const name = params.value
  const link = params.data.developer_link
  if (link) {
    return '<a href="' + link + '" rel="noopener noreferrer" target="_blank">' + name + "</a>"
  } else {
    return name
  }
}

export const field = {
  field: "developer",
  headerName: "Разработчик",
  cellRenderer
}
