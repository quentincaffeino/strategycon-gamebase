<script>
  export let isVisible = false;
  export let title = "";
  export let imageSrc = "";
</script>

<style>
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
  }
  .modal-wrapper.show {
    display: block;
  }

  .modal {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
  }

  .modal-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-title-wrapper span,
  .modal-title-wrapper button {
    padding: 0 1rem;
  }
  .modal-title-wrapper span {
    font-weight: 900;
  }
  .modal-title-wrapper button {
    padding: 0.25rem 1rem;
    background-color: transparent;
    border: none;
    font-size: xx-large;
    cursor: pointer;
  }

  .modal-body-wrapper {
    padding: 0 1rem;
    overflow: auto;
    max-height: 100%;
  }
  .modal-body-wrapper img {
    width: 100%;
    border-radius: 1rem;
  }
  .modal-body-wrapper .modal-body {
    padding: 1rem 0;
  }
</style>

<div class="modal-wrapper" class:show={isVisible}>
  <div class="modal">
    <div class="modal-title-wrapper">
      <span>{title}</span>
      <button class="modal-close" type="button">&times;</button>
    </div>
    <div class="modal-body-wrapper">
      {#if imageSrc}
        <img src={imageSrc} alt="{title} game cover." />
      {/if}

      <div class="modal-body" />
    </div>
  </div>
</div>
