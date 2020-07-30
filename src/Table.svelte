<script>
  import { Grid } from "ag-grid-community";
  import feather from "feather-icons";

  import { gridOptions } from "./gridOptions";
  import { importExcel } from "./utils/importExcel";
  import { localStorageTest } from "./utils/localStorageTest";
  import { workbookParser } from "./utils/workbookParser";

  const searchIcon = feather.icons["search"].toSvg({ color: "#b18904" });

  const warningKey = "games-table-dissmissed-warning";
  let isWarningShown = !(
    localStorageTest() && localStorage.getItem(warningKey)
  );

  let grid = null;

  let searchBoxValue = "";
  $: {
    if (grid) {
      grid.gridOptions.api.setQuickFilter(searchBoxValue);
    }
  }

  function handleCloseWarningButtonClick() {
    isWarningShown = false;
    localStorageTest() && localStorage.setItem(warningKey, true);
  }

  function initializeDatagrid(element) {
    // create the grid passing in the div to use together with the columns & data we want to use
    grid = new Grid(element, gridOptions);
    // console.log(grid);

    if (navigator.vendor && navigator.vendor.indexOf('Apple') !== -1) {
      document.body.classList.add('vendor-apple')
    }

    // grid.gridOptions.api.onSelectionChanged = () =>
    //   console.log(grid.gridOptions.api.getSelectedRows());

    importExcel("LOAD_XLSX_FROM")
      .then(workbookParser)
      .then(data => {
        if (gridOptions.api) {
          gridOptions.api.setRowData(data);
        }
      });
  }
</script>

<style>
  .data-grid-wrapper {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .data-grid-header {
    display: flex;
    flex-direction: row;
  }
  .data-grid-header img {
    width: 50px;
    float: left;
  }

  .data-grid-search {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
  }
  .data-grid-search :global(svg) {
    align-self: center;
    padding-left: 1rem;
  }
  .data-grid-search input {
    flex-grow: 1;
    padding: 1rem;
    border: none;
  }

  .data-grid-warning {
    display: flex;
    flex-direction: row;
    line-height: 50px;
  }
  .data-grid-warning-message {
    flex-grow: 1;
    padding: 0 1rem;
  }
  .data-grid-warning-button {
    width: 50px;
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
  <div class="data-grid-header">
    <a href="https://strategycon.ru/" rel="noopener noreferrer">
      <img
        src="https://strategycon.ru/wp-content/uploads/2019/09/cropped-ava-1-192x192.png"
        alt="Стратегикон" />
    </a>

    <label for="searchBox" class="data-grid-search">
      {@html searchIcon}
      <input
        type="text"
        id="searchBox"
        placeholder="Поиск..."
        bind:value={searchBoxValue} />
    </label>
  </div>

  {#if isWarningShown}
    <div class="data-grid-warning">
      <div class="data-grid-warning-message">
        Таблица находится в разработке
      </div>
      <input
        type="button"
        class="data-grid-warning-button"
        value="&times;"
        on:click={handleCloseWarningButtonClick} />
    </div>
  {/if}

  <div use:initializeDatagrid class="data-grid ag-theme-alpine" />
</div>
