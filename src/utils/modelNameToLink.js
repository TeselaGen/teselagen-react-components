import { kebabCase } from "lodash";
import pluralize from "pluralize";

let modelNameMap = {
  j5Report: "assembly-report"
};

export const setModelLinkMap = map => {
  modelNameMap = map;
};

export default function modelNameToLink(modelNameOrRecord, maybeId) {
  let modelName,
    id = maybeId;
  if (typeof modelNameOrRecord === "string") {
    modelName = modelNameOrRecord;
  } else {
    modelName = modelNameOrRecord.__typename;
    id = modelNameOrRecord.id;
  }
  let link = modelNameMap[modelName] || kebabCase(modelName);
  link = "/" + pluralize(link);
  return id ? link + `/${id}` : link;
}
