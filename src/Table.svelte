<script>
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";

  import { gridOptions } from "./gridOptions";
  import { importExcel } from "./utils/importExcel";
  import { workbookParser } from "./utils/workbookParser";

  let gridElement = null;
  let grid = null;

  let searchBoxValue = "";
  $: {
    if (grid) {
      grid.gridOptions.api.setQuickFilter(searchBoxValue);
    }
  }

  onMount(() => {
    // create the grid passing in the div to use together with the columns & data we want to use
    grid = new Grid(gridElement, gridOptions);
    // console.log(grid);

    // grid.gridOptions.api.onSelectionChanged = () =>
    //   console.log(grid.gridOptions.api.getSelectedRows());

    importExcel("LOAD_XLSX_FROM")
      .then(workbookParser)
      .then(data => {
        if (gridOptions.api) {
          gridOptions.api.setRowData(data);
        }
      });
  });
</script>

<style>
  .data-grid-wrapper {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .data-grid-search {
    display: flex;
    padding: 0.25rem;
  }
  .data-grid-search input {
    flex-grow: 1;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .data-grid {
    flex-grow: 1;
  }

  :global(.ag-cell) {
    white-space: normal !important;
    line-height: 20px !important;
    padding: 10px 0px 10px 0px;
  }
</style>

<div class="data-grid-wrapper">
  <div class="data-grid-search">
    <input type="text" placeholder="Поиск..." bind:value={searchBoxValue} />
  </div>

  <div bind:this={gridElement} class="data-grid ag-theme-alpine" />
</div>
