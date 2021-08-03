<script>
  import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";

  let selected;
</script>

<div class="">
  <DatePicker range={true} on:range-selected={(e) => (selected = e.detail)} />
  {JSON.stringify(selected)}
</div>

<style>
  div {
    background-color: white;
    border: 1px solid black;
  }
</style>
