import pluralize from "pluralize";
export default function routeDoubleClick(row, rowIndex, history) {
  const recordType = row["__typename"];
  const recordId = row["dbId"];
  const route = "/" + pluralize(recordType) + "/" + recordId;
  history
    ? history.push(route)
    : console.warn("react router history not passed to datatable");
}
