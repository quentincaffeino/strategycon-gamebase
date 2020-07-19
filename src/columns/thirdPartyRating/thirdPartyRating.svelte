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
  let steamRatingPromise = null;
  if (!props.steam_game_rating && props.steam_gameid) {
    steamRatingPromise = getRatingFor("steam", props.steam_gameid).catch(
      console.log
    );
    steamRatingPromise.then(rating => {
      props.steam_game_rating = rating;
      setValue(props);
    });
  }

  // Opencritic
  let opencriticRatingPromise = null;
  if (!props.opencritic_game_rating && props.opencritic_gameid) {
    opencriticRatingPromise = getRatingFor(
      "opencritic",
      props.opencritic_gameid
    ).catch(console.log);
    opencriticRatingPromise.then(rating => {
      props.opencritic_game_rating = rating;
      setValue(props);
    });
  }

  // Metacritic
  let metacriticRatingPromise = null;
  if (
    !props.metacritic_game_rating &&
    props.metacritic_gameid &&
    props.metacritic_gameid.length
  ) {
    metacriticRatingPromise = getRatingFor(
      "metacritic",
      props.metacritic_gameid
    ).catch(console.log);
    metacriticRatingPromise.then(rating => {
      props.metacritic_game_rating = rating;
      setValue(props);
    });
  }
</script>

<style>
  .line {
    white-space: nowrap;
  }
  span {
    font-weight: bold;
  }
</style>

{#if props.steam_game_rating}
  <a
    class="line"
    target="_blank"
    rel="noopener noreferrer"
    href="https://store.steampowered.com/app/{props.steam_game_rating.gameId}/">
    Steam:
    <span style="color:{props.steam_game_rating.color}">
      {props.steam_game_rating.text}
    </span>
  </a>
{/if}

{#if props.opencritic_game_rating}
  {#if props.opencritic_url}
    <a
      class="line"
      target="_blank"
      rel="noopener noreferrer"
      href={props.opencritic_url}>
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
    href="https://www.metacritic.com/game/{props.metacritic_game_rating.gameId[1]}/{props.metacritic_game_rating.gameId[0]
      .replace(' ', '-')
      .toLowerCase()}/">
    Metacritic:
    <span style="color:{props.metacritic_game_rating.color}">
      {props.metacritic_game_rating.text}
    </span>
  </a>
{/if}
