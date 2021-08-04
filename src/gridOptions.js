import * as columns from "./columns";

const defaultColDef = {
  // autoHeight: true,
  suppressMenu: true,
  resizable: true,
  minWidth: 100,
  flex: 1,
  filter: true,
  floatingFilter: true,
  floatingFilterComponentParams: {
    suppressFilterButton: true,
  },
};

export const gridOptions = {
  rowHeight: 120,

  columnDefs: Object.values(columns).map((column) => column.field),
  defaultColDef,

  onRowSelected: (event) => {
    if (event.node.isSelected()) {
      console.log(event);
    }
  },

  components: {},

  rowData: [],
};
