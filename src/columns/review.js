
import { getValue } from '../utils/getValue'


function getRatingColor(rating) {
  if (rating < 5) {
    return "red"
  } else if (rating < 8) {
    return "orange"
  } else {
    return "green"
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {any}
 */
function valueGetter(params) {
  const value = params.data.review
  if (value) {
    return value + " из 10"
  }
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const rating = params.data.review

  if (rating) {
    const text = getValue(params)
    const color = getRatingColor(rating)

    const link = params.data.review_link
    if (link) {
      return (
        '<a href="' +
        link +
        '" target="_blank" rel="noopener noreferrer" style="color:' +
        color +
        '">' +
        text +
        "</a>"
      )
    } else {
      return '<span style="color:' + color + '">' + text + "</span>"
    }
  } else {
    return '<a href="https://strategycon.ru/no-review/" rel="noopener noreferrer" target="_blank">Нет оценки</a>'
  }
}

export const field = {
  field: "review",
  headerName: "Обзор",
  valueGetter,
  cellRenderer
}
