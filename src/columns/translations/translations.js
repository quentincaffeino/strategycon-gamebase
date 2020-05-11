
import { svelteCellRenderer } from '../../utils/svelteCellRenderer'

import TranslationsTemplate from './translations.svelte';


/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  return params.data.translations;
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  const translationsStr = params.data.translations || ''
  const translations = translationsStr
    .split(',')
    .map(str => str.trim().toUpperCase())
    .filter(el => !!el)

  return {
    translations
  }
}

export const field = {
  headerName: "Языки",
  // filter: PersonFilter,
  // floatingFilterComponent: 'customNumberFloatingFilter',
  getQuickFilterText,
  valueGetter,
  cellRenderer: svelteCellRenderer.bind(undefined, TranslationsTemplate)
}


function PersonFilter() {
}

PersonFilter.prototype.init = function (params) {
  this.valueGetter = params.valueGetter;
  this.filterText = null;
  this.setupGui(params);
};

// not called by ag-Grid, just for us to help setup
PersonFilter.prototype.setupGui = function (params) {
  this.gui = document.createElement('div');
  this.gui.innerHTML =
    '<div style="padding: 4px; width: 200px;">' +
    '<div style="font-weight: bold;">Custom Athlete Filter</div>' +
    '<div><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="Full name search..."/></div>' +
    '<div style="margin-top: 20px;">This filter does partial word search on multiple words, eg "mich phel" still brings back Michael Phelps.</div>' +
    '<div style="margin-top: 20px;">Just to iterate anything can go in here, here is an image!!</div>' +
    '<div><img src="https://www.ag-grid.com/images/ag-Grid2-200.png" style="width: 150px; text-align: center; padding: 10px; margin: 10px; border: 1px solid lightgrey;"/></div>' +
    '</div>';

  this.eFilterText = this.gui.querySelector('#filterText');
  this.eFilterText.addEventListener("changed", listener);
  this.eFilterText.addEventListener("paste", listener);
  this.eFilterText.addEventListener("input", listener);
  // IE doesn't fire changed for special keys (eg delete, backspace), so need to
  // listen for this further ones
  this.eFilterText.addEventListener("keydown", listener);
  this.eFilterText.addEventListener("keyup", listener);

  var that = this;

  function listener(event) {
    that.filterText = event.target.value;
    params.filterChangedCallback();
  }
};

PersonFilter.prototype.getGui = function () {
  return this.gui;
};

PersonFilter.prototype.doesFilterPass = function (params) {
  // make sure each word passes separately, ie search for firstname, lastname
  var passed = true;
  var valueGetter = this.valueGetter;
  this.filterText.toLowerCase().split(" ").forEach(function (filterWord) {
    var value = valueGetter(params);
    if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
      passed = false;
    }
  });

  return passed;
};

PersonFilter.prototype.getModelAsString = function (model) {
  return JSON.stringify(model)
}

PersonFilter.prototype.isFilterActive = function () {
  return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
};

PersonFilter.prototype.getModel = function () {
  var model = { value: this.filterText.value };
  return model;
};

PersonFilter.prototype.setModel = function (model) {
  this.eFilterText.value = model.value;
};
