
export function getValue(params) {
  if (Object.prototype.hasOwnProperty.call(params, 'getValue') && typeof params.getValue === "function") {
    return params.getValue()
  } else {
    return params.value
  }
}
