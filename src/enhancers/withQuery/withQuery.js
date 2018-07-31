import { Query } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty, isFunction } from "lodash";
import React from "react";
// import deepEqual from "deep-equal";
// import compose from "lodash/fp/compose";
import pluralize from "pluralize";
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

export default function withQuery(_inputFragment, options = {}) {
  return Component => props => {
    const {
      isPlural,
      asFunction,
      asQueryObj,
      LoadingComp,
      nameOverride,
      client,
      variables,
      props: mapQueryProps,
      queryName,
      getIdFromParams,
      showLoading,
      inDialog,
      queryFragment: _fragment,
      // showError = true,
      options: queryOptions,
      variables: propVariables,
      fetchPolicy,
      pollInterval,
      notifyOnNetworkStatusChange,
      ...rest
    } = { ...props, ...options };
    const inputFragment = _inputFragment || _fragment;

    const fragment = Array.isArray(inputFragment)
      ? generateFragmentWithFields(...inputFragment)
      : inputFragment;

    const gqlQuery = generateQuery(fragment, { ...options, ...props });
    const name = get(fragment, "definitions[0].typeCondition.name.value");
    const nameToUse = nameOverride || (isPlural ? pluralize(name) : name);
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
    let extraOptions = queryOptions || {};
    if (typeof queryOptions === "function") {
      extraOptions = queryOptions(props) || {};
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
          const { tableParams } = props;
          const totalResults = isPlural
            ? get(data, nameToUse + ".totalResults", 0)
            : results && 1;
          const newData = {
            ...data,
            totalResults,
            //adding these for consistency with withItemsQuery
            entities: results,
            entityCount: totalResults,
            [nameToUse]: results,
            ["error" + upperFirst(nameToUse)]: data.error,
            ["loading" + upperFirst(nameToUse)]: data.loading
          };

          data.loading = data.loading || data.networkStatus === 4;

          const propsToReturn = {
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

          // const [dataArgs, ...otherArgs] = args;
          //
          return (
            <Component
              {...{
                ...props,
                ...propsToReturn,
                ...(isFunction(mapQueryProps) && mapQueryProps(propsToReturn))
              }}
            />
          );
        }}
      </Query>
    );
  };
}

// function WithLoadingHOC(WrappedComponent) {
//   return class WithLoadingComp extends React.Component {
//     UNSAFE_componentWillReceiveProps(nextProps) {
//       if (
//         showError &&
//         nextProps.data &&
//         this.props.data &&
//         !deepEqual(nextProps.data.error, this.props.data.error)
//       ) {
//         const error = nextProps.data.error;
//         if (this.props.loggedIn) {
//           console.error("error:", error);
//           window.toastr.error(`Error loading ${queryNameToUse}`);
//         } else {
//           console.warn("Error supressed, not logged in");
//         }
//       }
//     }
//     render() {
//       const { data = {} } = this.props;
//       const { loading } = data;
//       if (loading && showLoading) {
//         const bounce = inDialog || showLoading === "bounce";
//         return <LoadingComp inDialog={inDialog} bounce={bounce} />;
//       }
//       return <WrappedComponent {...this.props} />;
//     }
//   };
// }
