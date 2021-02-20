import { getValue } from "./getValue";

/**
 * @param {ValueGetterParams} params
 * @param {string} defaultValue
 * @returns {any}
 */
export function defaultValueFormatter(params, defaultValue = "—") {
  const value = getValue(params);
  return value || defaultValue;
}
