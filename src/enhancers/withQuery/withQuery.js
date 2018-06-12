import { graphql } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty } from "lodash";
import React from "react";
import deepEqual from "deep-equal";
import compose from "lodash/fp/compose";
import pluralize from "pluralize";
import generateQuery from "../../utils/generateQuery";
import generateFragmentWithFields from "../../../lib/utils/generateFragmentWithFields";

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
 * @property {boolean || string} showLoading Show a loading spinner over the whole component while the data is loading
 * @property {boolean} showError Default=true show an error message toastr if the an error occurs while loading the data
 * @return {props}: {xxxxQuery, data }
 */

export default function withQuery(inputFragment, options = {}) {
  const {
    isPlural,
    asFunction,
    asQueryObj,
    LoadingComp,
    nameOverride,
    client,
    variables,
    props,
    queryName,
    getIdFromParams,
    showLoading,
    inDialog,
    showError = true,
    options: queryOptions,
    ...rest
  } = options;
  const fragment = Array.isArray(inputFragment)
    ? generateFragmentWithFields(...inputFragment)
    : inputFragment;

  const gqlQuery = generateQuery(fragment, options);
  const name = get(fragment, "definitions[0].typeCondition.name.value");
  const nameToUse = nameOverride || (isPlural ? pluralize(name) : name);
  const queryNameToUse = queryName || nameToUse + "Query";
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
          ...queryOptions,
          variables:
            localVars ||
            variables ||
            (queryOptions && queryOptions.variables) ||
            undefined
        })
        .then(function(res) {
          const toReturn = isPlural
            ? [...res.data[nameToUse].results]
            : res.data[nameToUse];
          if (isPlural) {
            toReturn.totalResults = res.data[nameToUse].totalResults;
          }
          return toReturn;
        });
    };
  }

  return compose(
    graphql(gqlQuery, {
      //default options
      options: props => {
        const {
          variables: propVariables,
          fetchPolicy,
          pollInterval,
          notifyOnNetworkStatusChange
        } = props;
        let id;
        if (getIdFromParams) {
          id = parseInt(get(props, "match.params.id"), 10);
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
        }
        let extraOptions = queryOptions || {};
        if (typeof queryOptions === "function") {
          extraOptions = queryOptions(props);
        }
        const {
          variables: extraOptionVariables,
          ...otherExtraOptions
        } = extraOptions;
        const variablesToUse = {
          ...(!!id && { id }),
          ...variables,
          ...propVariables,
          ...(extraOptionVariables && extraOptionVariables)
        };
        return {
          ...(!isEmpty(variablesToUse) && { variables: variablesToUse }),
          fetchPolicy: fetchPolicy || "network-only",
          ssr: false,
          pollInterval,
          notifyOnNetworkStatusChange,
          ...otherExtraOptions
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
          ...(tableParams && !tableParams.entities && !tableParams.isLoading
            ? {
                tableParams: {
                  ...tableParams,
                  isLoading: data.loading,
                  entities: results,
                  entityCount: totalResults,
                  onRefresh: data.refetch,
                  fragment
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
          [camelCase("refetch_" + nameToUse)]: data.refetch,
          fragment,
          gqlQuery
        };
      },
      ...rest //overwrite defaults here
    }),
    function WithLoadingHOC(WrappedComponent) {
      return class WithLoadingComp extends React.Component {
        UNSAFE_componentWillReceiveProps(nextProps) {
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
              console.warn("Error supressed, not logged in");
            }
          }
        }
        render() {
          const { data = {} } = this.props;
          const { loading } = data;
          if (loading && showLoading) {
            const bounce = inDialog || showLoading === "bounce";
            return <LoadingComp inDialog={inDialog} bounce={bounce} />;
          }
          return <WrappedComponent {...this.props} />;
        }
      };
    }
  );
}
