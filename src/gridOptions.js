
import columnDefs from "./columns";
// import { onRowSelectionChanged } from './utils/onRowSelectionChanged'
// import { selectedRow } from './utils/selectedRow'


const defaultColDef = {
  // autoHeight: true,
  suppressMenu: true,
  resizable: true,
  minWidth: 100,
  flex: 1,
  filter: true,
  floatingFilter: true,
  floatingFilterComponentParams: {
    suppressFilterButton: true
  }
}

export const gridOptions = {
  rowHeight: 120,

  columnDefs,
  defaultColDef,

  // rowSelection: "single",
  onRowSelected: event => {
    if (event.node.isSelected()) {
      console.log(event)
    }
  },
  // onSelectionChanged: () => gridOptions.api.getSelectedRows(),
  
  // components: {
  //   customNumberFloatingFilter: getNumberFloatingFilterComponent()
  // },

  rowData: []
}

// export const selectedRowStore = selectedRow(gridOptions.api)


function getNumberFloatingFilterComponent() {
  function NumberFloatingFilter() {
  }

  NumberFloatingFilter.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '&gt; <input style="width:20px" type="text"/>';
    this.currentValue = null;
    this.eFilterInput = this.eGui.querySelector('input');
    this.eFilterInput.style.color = params.color;
    var that = this;

    function onInputBoxChanged() {
      if (that.eFilterInput.value === '') {
        // Remove the filter
        params.parentFilterInstance(function (instance) {
          instance.onFloatingFilterChanged(null, null);
        });
        return;
      }

      that.currentValue = Number(that.eFilterInput.value);
      params.parentFilterInstance(function (instance) {
        console.log(instance)
      });
        // instance.onFloatingFilterChanged('greaterThan', that.currentValue);
    }

    this.eFilterInput.addEventListener('input', onInputBoxChanged);
  };

  NumberFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
    // When the filter is empty we will receive a null message her
    if (!parentModel) {
      this.eFilterInput.value = '';
      this.currentValue = null;
    } else {
      this.eFilterInput.value = parentModel.filter + '';
      this.currentValue = parentModel.filter;
    }
  };

  NumberFloatingFilter.prototype.getGui = function () {
    return this.eGui;
  };

  return NumberFloatingFilter;
}
