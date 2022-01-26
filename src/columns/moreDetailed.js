const getLinkTemplateFor = (link, name, display = "inline") =>
  link
    ? `<a href="${link}" style="display:"${display}" rel="noopener noreferrer" target="_blank">${name}</a>`
    : name;

function cellRenderer(params) {
  const steam_link = params.data.steam_link;
  const epicGames_link = params.data.epicGames_link;
  const wiki_link = params.data.wiki_link;
  const gog_link = params.data.gog_link;
  const official_link = params.data.official_link;

  let content = "";

  if (steam_link) {
    content += getLinkTemplateFor(steam_link, "Steam", "block");
  }
  if (epicGames_link) {
    content += getLinkTemplateFor(epicGames_link, "Epic Games", "block");
  }
  if (wiki_link) {
    content += getLinkTemplateFor(wiki_link, "Вики", "block");
  }
  if (gog_link) {
    content += getLinkTemplateFor(gog_link, "GOG", "block");
  }
  if (official_link) {
    content += getLinkTemplateFor(official_link, "Оф. сайт", "block");
  }

  return content;
}

export const field = {
  field: "moreDatailed",
  headerName: "Подробнее",
  cellRenderer,
  filter: false,
};
