
import { getValue } from './getValue'


/**
 * @param {ValueGetterParams} params
 * @returns {any}
 */
export function defaultValueFormatter(params) {
  const value = getValue(params)
  return value || '—'
}
