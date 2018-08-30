var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Query } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty, isFunction } from "lodash";
import React from "react";
// import deepEqual from "deep-equal";
// import compose from "lodash/fp/compose";
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
  var _inputFragment = __inputFragment;
  var options = maybeOptions || {};
  if (_inputFragment && !_inputFragment.kind && !Array.isArray(_inputFragment) && !maybeOptions) {
    options = _inputFragment;
    _inputFragment = undefined;
  }
  return function (Component) {
    return function (props) {
      // runTimeQueryOptions are used to override query options by passing them
      // directly to the component wrapped with withQuery
      var runTimeQueryOptions = props.runTimeQueryOptions,
          componentProps = _objectWithoutProperties(props, ["runTimeQueryOptions"]);

      var mergedOpts = getMergedOpts(options, runTimeQueryOptions);

      var isPlural = mergedOpts.isPlural,
          asFunction = mergedOpts.asFunction,
          asQueryObj = mergedOpts.asQueryObj,
          nameOverride = mergedOpts.nameOverride,
          client = mergedOpts.client,
          variables = mergedOpts.variables,
          mapQueryProps = mergedOpts.props,
          queryName = mergedOpts.queryName,
          getIdFromParams = mergedOpts.getIdFromParams,
          showLoading = mergedOpts.showLoading,
          inDialog = mergedOpts.inDialog,
          _fragment = mergedOpts.fragment,
          queryOptions = mergedOpts.options,
          rest = _objectWithoutProperties(mergedOpts, ["isPlural", "asFunction", "asQueryObj", "nameOverride", "client", "variables", "props", "queryName", "getIdFromParams", "showLoading", "inDialog", "fragment", "options"]);

      var _componentProps$optio = _extends({}, componentProps, options, runTimeQueryOptions),
          propVariables = _componentProps$optio.variables,
          fetchPolicy = _componentProps$optio.fetchPolicy,
          pollInterval = _componentProps$optio.pollInterval,
          notifyOnNetworkStatusChange = _componentProps$optio.notifyOnNetworkStatusChange;

      var inputFragment = _inputFragment || _fragment;
      var fragment = Array.isArray(inputFragment) ? generateFragmentWithFields.apply(undefined, inputFragment) : inputFragment;

      var gqlQuery = generateQuery(fragment, mergedOpts);
      var modelName = get(fragment, "definitions[0].typeCondition.name.value");
      var nameToUse = nameOverride || (isPlural ? pluralize(modelName) : modelName);
      var queryNameToUse = queryName || nameToUse + "Query";

      var id = void 0;
      if (getIdFromParams) {
        id = parseInt(get(props, "match.params.id"), 10);
        if (!id) {
          console.error("There needs to be an id passed here to ", queryNameToUse, "but none was found");
          /* eslint-disable */
          debugger;
          /* eslint-enable */
        }
      }
      var extraOptions = queryOptions || {};
      if (typeof queryOptions === "function") {
        extraOptions = queryOptions(props) || {};
      }

      var _extraOptions = extraOptions,
          extraOptionVariables = _extraOptions.variables,
          otherExtraOptions = _objectWithoutProperties(_extraOptions, ["variables"]);

      var variablesToUse = _extends({}, !!id && { id: id }, variables, propVariables, extraOptionVariables && extraOptionVariables);

      if (get(variablesToUse, "filter.entity") && get(variablesToUse, "filter.entity") !== modelName) {
        console.error("filter model does not match fragment model!");
      }

      return React.createElement(
        Query,
        _extends({
          query: gqlQuery
        }, !isEmpty(variablesToUse) && { variables: variablesToUse }, {
          fetchPolicy: fetchPolicy || "network-only",
          ssr: false,
          pollInterval: pollInterval,
          notifyOnNetworkStatusChange: notifyOnNetworkStatusChange
        }, otherExtraOptions, rest),
        function (_ref) {
          var _extends2, _extends3;

          var _data = _ref.data,
              queryProps = _objectWithoutProperties(_ref, ["data"]);

          var data = _extends({}, _data, queryProps);
          var results = get(data, nameToUse + (isPlural ? ".results" : ""));
          var tableParams = componentProps.tableParams;

          var totalResults = isPlural ? get(data, nameToUse + ".totalResults", 0) : results && 1;
          var newData = _extends({}, data, (_extends2 = {
            totalResults: totalResults,
            //adding these for consistency with withItemsQuery
            entities: results,
            entityCount: totalResults
          }, _extends2[nameToUse] = results, _extends2["error" + upperFirst(nameToUse)] = data.error, _extends2["loading" + upperFirst(nameToUse)] = data.loading, _extends2));

          data.loading = data.loading || data.networkStatus === 4;

          var propsToReturn = _extends({}, tableParams && !tableParams.entities && !tableParams.isLoading ? {
            tableParams: _extends({}, tableParams, {
              isLoading: data.loading,
              entities: results,
              entityCount: totalResults,
              onRefresh: data.refetch,
              fragment: fragment
            })
          } : {}, (_extends3 = {
            data: newData
          }, _extends3[queryNameToUse] = newData, _extends3[nameToUse] = results, _extends3[nameToUse + "Error"] = data.error, _extends3[nameToUse + "Loading"] = data.loading, _extends3[nameToUse + "Count"] = totalResults, _extends3[camelCase("refetch_" + nameToUse)] = data.refetch, _extends3.fragment = fragment, _extends3.gqlQuery = gqlQuery, _extends3));

          if (data.loading && showLoading) {
            var bounce = inDialog || showLoading === "bounce";
            return React.createElement(Loading, { inDialog: inDialog, bounce: bounce });
          }

          var allPropsForComponent = _extends({}, componentProps, propsToReturn);

          return React.createElement(Component, _extends({}, allPropsForComponent, isFunction(mapQueryProps) && mapQueryProps(allPropsForComponent)));
        }
      );
    };
  };
}

function getMergedOpts(topLevelOptions, runTimeQueryOptions) {
  return _extends({}, topLevelOptions, runTimeQueryOptions);
}