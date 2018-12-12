import { Query } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty, isFunction, keyBy } from "lodash";
import React from "react";
import deepEqual from "deep-equal";
import pluralize from "pluralize";
import generateQuery from "../../utils/generateQuery";
import generateFragmentWithFields from "../../utils/generateFragmentWithFields";
import Loading from "../../Loading";

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

export default function withQuery(__inputFragment, maybeOptions) {
  let _inputFragment = __inputFragment;
  let options = maybeOptions || {};
  if (
    _inputFragment &&
    !_inputFragment.kind &&
    !Array.isArray(_inputFragment) &&
    !maybeOptions
  ) {
    options = _inputFragment;
    _inputFragment = undefined;
  }

  const { asQueryObj, asFunction } = options;

  let inputFragment = _inputFragment;

  if (asFunction || asQueryObj) {
    return getAsFnOrQueryHelper(inputFragment, options);
  }

  let fragment, gqlQuery;
  // make this out here if possible because query
  // will rerun too much
  if (inputFragment) {
    fragment = Array.isArray(inputFragment)
      ? generateFragmentWithFields(...inputFragment)
      : inputFragment;
    gqlQuery = generateQuery(fragment, options);
  }

  return Component => props => {
    // runTimeQueryOptions are used to override query options by passing them
    // directly to the component wrapped with withQuery
    const { runTimeQueryOptions, ...componentProps } = props;
    const mergedOpts = getMergedOpts(options, runTimeQueryOptions);
    const {
      isPlural,
      asFunction,
      asQueryObj,
      LoadingComp = Loading,
      nameOverride,
      client,
      variables,
      props: mapQueryProps,
      queryName,
      getIdFromParams,
      showLoading,
      inDialog,
      fragment: _fragment,
      showError = true,
      options: queryOptions,
      skip: skipQueryFn,
      ...rest
    } = mergedOpts;

    const {
      variables: propVariables,
      fetchPolicy,
      pollInterval,
      notifyOnNetworkStatusChange
    } = { ...componentProps, ...options, ...runTimeQueryOptions };

    // if it is dynamic then these options will be used
    if (runTimeQueryOptions) {
      let inputFragment = _fragment || _inputFragment;
      fragment = Array.isArray(_fragment)
        ? generateFragmentWithFields(..._fragment)
        : inputFragment;
      gqlQuery = generateQuery(fragment, options);
    }

    const modelName = get(fragment, "definitions[0].typeCondition.name.value");
    const nameToUse =
      nameOverride || (isPlural ? pluralize(modelName) : modelName);
    const queryNameToUse = queryName || nameToUse + "Query";

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

    let shouldSkipQuery = false;
    if (skipQueryFn) {
      shouldSkipQuery = skipQueryFn(componentProps);
    }

    let extraOptions = queryOptions || {};
    if (!shouldSkipQuery) {
      if (typeof queryOptions === "function") {
        extraOptions = queryOptions(props) || {};
      }
    }

    const {
      variables: extraOptionVariables,
      ...otherExtraOptions
    } = extraOptions;
    const variablesToUse = getVariables(
      props,
      propVariables,
      extraOptionVariables,
      {
        ...options,
        queryNameToUse
      }
    );

    if (
      get(variablesToUse, "filter.entity") &&
      get(variablesToUse, "filter.entity") !== modelName
    ) {
      console.error("filter model does not match fragment model!");
    }

    return (
      <Query
        {...{
          query: gqlQuery,
          //default options
          ...(!isEmpty(variablesToUse) && { variables: variablesToUse }),
          fetchPolicy: fetchPolicy || "network-only",
          ssr: false,
          pollInterval,
          notifyOnNetworkStatusChange,
          skip: shouldSkipQuery,
          ...otherExtraOptions,
          ...rest //overwrite defaults here
        }}
      >
        {({ data: _data, ...queryProps }) => {
          const data = {
            ..._data,
            ...queryProps
          };

          const results = get(data, nameToUse + (isPlural ? ".results" : ""));
          const { tableParams } = componentProps;
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

          data.loading = data.loading || data.networkStatus === 4;

          let newTableParams;
          if (tableParams && !tableParams.entities && !tableParams.isLoading) {
            const entities = results;

            newTableParams = {
              ...tableParams,
              isLoading: data.loading,
              entities,
              entityCount: totalResults,
              onRefresh: data.refetch,
              variables: variablesToUse,
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

          if (data.loading && showLoading) {
            const bounce = inDialog || showLoading === "bounce";
            return <LoadingComp inDialog={inDialog} bounce={bounce} />;
          }

          let allPropsForComponent = {
            ...componentProps,
            ...propsToReturn
          };

          if (isFunction(mapQueryProps)) {
            allPropsForComponent = {
              ...allPropsForComponent,
              ...mapQueryProps(allPropsForComponent)
            };
          }

          return (
            <ComponentHelper
              Component={Component}
              showError={showError}
              data={newData}
              queryNameToUse={queryNameToUse}
              componentProps={allPropsForComponent}
            />
          );
        }}
      </Query>
    );
  };
}

function getMergedOpts(topLevelOptions, runTimeQueryOptions) {
  return { ...topLevelOptions, ...runTimeQueryOptions };
}

function getVariables(ownProps, propVariables, extraOptionVariables, options) {
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

  return {
    ...(getIdFromParams && { id }),
    ...variables,
    ...propVariables,
    ...(extraOptionVariables && extraOptionVariables)
  };
}

class ComponentHelper extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { showError, data, loggedIn, queryNameToUse } = this.props;
    if (
      showError &&
      nextProps.data &&
      data &&
      !deepEqual(nextProps.data.error, data.error)
    ) {
      const error = nextProps.data.error;
      if (loggedIn) {
        console.error("error:", error);
        window.toastr.error(`Error loading ${queryNameToUse}`);
      } else {
        console.warn("Error supressed, not logged in");
      }
    }
  }

  selectTableRecords = (ids, keepOldEntities) => {
    const {
      componentProps: {
        tableParams: { entities, selectedEntities, changeFormValue }
      }
    } = this.props;
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
  };

  render() {
    const { Component, componentProps } = this.props;
    const extraProps = {};
    if (componentProps.tableParams) {
      extraProps.selectTableRecords = this.selectTableRecords;
    }
    return <Component {...componentProps} {...extraProps} />;
  }
}

function getAsFnOrQueryHelper(fragment, options) {
  const {
    asQueryObj,
    asFunction,
    isPlural,
    nameOverride,
    client,
    options: queryOptions,
    variables
  } = options;

  const gqlQuery = generateQuery(fragment, options);
  const modelName = Array.isArray(fragment)
    ? fragment[0]
    : get(fragment, "definitions[0].typeCondition.name.value");
  const nameToUse =
    nameOverride || (isPlural ? pluralize(modelName) : modelName);

  if (asQueryObj) {
    return gqlQuery;
  }
  if (asFunction) {
    if (!client) {
      return console.error(
        "You need to pass the apollo client to withQuery if using as a function"
      );
    }

    return function query(localVars) {
      return client
        .query({
          query: gqlQuery,
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
          let toReturn;
          if (isPlural) {
            toReturn = [...res.data[nameToUse].results];
            toReturn.totalResults = res.data[nameToUse].totalResults;
          } else {
            toReturn = res.data[nameToUse];
          }
          return toReturn;
        });
    };
  }
}
