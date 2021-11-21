<script context="module">
  class AppContext {
    setGrid(grid) {
      this.grid = grid;
    }
  }
</script>

<script>
  import { setContext } from "svelte";
  import { SearchIcon } from "svelte-feather-icons";
  import githubIcon from "simple-icons/icons/github";

  import { localStorageTest } from "./utils/localStorageTest";

  import Table from "./Table.svelte";

  const appContext = new AppContext();
  setContext("app", appContext);

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

  const { isDatePickerShown } = appContext;
</script>

<div class="app-wrapper">
  <div class="data-grid-wrapper">
    <div class="data-grid-header">
      <a href="https://strategycon.ru/" rel="noopener noreferrer">
        <img
          src="https://strategycon.ru/wp-content/uploads/2019/09/ava.png"
          alt="Стратегикон"
        />
      </a>

      <label for="searchBox" class="data-grid-search">
        <SearchIcon size="1.5x" />

        <input
          type="text"
          id="searchBox"
          placeholder="Поиск..."
          bind:value={searchBoxValue}
        />
      </label>

      <a
        href="https://github.com/quentincaffeino/strategycon-gamebase"
        target="_blank"
        rel="noopener noreferrer"
        class="github"
      >
        {@html githubIcon.svg}
      </a>
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
          on:click={handleCloseWarningButtonClick}
        />
      </div>
    {/if}

    <Table />
  </div>

  //Footer start
  <div class="footer">
    <a href="https://strategycon.ru/table-manual">
      Как пользоваться таблицей
    </a>
    <a href="https://forms.yandex.ru/cloud/61993e15621050a32d5de178/">
      Предложить добавить игру
    </a>
    <a href="https://github.com/quentincaffeino/strategycon-gamebase/issues">
      Помочь в разработке
    </a>
  </div>
  //Footer end
</div>

<style>
  //Footer styles start
  .footer {
    padding: 5px 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    background: #f8f8f8;
    display: flex;
    justify-content: space-around;
    font-size: 90%;
    text-align: center;
  }
  .footer a {
    text-decoration: none;
    color: #b18904;
  }
  .footer a:hover {
    text-decoration: underline;
    color: #b18904;
  }
  //Footer styles end

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
  .data-grid-header img,
  .data-grid-header .github {
    width: 50px;
    height: 50px;
    float: left;
  }

  :global(.data-grid-header .github svg) {
    transform: scale(0.4);
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
