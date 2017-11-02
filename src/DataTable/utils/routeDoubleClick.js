import pluralize from "pluralize";
import { kebabCase } from "lodash";

export default function routeDoubleClick(row, rowIndex, history) {
  const recordType = row["__typename"] || "";
  const recordId = row["dbId"] || row["id"];
  const route = "/" + pluralize(kebabCase(recordType)) + "/" + recordId;
  history
    ? history.push(route)
    : console.warn("react router history not passed to datatable");
}
