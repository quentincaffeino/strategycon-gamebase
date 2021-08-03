import { defaultValueFormatter as valueFormatter } from "../../utils/defaultValueFormatter";
import ReleaseDateFilter from "./ReleaseDateFilter";

export const field = {
  field: "release_date",
  headerName: "Дата выхода",
  valueFormatter,
  floatingFilterComponent: ReleaseDateFilter.COMPONENT_NAME,
};

export const components = {
  [ReleaseDateFilter.COMPONENT_NAME]: ReleaseDateFilter,
};
