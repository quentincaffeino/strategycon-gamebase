<script>
  import { getContext } from "svelte";
  import { Grid } from "ag-grid-community";

  import { gridOptions } from "./gridOptions";
  import { importExcel } from "./utils/importExcel";
  import { workbookParser } from "./utils/workbookParser";

  const appContext = getContext("app");

  function initializeDatagrid(element) {
    // create the grid passing in the div to use together with the columns & data we want to use
    const grid = new Grid(element, gridOptions);
    appContext.setGrid(grid);

    if (navigator.vendor && navigator.vendor.indexOf("Apple") !== -1) {
      document.body.classList.add("vendor-apple");
    }

    // grid.gridOptions.api.onSelectionChanged = () =>
    //   console.log(grid.gridOptions.api.getSelectedRows());

    importExcel("LOAD_XLSX_FROM")
      .then(workbookParser)
      .then((data) => {
        if (gridOptions.api) {
          gridOptions.api.setRowData(data);
        }
      });
  }
</script>

<div use:initializeDatagrid class="data-grid ag-theme-alpine" />

<style>
  .data-grid {
    flex-grow: 1;
  }
</style>
