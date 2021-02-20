import { defaultValueFormatter as valueFormatter } from "../utils/defaultValueFormatter";
import { getFormattedValue } from "../utils/getValue";

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const getLinkTemplateFor = (link, name) =>
    link
      ? `<a href="${link}" style="display:inline" rel="noopener noreferrer" target="_blank">${name}</a>`
      : name;

  const names = (getFormattedValue(params) || "")
    .split(",")
    .map((el) => el.trim());

  const links = (params.data.developer_link || "")
    .split(",")
    .map((el) => el.trim());

  let result = [];
  for (let i = 0; i < names.length; ++i) {
    result.push(getLinkTemplateFor(links[i], names[i]));
  }
  return result.join(", ");
}

export const field = {
  field: "developer",
  headerName: "Разработчик",
  valueFormatter,
  cellRenderer,
};
