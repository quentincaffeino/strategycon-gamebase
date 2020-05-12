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

<style>
  img {
    width: 100%;
  }
</style>

{#if image}
  <img src={image} alt="{name} game image" />
{/if}

{#if link}
  <a href={link} rel="noopener noreferrer" target="_blank">{name}</a>
{:else}{name}{/if}
