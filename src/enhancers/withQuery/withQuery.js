import { graphql } from "react-apollo";
import { gql } from "react-apollo";
import pluralize from "pluralize";
import { get, upperFirst, camelCase } from "lodash";
import React from "react";
import deepEqual from "deep-equal";
import compose from "lodash/fp/compose";

/**
 * withQuery 
 * @param {gql fragment} fragment supply a fragment as the first argument
 * @param {options} options 
 * @typedef {object} options
 * @property {boolean} isPlural Are we searching for 1 thing or many?
 * @property {string} queryName What the props come back on ( by default = modelName + 'Query')
 * @property {boolean} asFunction If true, this gives you back a function you can call directly instead of a HOC
 * @property {boolean} asQueryObj If true, this gives you back the gql query object aka gql`query myQuery () {}`
 * @property {string} idAs By default single record queries occur on an id. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
 * @property {boolean} getIdFromParams Grab the id variable off the match.params object being passed in!
 * @property {boolean} showLoading Show a loading spinner over the whole component while the data is loading
 * @property {boolean} showError Default=true show an error message toastr if the an error occurs while loading the data
 * @return {props}: {xxxxQuery, data }
 */

export default function withQuery(fragment, options = {}) {
  const {
    isPlural,
    queryName,
    nameOverride,
    argsOverride,
    asFunction,
    asQueryObj,
    idAs,
    LoadingComp,
    client,
    variables,
    props,
    getIdFromParams,
    showLoading,
    showError = true,
    ...rest
  } = options;
  if (typeof fragment === "string" || typeof fragment !== "object") {
    throw new Error("");
  }
  const name = get(fragment, "definitions[0].typeCondition.name.value");
  if (!name) {
    console.error("Bad fragment passed to withQuery!!");
    console.error(fragment, options);
    throw new Error(
      "No fragment name found in withQuery() call. This is due to passing in a string or something other than a gql fragment to withQuery"
    );
  }
  // const {fragment, extraMutateArgs} = options
  const fragName = fragment && fragment.definitions[0].name.value;
  const nameToUse = nameOverride || (isPlural ? pluralize(name) : name);
  const queryNameToUse = queryName || nameToUse + "Query";
  // const pascalNameToUse = pascalCase(nameToUse)
  let queryInner = `${fragName ? `...${fragName}` : idAs || "id"}`;
  if (isPlural) {
    queryInner = `results {
      ${queryInner}
    }
    totalResults`;
  }

  /* eslint-disable */
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

  /* eslint-enable */
  if (asQueryObj) {
    return gqlQuery;
  }
  if (asFunction) {
    if (!client)
      return console.error(
        "You need to pass the apollo client to withQuery if using as a function"
      );

    return function query(localVars) {
      return client
        .query({
          query: gqlQuery,
          name: "createDataFile",
          ssr: false,
          fetchPolicy: "network-only",
          ...(rest.options ? rest.options : {}),
          variables:
            localVars ||
            variables ||
            (rest.options && rest.options.variables) ||
            undefined
        })
        .then(function(res) {
          return Promise.resolve(
            isPlural ? res.data[nameToUse].results : res.data[nameToUse],
            res.data,
            res
          );
        });
    };
  }

  return compose(
    graphql(gqlQuery, {
      //default options

      options: props => {
        const {
          variables,
          fetchPolicy,
          pollInterval,
          notifyOnNetworkStatusChange
        } = props;
        if (getIdFromParams) {
          const id = parseInt(get(props, "match.params.id"), 10);
          if (!id) {
            console.error(
              "There needs to be an id passed here to ",
              queryNameToUse,
              "but none was found"
            );
            /* eslint-disable */
            debugger;
            /* eslint-enable */
          }
          return {
            variables: {
              id
            },
            fetchPolicy: fetchPolicy || "network-only",
            ssr: false,
            pollInterval,
            notifyOnNetworkStatusChange
          };
        }
        return {
          variables,
          fetchPolicy: fetchPolicy || "network-only",
          ssr: false,
          pollInterval,
          notifyOnNetworkStatusChange
        };
      },
      props: (...args) => {
        const { data, ownProps } = args[0];
        const { tableParams } = ownProps;
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
          ...(tableParams && !tableParams.entities
            ? {
                tableParams: {
                  ...tableParams,
                  isLoading: data.loading,
                  entities: results,
                  entityCount: totalResults,
                  onRefresh: data.refetch
                }
              }
            : {}),
          ...(props ? props(...args) : {}),
          data: newData,
          [queryNameToUse]: newData,
          [nameToUse]: results,
          [nameToUse + "Error"]: data.error,
          [nameToUse + "Loading"]: data.loading,
          [nameToUse + "Count"]: totalResults,
          [camelCase("refetch_" + nameToUse)]: data.refetch
        };
      },
      ...rest //overwrite defaults here
    }),
    function WithLoadingHOC(WrappedComponent) {
      return class WithLoadingComp extends React.Component {
        componentWillReceiveProps(nextProps) {
          if (
            showError &&
            nextProps.data &&
            this.props.data &&
            !deepEqual(nextProps.data.error, this.props.data.error)
          ) {
            const error = nextProps.data.error;
            if (this.props.loggedIn) {
              console.error("error:", error);
              window.toastr.error(`Error loading ${queryNameToUse}`);
            } else {
              console.log("Error supressed, not logged in");
            }
          }
        }
        render() {
          const { data = {} } = this.props;
          const { loading } = data;
          if (loading && showLoading) {
            return <LoadingComp style={{ minHeight: 200 }} />;
          }
          return <WrappedComponent {...this.props} />;
        }
      };
    }
  );
}
