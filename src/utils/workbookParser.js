
export function workbookParser(workbook) {
  return new Promise((resolve) => {
    // our data is in the first sheet
    let firstSheetName = workbook.SheetNames[0]
    let worksheet = workbook.Sheets[firstSheetName]

    // we expect the following columns to be present
    let columns = {
      A: "name",
      B: "image",
      C: "release_date",
      D: "genre",
      E: "time_type",
      F: "tags",
      G: "steam_gameid",
      H: "review",
      I: "translations",
      J: "status",
      K: "developer",
      L: "publisher",
      M: "platforms",
      N: "link",
      O: "review_link",
      P: "developer_link",
      Q: "publisher_link",
      R: "opencritic_url",
      S: "metacritic_gameid",
      T: "mode",
    }

    let rowData = []

    // start at the 2nd row - the first row are the headers
    let rowIndex = 2

    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet["A" + rowIndex]) {
      let row = {}
      Object.keys(columns).forEach(function (column) {
        const col = worksheet[column + rowIndex]
        if (col) {
          row[columns[column]] = col.w
        }
      })

      rowData.push(row)

      rowIndex++
    }

    // finally, set the imported rowData into the grid
    resolve(rowData)
  })
}
