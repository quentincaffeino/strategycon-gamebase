import { initializeComponent } from "../../utils/svelte";

import NameFloatingFilterComponent from "./nameFilter.svelte";

export function NameFloatingFilter() {}

NameFloatingFilter.prototype.init = function (params) {
  this.gui = initializeComponent(NameFloatingFilterComponent, {
    target: this,
    onInput: (value) => {
      if (value === "") {
        // Remove the filter
        params.parentFilterInstance(function (instance) {
          instance.onFloatingFilterChanged(null, null);
        });
        return;
      }

      params.parentFilterInstance(function (instance) {
        instance.onFloatingFilterChanged("equals", value);
      });
    },
  });
};

NameFloatingFilter.prototype.getGui = function () {
  return this.gui;
};

NameFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
  // When the filter is empty we will receive a null message her
  if (!parentModel) {
    this.value = "";
  } else {
    this.value = parentModel + "";
  }
  this.currentValue = parentModel;
};
