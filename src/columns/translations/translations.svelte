<script>
  export let translations = [];

  const showNTranslations = 1;
  const visibleTranslations = translations.slice(0, showNTranslations);
  const more = translations.length - visibleTranslations.length;

  let showAll = more <= 0;

  function handleToggleExpandClick() {
    showAll = !showAll;
  }
</script>

{#if translations.length > 0}
  {#if showAll}
    {#each translations as translation}
      <div class="badge">{translation}</div>
      &MediumSpace;
    {/each}

    {#if more > 0}
      <input
        type="button"
        class="badge button button-less"
        value="-"
        on:click|stopPropagation={handleToggleExpandClick}
      />
    {/if}
  {:else}
    {#each visibleTranslations as translation}
      <div class="badge">{translation}</div>
      &MediumSpace;
    {/each}

    <input
      type="button"
      class="badge button button-more"
      value="+{more}"
      on:click|stopPropagation={handleToggleExpandClick}
    />
  {/if}
{:else}&mdash;{/if}

<style>
  .badge {
    display: inline-block;
    margin-bottom: 2px;
    padding: 0 2px 0 3px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 3px;
    font-weight: bold;
    font-size: smaller;
    letter-spacing: 1px;
  }

  .button {
    cursor: pointer;
    border: none;
    line-height: 20px;
  }

  .button-less {
    padding: 0 6px 0 7px;
  }
</style>
