<script>
  import { getRatingFor } from "./helpers";

  // Utils
  /**
   * @type {Function|null}
   */
  export let setValue = null;

  function createValue() {
    return {
      steam_gameid,
      steam_game_rating,
      opencritic_gameid,
      opencritic_game_rating
    };
  }

  // Steam
  /**
   * @type {string|null}
   */
  export let steam_gameid = null;
  /**
   * @type {object|null}
   */
  export let steam_game_rating = null;

  let steamRatingPromise = null;
  if (!steam_game_rating && steam_gameid) {
    steamRatingPromise = getRatingFor("steam", steam_gameid).catch(console.log);
    steamRatingPromise.then(rating => {
      steam_game_rating = rating;
      setValue(createValue());
    });
  }

  // Opencritic
  /**
   * @type {string|null}
   */
  export let opencritic_gameid = null;
  /**
   * @type {object|null}
   */
  export let opencritic_game_rating = null;

  let opencriticRatingPromise = null;
  if (!opencritic_game_rating && opencritic_gameid) {
    opencriticRatingPromise = getRatingFor(
      "opencritic",
      opencritic_gameid
    ).catch(console.log);
    opencriticRatingPromise.then(rating => {
      opencritic_game_rating = rating;
      setValue(createValue());
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

{#if steam_game_rating}
  <a
    class="line"
    target="_blank"
    rel="noopener noreferrer"
    href="https://store.steampowered.com/app/{steam_game_rating.gameId}/">
    Steam:
    <span style="color:{steam_game_rating.color}">
      {steam_game_rating.text}
    </span>
  </a>
{/if}

{#if opencritic_game_rating}
  <div class="line">
    Opencritic:
    <span style="color:{opencritic_game_rating.color}">
      {opencritic_game_rating.text}
    </span>
  </div>
{/if}
