<script>
  /**
   * @type {string|undefined}
   */
  export let name;
  /**
   * @type {string|undefined}
   */
  export let link;
  /**
   * @type {string|undefined}
   */
  export let image;
</script>

{#if link}
  <a href={link} rel="noopener noreferrer" target="_blank">
    {#if image}
      <img src={image} alt="{name} game image" />
    {/if}
    {name}
  </a>
{:else}
  {#if image}
    <img src={image} alt="{name} game image" />
  {/if}
  {name}
{/if}

<style>
  img {
    width: 100%;
  }
</style>
