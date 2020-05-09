
import { writable } from 'svelte/store'


export function selectedRow(gridApi) {
  const store = writable(null)
  const { subscribe, set } = store

  return {
    subscribe,

    setRow(rowData) {
      set(rowData)
    }
  }
}
