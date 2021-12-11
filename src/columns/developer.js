import { defaultValueFormatter as valueFormatter } from "../utils/defaultValueFormatter";
import { getFormattedValue } from "../utils/getValue";

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  
  const names = (getFormattedValue(params) || "")
  .split(",")
  .map((el) => el.trim());

  return names.join(", ");
}

export const field = {
  field: "developer",
  headerName: "Разработчик",
  valueFormatter,
  cellRenderer,
};
