import { localStorageTest } from "./utils/localStorageTest";

fetch("https://gametable.strategycon.ru/gamestable/items/steam_rating")
  .then((res) => res.json())
  .then(({ data }) => {
    if (data && localStorageTest()) {
      localStorage.setItem(
        "data-collection-steam_rating",
        JSON.stringify(data)
      );
    }
  });
