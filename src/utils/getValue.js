
/**
 * @param {any} params
 * @returns {any}
 */
export function getValue(params) {
  if (Object.prototype.hasOwnProperty.call(params, 'getValue') && typeof params.getValue === "function") {
    return params.getValue()
  } else {
    return params.value
  }
}

/**
 * @param {any} params
 * @returns {any}
 */
export function getFormattedValue(params) {
  if (Object.prototype.hasOwnProperty.call(params, 'valueFormatted') && params.valueFormatted) {
    return params.valueFormatted
  } else {
    return getValue(params)
  }
}
