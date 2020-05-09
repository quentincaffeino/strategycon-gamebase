<script>
  export let name;
  export let link;
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
  <a href={link} target="_blank">{name}</a>
{:else}{name}{/if}
