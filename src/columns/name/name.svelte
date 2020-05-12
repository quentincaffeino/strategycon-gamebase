<script>
  /**
   * @type {string}
   */
  export let name;
  /**
   * @type {URL|null}
   */
  export let link;
  /**
   * @type {string}
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
