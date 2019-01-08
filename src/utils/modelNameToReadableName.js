import { startCase, lowerCase } from "lodash";
import pluralize from "pluralize";

let modelNameMap = {},
  upperModelNameMap = {};

export const setModelUppercaseMap = map => {
  upperModelNameMap = map;
};

export const setModelLowercaseMap = map => {
  modelNameMap = map;
};

export default function modelNameToReadableName(
  modelName,
  { upperCase, sanitize, plural } = {}
) {
  let modelNameToUse = modelName;
  if (upperCase) {
    modelNameToUse =
      upperModelNameMap[modelNameToUse] || startCase(modelNameToUse);
  } else {
    modelNameToUse = modelNameMap[modelNameToUse] || lowerCase(modelNameToUse);
  }
  if (sanitize) {
    modelNameToUse = sanitize(modelNameToUse);
  }
  if (plural) modelNameToUse = pluralize(modelNameToUse);
  if (modelName === "j5Report") modelNameToUse += " (j5)";
  return modelNameToUse;
}
