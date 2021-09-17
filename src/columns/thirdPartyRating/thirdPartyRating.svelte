<script>
  import { getRatingFor } from "./helpers";

  // Utils
  /**
   * @type {Function}
   */
  export let setValue = () => {
    throw new Error("thirdPartyRating.svelte: setValue isn't set.");
  };

  // In properties
  export let props = {};

  // Steam
  if (!props.steam_game_rating && props.steam_gameid) {
    getRatingFor("steam", props.steam_gameid)
      .catch(console.error)
      .then((rating) => {
        props.steam_game_rating = rating;
        setValue(props);
      });
  }

  // Opencritic
  if (!props.opencritic_game_rating && props.opencritic_gameid) {
    getRatingFor("opencritic", props.opencritic_gameid)
      .catch(console.error)
      .then((rating) => {
        props.opencritic_game_rating = rating;
        setValue(props);
      });
  }

  // Metacritic
  if (
    !props.metacritic_game_rating &&
    props.metacritic_gameid &&
  ) {
    getRatingFor("metacritic", props.metacritic_gameid)
      .catch(console.error)
      .then((rating) => {
        props.metacritic_game_rating = rating;
        setValue(props);
      });
  }
</script>

{#if props.steam_gameid}
  <a
    class="line"
    target="_blank"
    rel="noopener noreferrer"
    href="https://store.steampowered.com/app/{props.steam_gameid}/"
  >
    Steam:
    {#if props.steam_game_rating}
      <span style="color:{props.steam_game_rating.color}">
        {props.steam_game_rating.text}
      </span>
    {:else}
      <span> -</span>
    {/if}
  </a>
{/if}

{#if props.opencritic_game_rating && props.opencritic_game_rating.value > 0}
  {#if props.opencritic_url}
    <a
      class="line"
      target="_blank"
      rel="noopener noreferrer"
      href={props.opencritic_url}
    >
      Opencritic:
      <span style="color:{props.opencritic_game_rating.color}">
        {props.opencritic_game_rating.text}
      </span>
    </a>
  {:else}
    <div class="line">
      Opencritic:
      <span style="color:{props.opencritic_game_rating.color}">
        {props.opencritic_game_rating.text}
      </span>
    </div>
  {/if}
{/if}

{#if props.metacritic_game_rating && props.metacritic_game_rating.value > 0}
  <a
    class="line"
    target="_blank"
    rel="noopener noreferrer"
    href="https://www.metacritic.com/game/{props.metacritic_game_rating
      .gameId.platform}/{props.metacritic_game_rating.gameId.id
      .replaceAll(' ', '-')
      .toLowerCase()}/"
  >
    Metacritic:
    <span style="color:{props.metacritic_game_rating.color}">
      {props.metacritic_game_rating.text}
    </span>
  </a>
{/if}

<style>
  .line {
    white-space: nowrap;
  }
  span {
    font-weight: bold;
  }
</style>
