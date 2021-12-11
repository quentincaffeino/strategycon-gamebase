import { getValue } from "../../utils/getValue";

import ThirdPartyRatingTemplate from "./thirdPartyRating.svelte";

function getRatingColor(rating) {
  if (rating < 5) {
    return "red";
  } else if (rating < 8) {
    return "orange";
  } else {
    return "green";
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  if (params.value) {
    return params.value.text;
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  // Opencritic
  const parts = (params.data.opencritic_url || "").split("/");
  let opencritic_gameid;
  if (parts && parts.length) {
    opencritic_gameid = parts[parts.length - 2];
  }

  // Metacritic
  let metacritic_gameid = {
    id: (params.data.metacritic_gameid || "").trim(),
    platform: (params.data.metacritic_platform || "pc").trim(),
  };

  return {
    steam_gameid: params.data.steam_gameid,
    opencritic_gameid,
    opencritic_url: params.data.opencritic_url,
    metacritic_gameid,
  };
}

function cellRendererReview(params) {
	const rating = params.data.review;

	if (rating) {
	  const color = getRatingColor(rating);
  
	  const link = params.data.review_link;
	  if (link) {
		return(
			`<a href="${link}" rel="noopener noreferrer" target="_blank">Обзор: <b style="color:${color}">${rating}</b></a>`	
		); 
	  } else {
		return `Обзор: <b style="color:${color}">${rating}</b>`; 
	  }
	}
}

function cellRendererRating(params) {
  const target = params.eGridCell;
  const value = getValue(params) || valueGetter(params);

  new ThirdPartyRatingTemplate({
    target,
    props: { props: value, setValue: params.setValue.bind(params) },
  });
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
	cellRendererRating(params);
	return cellRendererReview(params);
}

export const field = {
  headerName: "Рейтинг",
  getQuickFilterText,
  cellRenderer,
};
