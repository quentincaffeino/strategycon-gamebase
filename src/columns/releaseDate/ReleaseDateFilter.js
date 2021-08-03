import { initializeComponent } from "../../utils/svelte";
import ReleaseDateFilterComponent from "./ReleaseDateFilter.svelte";

export default class ReleaseDateFilter {
  init(params) {
    this._setupGui(params);

    // const onInputBoxChanged = () => {
    //   if (this.eFilterInput.value === "") {
    //     // clear the filter
    //     params.parentFilterInstance((instance) => {
    //       instance.onFloatingFilterChanged(null, null);
    //     });
    //     return;
    //   }

    //   this.currentValue = Number(this.eFilterInput.value);
    //   params.parentFilterInstance((instance) => {
    //     instance.onFloatingFilterChanged("greaterThan", this.currentValue);
    //   });
    // };

    // this.eFilterInput.addEventListener("input", onInputBoxChanged);
  }

  _setupGui(params) {
    this._gui = initializeComponent(ReleaseDateFilterComponent, params);
    // this._gui = document.createElement("div");
    // this._gui.innerHTML =
    //   '&gt; <input style="width: 30px" type="number" min="0" />';
    // this.currentValue = null;
    // this.eFilterInput = this._gui.querySelector("input");
    // this.eFilterInput.style.color = params.color;
  }

  getGui() {
    return this._gui;
  }

  onParentModelChanged(parentModel) {
    // When the filter is empty we will receive a null message her
    if (!parentModel) {
      this.eFilterInput.value = "";
      this.currentValue = null;
    } else {
      this.eFilterInput.value = parentModel.filter + "";
      this.currentValue = parentModel.filter;
    }
  }
}

ReleaseDateFilter.COMPONENT_NAME = "releaseDateFilter";
