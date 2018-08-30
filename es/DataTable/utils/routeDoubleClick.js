import pluralize from "pluralize";
import { kebabCase } from "lodash";

export default function routeDoubleClick(row, rowIndex, history) {
  var recordType = row["__typename"] || "";
  var recordId = row["dbId"] || row["id"];
  var route = "/" + pluralize(kebabCase(recordType)) + "/" + recordId;
  history ? history.push(route) : console.warn("react router history not passed to datatable");
}