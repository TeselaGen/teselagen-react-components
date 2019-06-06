import modelNameToLink from "../../utils/modelNameToLink";

export default function routeDoubleClick(row, rowIndex, history) {
  const modelName = row["__typename"] || "";
  const recordId = row["dbId"] || row["id"];
  const route = modelNameToLink(modelName, recordId);
  history
    ? history.push(route)
    : console.warn("react router history not passed to datatable");
}
