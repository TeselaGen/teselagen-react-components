import { graphql } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty, keyBy } from "lodash";
import React from "react";
import deepEqual from "deep-equal";
import compose from "lodash/fp/compose";
import pluralize from "pluralize";
import { withHandlers, branch } from "recompose";
import generateQuery from "../../utils/generateQuery";
import generateFragmentWithFields from "../../utils/generateFragmentWithFields";

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
  const modelName = get(fragment, "definitions[0].typeCondition.name.value");
  const nameToUse =
    nameOverride || (isPlural ? pluralize(modelName) : modelName);
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

  const tableParamHandlers = {
    selectTableRecords: props => (ids, keepOldEntities) => {
      const {
        tableParams: { entities, selectedEntities, changeFormValue }
      } = props;
      setTimeout(function() {
        const entitiesById = keyBy(entities, "id");
        const newIdMap = {
          ...(keepOldEntities && selectedEntities)
        };
        ids.forEach(id => {
          const entity = entitiesById[id];
          if (!entity) return;
          newIdMap[id] = {
            entity
          };
        });
        changeFormValue("reduxFormSelectedEntityIdMap", newIdMap);
      });
    }
  };

  return compose(
    graphql(gqlQuery, {
      //default options
      options: props => {
        const variables = getVariables(props, queryOptions, {
          ...options,
          queryNameToUse
        });
        const {
          fetchPolicy,
          pollInterval,
          notifyOnNetworkStatusChange
        } = props;
        let extraOptions = queryOptions || {};
        if (typeof queryOptions === "function") {
          extraOptions = queryOptions(props) || {};
        }

        const {
          variables: extraOptionVariables,
          ...otherExtraOptions
        } = extraOptions;
        if (
          get(variables, "filter.entity") &&
          get(variables, "filter.__objectType") === "query" &&
          get(variables, "filter.entity") !== modelName
        ) {
          console.error("filter model does not match fragment model!");
        }

        return {
          ...(!isEmpty(variables) && { variables }),
          fetchPolicy: fetchPolicy || "network-only",
          ssr: false,
          pollInterval,
          notifyOnNetworkStatusChange,
          // This will refetch queries whose data has been messed up by other cache updates. https://github.com/apollographql/react-apollo/pull/2003
          partialRefetch: true,
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

        const variables = getVariables(ownProps, queryOptions, {
          ...options,
          queryNameToUse
        });

        let newTableParams;
        if (tableParams && !tableParams.entities && !tableParams.isLoading) {
          const entities = results;

          newTableParams = {
            ...tableParams,
            isLoading: data.loading,
            entities,
            entityCount: totalResults,
            onRefresh: data.refetch,
            variables,
            fragment
          };
        }

        const propsToReturn = {
          ...(newTableParams && { tableParams: newTableParams }),
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

        const [dataArgs, ...otherArgs] = args;
        return {
          ...propsToReturn,
          ...(props &&
            props(
              {
                ...dataArgs,
                ...propsToReturn
              },
              ...otherArgs
            ))
        };
      },
      ...rest //overwrite defaults here
    }),
    branch(props => props.tableParams, withHandlers(tableParamHandlers)),
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

function getVariables(ownProps, queryOptions, options) {
  const { variables: propVariables } = ownProps;
  const { getIdFromParams, queryNameToUse, variables } = options;
  let id;
  if (getIdFromParams) {
    id = parseInt(get(ownProps, "match.params.id"), 10);
    if (!id) {
      console.error(
        "There needs to be an id passed here to ",
        queryNameToUse,
        "but none was found"
      );
      debugger; // eslint-disable-line
      // to prevent crash
      id = -1;
    }
  }
  let extraOptions = queryOptions || {};
  if (typeof queryOptions === "function") {
    extraOptions = queryOptions(ownProps) || {};
  }

  const { variables: extraOptionVariables } = extraOptions;
  return {
    ...(getIdFromParams && { id }),
    ...variables,
    ...propVariables,
    ...(extraOptionVariables && extraOptionVariables)
  };
}
