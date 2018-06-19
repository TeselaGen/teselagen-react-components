import { get } from "lodash";
import pluralize from "pluralize";
import gql from "graphql-tag";
import generateFragmentWithFields from "./generateFragmentWithFields";

export default function generateQuery(inputFragment, options = {}) {
  const { isPlural, queryName, nameOverride, argsOverride, idAs } = options;
  let fragment = inputFragment;
  if (Array.isArray(fragment)) {
    fragment = generateFragmentWithFields(...fragment);
  }
  if (typeof fragment === "string" || typeof fragment !== "object") {
    throw new Error("Please provide a valid fragment when using withQuery!");
  }
  const name = get(fragment, "definitions[0].typeCondition.name.value");
  if (!name) {
    console.error("Bad fragment passed to withQuery!!");
    console.error(fragment, options);
    throw new Error(
      "No fragment name found in withQuery() call. This is due to passing in a string or something other than a gql fragment to withQuery"
    );
  }
  const fragName = fragment && fragment.definitions[0].name.value;
  const nameToUse = nameOverride || (isPlural ? pluralize(name) : name);
  const queryNameToUse = queryName || nameToUse + "Query";
  let queryInner = `${fragName ? `...${fragName}` : idAs || "id"}`;
  if (isPlural) {
    queryInner = `results {
      ${queryInner}
    }
    totalResults`;
  }

  let gqlQuery;
  if (argsOverride) {
    gqlQuery = gql`
    query ${queryNameToUse} ${argsOverride[0] || ""} {
      ${nameToUse} ${argsOverride[1] || ""} {
        ${queryInner}
      }
    }
    ${fragment ? fragment : ``}
  `;
  } else if (isPlural) {
    gqlQuery = gql`
      query ${queryNameToUse} ($pageSize: Int $sort: [String] $filter: JSON $pageNumber: Int) {
        ${nameToUse}(pageSize: $pageSize, sort: $sort, filter: $filter, pageNumber: $pageNumber) {
          ${queryInner}
        }
      }
      ${fragment ? fragment : ``}
    `;
  } else {
    gqlQuery = gql`
      query ${queryNameToUse} ($${idAs || "id"}: String!) {
        ${nameToUse}(${idAs || "id"}: $${idAs || "id"}) {
          ${queryInner}
        }
      }
      ${fragment ? fragment : ``}
    `;
  }
  return gqlQuery;
}
