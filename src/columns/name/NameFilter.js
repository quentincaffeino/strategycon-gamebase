
import { initializeComponent } from "../../utils/svelte"

import NameFilterComponent from './nameFilter.svelte'


export function NameFilter() { }

NameFilter.prototype.init = function (params) {
  this.params = params
  this.gui = document.createElement('i') // ag-grid requires getGui method to return element even thou it wouldn't use it
}

NameFilter.prototype.getGui = function () {
  return this.gui
}

NameFilter.prototype.doesFilterPass = function (params) {
  var valueGetter = this.params.valueGetter;
  var value = valueGetter(params);
  var filterValue = this.value.toLowerCase();

  if (this.isFilterActive()) {
    if (!value || !value.name) return false;
    return value.name.toLowerCase().indexOf(filterValue) !== -1;
  }
};

NameFilter.prototype.isFilterActive = function () {
  return this.value !== null &&
    this.value !== undefined &&
    this.value !== ''
};

NameFilter.prototype.onFloatingFilterChanged = function (type, value) {
  console.log(type, value)
  this.value = value
  this.params.filterChangedCallback();
}

NameFilter.prototype.getModel = function () {
  return this.isFilterActive() ? this.value : null;
}
