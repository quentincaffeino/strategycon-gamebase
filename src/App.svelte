<script>
  import feather from "feather-icons";
  import { setContext } from "svelte";

  import { context, AppContext } from "./App";
  import { localStorageTest } from "./utils/localStorageTest";

  import Table from "./Table.svelte";

  const appContext = new AppContext();
  setContext(context, appContext);

  const searchIcon = feather.icons["search"].toSvg({ color: "#b18904" });

  const warningKey = "games-table-dissmissed-warning";
  let isWarningShown = !(
    localStorageTest() && localStorage.getItem(warningKey)
  );

  let searchBoxValue = "";
  $: {
    if (appContext.grid) {
      appContext.grid.gridOptions.api.setQuickFilter(searchBoxValue);
    }
  }

  function handleCloseWarningButtonClick() {
    isWarningShown = false;
    localStorageTest() && localStorage.setItem(warningKey, true);
  }
</script>

<style>
  .app-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

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
</style>

<div class="app-wrapper">
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

    <Table />

  </div>
</div>
