var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { graphql } from "react-apollo";
import { get, upperFirst, camelCase, isEmpty } from "lodash";
import React from "react";
import deepEqual from "deep-equal";
import compose from "lodash/fp/compose";
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

export default function withQuery(inputFragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var isPlural = options.isPlural,
      asFunction = options.asFunction,
      asQueryObj = options.asQueryObj,
      LoadingComp = options.LoadingComp,
      nameOverride = options.nameOverride,
      client = options.client,
      variables = options.variables,
      _props = options.props,
      queryName = options.queryName,
      getIdFromParams = options.getIdFromParams,
      showLoading = options.showLoading,
      inDialog = options.inDialog,
      _options$showError = options.showError,
      showError = _options$showError === undefined ? true : _options$showError,
      queryOptions = options.options,
      rest = _objectWithoutProperties(options, ["isPlural", "asFunction", "asQueryObj", "LoadingComp", "nameOverride", "client", "variables", "props", "queryName", "getIdFromParams", "showLoading", "inDialog", "showError", "options"]);

  var fragment = Array.isArray(inputFragment) ? generateFragmentWithFields.apply(undefined, inputFragment) : inputFragment;

  var gqlQuery = generateQuery(fragment, options);
  var modelName = get(fragment, "definitions[0].typeCondition.name.value");
  var nameToUse = nameOverride || (isPlural ? pluralize(modelName) : modelName);
  var queryNameToUse = queryName || nameToUse + "Query";
  if (asQueryObj) {
    return gqlQuery;
  }
  if (asFunction) {
    if (!client) return console.error("You need to pass the apollo client to withQuery if using as a function");

    return function query(localVars) {
      return client.query(_extends({
        query: gqlQuery,
        name: "createDataFile",
        ssr: false,
        fetchPolicy: "network-only"
      }, queryOptions, {
        variables: localVars || variables || queryOptions && queryOptions.variables || undefined
      })).then(function (res) {
        var toReturn = isPlural ? [].concat(res.data[nameToUse].results) : res.data[nameToUse];
        if (isPlural) {
          toReturn.totalResults = res.data[nameToUse].totalResults;
        }
        return toReturn;
      });
    };
  }

  return compose(graphql(gqlQuery, _extends({
    //default options
    options: function options(props) {
      var propVariables = props.variables,
          fetchPolicy = props.fetchPolicy,
          pollInterval = props.pollInterval,
          notifyOnNetworkStatusChange = props.notifyOnNetworkStatusChange;

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
      if (get(variablesToUse, "filter.entity") && get(variablesToUse, "filter.__objectType") === "query" && get(variablesToUse, "filter.entity") !== modelName) {
        console.error("filter model does not match fragment model!");
      }

      return _extends({}, !isEmpty(variablesToUse) && { variables: variablesToUse }, {
        fetchPolicy: fetchPolicy || "network-only",
        ssr: false,
        pollInterval: pollInterval,
        notifyOnNetworkStatusChange: notifyOnNetworkStatusChange
      }, otherExtraOptions);
    },
    props: function props() {
      var _extends2, _extends3;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _args$ = args[0],
          data = _args$.data,
          ownProps = _args$.ownProps;
      var tableParams = ownProps.tableParams;

      var results = get(data, nameToUse + (isPlural ? ".results" : ""));
      var totalResults = isPlural ? get(data, nameToUse + ".totalResults", 0) : results && 1;
      var newData = _extends({}, data, (_extends2 = {
        totalResults: totalResults,
        //adding these for consistency with withItemsQuery
        entities: results,
        entityCount: totalResults
      }, _extends2["error" + upperFirst(nameToUse)] = data.error, _extends2["loading" + upperFirst(nameToUse)] = data.loading, _extends2));

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

      var dataArgs = args[0],
          otherArgs = args.slice(1);

      return _extends({}, propsToReturn, _props && _props.apply(undefined, [_extends({}, dataArgs, propsToReturn)].concat(otherArgs)));
    }
  }, rest) //overwrite defaults here
  ), function WithLoadingHOC(WrappedComponent) {
    return function (_React$Component) {
      _inherits(WithLoadingComp, _React$Component);

      function WithLoadingComp() {
        _classCallCheck(this, WithLoadingComp);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      WithLoadingComp.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
        if (showError && nextProps.data && this.props.data && !deepEqual(nextProps.data.error, this.props.data.error)) {
          var error = nextProps.data.error;
          if (this.props.loggedIn) {
            console.error("error:", error);
            window.toastr.error("Error loading " + queryNameToUse);
          } else {
            console.warn("Error supressed, not logged in");
          }
        }
      };

      WithLoadingComp.prototype.render = function render() {
        var _props$data = this.props.data,
            data = _props$data === undefined ? {} : _props$data;
        var loading = data.loading;

        if (loading && showLoading) {
          var bounce = inDialog || showLoading === "bounce";
          return React.createElement(LoadingComp, { inDialog: inDialog, bounce: bounce });
        }
        return React.createElement(WrappedComponent, this.props);
      };

      return WithLoadingComp;
    }(React.Component);
  });
}