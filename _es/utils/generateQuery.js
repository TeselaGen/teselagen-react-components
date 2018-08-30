var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteralLoose(["\n    query ", " ", " {\n      ", " ", " {\n        ", "\n      }\n    }\n    ", "\n  "], ["\n    query ", " ", " {\n      ", " ", " {\n        ", "\n      }\n    }\n    ", "\n  "]),
    _templateObject2 = _taggedTemplateLiteralLoose(["\n      query ", " ($pageSize: Int $sort: [String] $filter: JSON $pageNumber: Int) {\n        ", "(pageSize: $pageSize, sort: $sort, filter: $filter, pageNumber: $pageNumber) {\n          ", "\n        }\n      }\n      ", "\n    "], ["\n      query ", " ($pageSize: Int $sort: [String] $filter: JSON $pageNumber: Int) {\n        ", "(pageSize: $pageSize, sort: $sort, filter: $filter, pageNumber: $pageNumber) {\n          ", "\n        }\n      }\n      ", "\n    "]),
    _templateObject3 = _taggedTemplateLiteralLoose(["\n      query ", " ($", ": String!) {\n        ", "(", ": $", ") {\n          ", "\n        }\n      }\n      ", "\n    "], ["\n      query ", " ($", ": String!) {\n        ", "(", ": $", ") {\n          ", "\n        }\n      }\n      ", "\n    "]);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import { get } from "lodash";
import pluralize from "pluralize";
import gql from "graphql-tag";
import generateFragmentWithFields from "./generateFragmentWithFields";

export default function generateQuery(inputFragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isPlural = options.isPlural,
      queryName = options.queryName,
      nameOverride = options.nameOverride,
      argsOverride = options.argsOverride,
      idAs = options.idAs;

  var fragment = inputFragment;
  if (Array.isArray(fragment)) {
    fragment = generateFragmentWithFields.apply(undefined, fragment);
  }
  if (typeof fragment === "string" || (typeof fragment === "undefined" ? "undefined" : _typeof(fragment)) !== "object") {
    throw new Error("Please provide a valid fragment when using withQuery!");
  }
  var name = get(fragment, "definitions[0].typeCondition.name.value");
  if (!name) {
    console.error("Bad fragment passed to withQuery!!");
    console.error(fragment, options);
    throw new Error("No fragment name found in withQuery() call. This is due to passing in a string or something other than a gql fragment to withQuery");
  }
  var fragName = fragment && fragment.definitions[0].name.value;
  var nameToUse = nameOverride || (isPlural ? pluralize(name) : name);
  var queryNameToUse = queryName || nameToUse + "Query";
  var queryInner = "" + (fragName ? "..." + fragName : idAs || "id");
  if (isPlural) {
    queryInner = "results {\n      " + queryInner + "\n    }\n    totalResults";
  }

  var gqlQuery = void 0;
  if (argsOverride) {
    gqlQuery = gql(_templateObject, queryNameToUse, argsOverride[0] || "", nameToUse, argsOverride[1] || "", queryInner, fragment ? fragment : "");
  } else if (isPlural) {
    gqlQuery = gql(_templateObject2, queryNameToUse, nameToUse, queryInner, fragment ? fragment : "");
  } else {
    gqlQuery = gql(_templateObject3, queryNameToUse, idAs || "id", nameToUse, idAs || "id", idAs || "id", queryInner, fragment ? fragment : "");
  }
  return gqlQuery;
}