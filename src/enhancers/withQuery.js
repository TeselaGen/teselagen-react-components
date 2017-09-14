import { graphql } from "react-apollo";
import { gql } from "react-apollo";
import pluralize from "pluralize";
import { get, upperFirst } from "lodash";

/**
 * withQuery 
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param options 
 *    @param {boolean} isPlural - are we searching for 1 thing or many?
 *    @param {string} queryName - what the props come back on ( by default = modelName + 'Query')
 *    @param {boolean} asFunction - if true, this gives you back a function you can call directly instead of a HOC
 *    @param {string} idAs - by default single record queries occur on an id. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
 
 * @return props: {xxxxQuery, data }
 */
export default function withQuery(nameOrFragment, options = {}) {
  const { isPlural, queryName, asFunction, idAs, client, ...rest } = options;
  const fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  const name = fragment
    ? fragment.definitions[0].typeCondition.name.value
    : nameOrFragment;
  // const {fragment, extraMutateArgs} = options
  const fragName = fragment && fragment.definitions[0].name.value;
  const nameToUse = isPlural ? pluralize(name) : name;
  const queryNameToUse = nameToUse + "Query" || queryName;
  // const pascalNameToUse = pascalCase(nameToUse)
  const queryInner = `${fragName ? `...${fragName}` : idAs || "id"}`;
  /* eslint-disable */
  const gqlQuery = gql`
    query ${queryNameToUse} ( ${isPlural
    ? "$pageSize: Int $sort: [String] $filter: JSON $pageNumber: Int"
    : `$${idAs || "id"}: String!`}) {
      ${nameToUse}( ${isPlural
    ? `pageSize: $pageSize, sort: $sort, filter: $filter, pageNumber: $pageNumber`
    : `${idAs || "id"}: $${idAs || "id"}`}) {
        ${isPlural
          ? `results {
            ${queryInner}
          }
          totalResults`
          : queryInner}
      }
    }
    ${fragment ? fragment : ``}
  `;
  /* eslint-enable */

  if (asFunction) {
    return function query(variables) {
      return client
        .query({
          query: gqlQuery,
          name: "createDataFile",
          variables
        })
        .then(function(res) {
          return Promise.resolve(res.data[nameToUse].results);
        });
    };
  }

  return graphql(gqlQuery, {
    //default options
    options: ({ variables, ...rest }) => {
      return {
        variables,
        ...rest
      };
    },
    props: ({ data }) => {
      const results = get(data, nameToUse + (isPlural ? ".results" : ""));
      const totalResults = isPlural
        ? get(data, nameToUse + ".totalResults", 0)
        : results && 1;
      const newData = {
        ...data,
        totalResults,
        //adding these for consistency with withItemsQuery
        entities: results,
        entityCount: totalResults,
        ["error" + upperFirst(nameToUse)]: data.error,
        ["loading" + upperFirst(nameToUse)]: data.loading
      };
      return {
        data: newData,
        [queryNameToUse]: newData,
        [nameToUse]: results,
        [nameToUse + "Count"]: results
      };
    },
    ...rest //overwrite defaults here
  });
}
