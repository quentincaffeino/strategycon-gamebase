import { localStorageTest } from "./utils/localStorageTest";

const ITEMS_PER_PAGE = 100;

function pullSteamRatingsPage({ page }) {
  const url =
    "https://gametable.strategycon.ru/gamestable/items/steam_rating?limit=" +
    ITEMS_PER_PAGE +
    "&page=" +
    page;

  return fetch(url).then((res) => res.json());
}

async function pullSteamRatings() {
  try {
    let page = 1;
    let allSteamRatings = [];
    let steamRatings;
    do {
      steamRatings = (await pullSteamRatingsPage({ page })).data;
      allSteamRatings = allSteamRatings.concat(steamRatings);
      page++;
    } while (steamRatings.length >= ITEMS_PER_PAGE);

    if (allSteamRatings.length && localStorageTest()) {
      localStorage.setItem(
        "data-collection-steam_rating",
        JSON.stringify(allSteamRatings)
      );
    }
  } catch (e) {
    console.error(e);
  }
}

pullSteamRatings();
