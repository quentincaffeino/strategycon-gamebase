import { defaultValueFormatter as valueFormatter } from "../utils/defaultValueFormatter";

export const field = {
  field: "release_date",
  headerName: "Дата выхода",
  valueFormatter,

  suppressMenu: false,
  filter: "agDateColumnFilter",
  filterParams: {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split("/");
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }

      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }

      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
  },
};
