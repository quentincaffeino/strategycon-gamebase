
import { getValue } from './getValue'


/**
 * @param {SvelteComponent} component 
 * @param {Object} params 
 */
export function svelteCellRenderer(component, params) {
  const target = params.eGridCell
  const value = getValue(params)

  new component({
    target,
    props: { ...value /*, params*/ }
  })
}
