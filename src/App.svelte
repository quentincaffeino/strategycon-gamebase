<script>
  import Table from "./Table.svelte";
</script>

<style>
  .app-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .table {
    display: flex;
    flex-grow: 1;
  }
</style>

<div class="app-wrapper">
  <!-- <div class="title">
    <a href="https://strategycon.ru">
      <img
        src="https://strategycon.ru/wp-content/uploads/2019/09/logo_site_amp_6.png"
        alt="Strategycon logo" />
    </a>

    <p>Таблица находится в разработке</p>
  </div>

  <div class="table"> -->
    <Table />
  <!-- </div> -->
</div>
