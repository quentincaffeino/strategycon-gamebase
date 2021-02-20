export function onRowSelectionChanged(gridOptions) {
  console.log(gridOptions);
  const selectedRows = gridOptions.api.getSelectedRows();
  if (selectedRows && selectedRows.length) {
    console.log(selectedRows[0]);
    modal.fill(selectedRows[0]);
    modal.show();
  }
}

export const selectedRow = () => {
  const store = writable(null);

  return {};
};
