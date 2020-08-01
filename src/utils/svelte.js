
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


export function initializeComponent(component, props) {
  const target = document.createElement('div')
  new component({ target, props })
  return target
}
