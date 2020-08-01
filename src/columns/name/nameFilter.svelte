<script>
  export let filter;
  export let onInput = () => {};
</script>

<input
  on:input={(event) => onInput(event.target.value)}
  class="ag-input-field-input ag-text-field-input"
  type="text" />
