export const routeDoubleClick = (row, rowIndex, history) => {
  const recordType = row["__typename"];
  const recordId = row["dbId"];
  const route = "/" + recordType + "s" + "/" + recordId;
  history
    ? history.push(route)
    : console.warn("router history not passed to datatable");
};
