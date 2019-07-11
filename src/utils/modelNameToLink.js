import { kebabCase } from "lodash";
import pluralize from "pluralize";

let modelNameMap = {
  j5Report: "assembly-report",
  microserviceQueue: "microservice-task"
};

export const setModelLinkMap = map => {
  modelNameMap = map;
};

export default function modelNameToLink(modelName, id) {
  let link = modelNameMap[modelName] || kebabCase(modelName);
  link = "/" + pluralize(link);
  return id ? link + `/${id}` : link;
}
