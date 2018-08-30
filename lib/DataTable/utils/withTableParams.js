"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withTableParams;

var _reduxForm = require("redux-form");

var _reactRedux = require("react-redux");

var _queryParams = require("./queryParams");

var _compose = require("lodash/fp/compose");

var _compose2 = _interopRequireDefault(_compose);

var _lodash = require("lodash");

var _reactRouterDom = require("react-router-dom");

var _recompose = require("recompose");

var _convertSchema = require("./convertSchema");

var _convertSchema2 = _interopRequireDefault(_convertSchema);

var _withSelectedEntities = require("./withSelectedEntities");

var _pureNoFunc = require("../../utils/pureNoFunc");

var _pureNoFunc2 = _interopRequireDefault(_pureNoFunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 *  Note all these options can be passed at Design Time or at Runtime (like reduxForm())
 *
 * @export
 *
 * @param {compOrOpts} compOrOpts
 * @typedef {object} compOrOpts
 * @property {*string} formName - required unique identifier for the table
 * @property {Object | Function} schema - The data table schema or a function returning it. The function wll be called with props as the argument.
 * @property {boolean} urlConnected - whether the table should connect to/update the URL
 * @property {boolean} withSelectedEntities - whether or not to pass the selected entities
 * @property {object} defaults - tableParam defaults such as pageSize, filter, etc
 */
function withTableParams(compOrOpts, pTopLevelOpts) {
  var _this = this;

  var topLevelOptions = void 0;
  var Component = void 0;
  if (!pTopLevelOpts) {
    topLevelOptions = compOrOpts;
  } else {
    topLevelOptions = pTopLevelOpts;
    Component = compOrOpts;
  }
  var _topLevelOptions = topLevelOptions,
      isLocalCall = _topLevelOptions.isLocalCall;


  var mapStateToProps = function mapStateToProps(state, ownProps) {
    var _ref;

    var mergedOpts = (0, _queryParams.getMergedOpts)(topLevelOptions, ownProps);
    var history = mergedOpts.history,
        urlConnected = mergedOpts.urlConnected,
        withSelectedEntities = mergedOpts.withSelectedEntities,
        formName = mergedOpts.formName,
        formNameFromWithTPCall = mergedOpts.formNameFromWithTPCall,
        defaults = mergedOpts.defaults,
        isInfinite = mergedOpts.isInfinite,
        isSimple = mergedOpts.isSimple,
        initialValues = mergedOpts.initialValues,
        _mergedOpts$additiona = mergedOpts.additionalFilter,
        additionalFilter = _mergedOpts$additiona === undefined ? {} : _mergedOpts$additiona;


    var schema = getSchema(mergedOpts);

    if (ownProps.isTableParamsConnected) {
      if (formName && formNameFromWithTPCall && formName !== formNameFromWithTPCall) {
        console.error("You passed a formName prop, " + formName + " to a <DataTable/> component that is already withTableParams() connected, formNameFromWithTableParamsCall: " + formNameFromWithTPCall);
      }
      if (ownProps.tableParams && !ownProps.tableParams.entities) {
        console.error("No entities array detected in tableParams object (<DataTable {...tableParams}/>). You need to call withQuery() after withTableParams() like: compose(withTableParams(), withQuery(something)). formNameFromWithTableParamsCall: " + formNameFromWithTPCall);
      }
      //short circuit because we've already run this logic
      return {};
    }

    var formNameFromWithTableParamsCall = void 0;
    if (isLocalCall) {
      if (!formName || formName === "tgDataTable") {
        console.error("Please pass a unique 'formName' prop to the locally connected <DataTable/> component with schema: ", schema);
      }
    } else {
      //in user instantiated withTableParams() call
      if (!formName || formName === "tgDataTable") {
        console.error("Please pass a unique 'formName' prop to the withTableParams() with schema: ", schema);
      } else {
        formNameFromWithTableParamsCall = formName;
      }
    }

    var formSelector = (0, _reduxForm.formValueSelector)(formName);
    var currentParams = (urlConnected ? (0, _queryParams.getCurrentParamsFromUrl)(history.location) //important to use history location and not ownProps.location because for some reason the location path lags one render behind!!
    : formSelector(state, "reduxFormQueryParams")) || {};

    var selectedEntities = withSelectedEntities ? (0, _withSelectedEntities.getRecordsFromIdMap)(state, formName) : undefined;

    var additionalFilterToUse = typeof additionalFilter === "function" ? additionalFilter.bind(_this, ownProps) : function () {
      return additionalFilter;
    };
    return _extends({}, mergedOpts, (0, _queryParams.getQueryParams)({
      currentParams: currentParams,
      entities: ownProps.entities, // for local table
      urlConnected: urlConnected,
      defaults: defaults,
      schema: (0, _convertSchema2.default)(schema),
      isInfinite: isInfinite || isSimple,
      isLocalCall: isLocalCall,
      additionalFilter: additionalFilterToUse
    }), {
      formNameFromWithTPCall: formNameFromWithTableParamsCall,
      // randomVarToForceLocalStorageUpdate: formSelector(state, "localStorageForceUpdate"),
      currentParams: currentParams,
      selectedEntities: selectedEntities
    }, withSelectedEntities && typeof withSelectedEntities === "string" && (_ref = {}, _ref[withSelectedEntities] = selectedEntities, _ref), {
      initialValues: _extends({}, initialValues, {
        reduxFormSearchInput: currentParams.searchTerm
      })
    });
  };

  var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
    if (ownProps.isTableParamsConnected) {
      return {};
    }
    var mergedOpts = (0, _queryParams.getMergedOpts)(topLevelOptions, ownProps);
    var formName = mergedOpts.formName,
        urlConnected = mergedOpts.urlConnected,
        history = mergedOpts.history,
        defaults = mergedOpts.defaults,
        onlyOneFilter = mergedOpts.onlyOneFilter;

    function resetSearch() {
      setTimeout(function () {
        dispatch((0, _reduxForm.change)(formName, "reduxFormSearchInput", ""));
      });
    }
    var setNewParams = void 0;
    if (urlConnected) {
      setNewParams = function setNewParams(newParams) {
        (0, _queryParams.setCurrentParamsOnUrl)(newParams, history.replace);
        dispatch((0, _reduxForm.change)(formName, "reduxFormQueryParams", newParams)); //we always will update the redux params as a workaround for withRouter not always working if inside a redux-connected container https://github.com/ReactTraining/react-router/issues/5037
      };
    } else {
      setNewParams = function setNewParams(newParams) {
        dispatch((0, _reduxForm.change)(formName, "reduxFormQueryParams", newParams));
      };
    }
    return (0, _queryParams.makeDataTableHandlers)({
      setNewParams: setNewParams,
      resetSearch: resetSearch,
      defaults: defaults,
      onlyOneFilter: onlyOneFilter
    });
  };

  function mergeProps(stateProps, dispatchProps, ownProps) {
    if (ownProps.isTableParamsConnected) {
      return ownProps;
    }
    var currentParams = stateProps.currentParams,
        formName = stateProps.formName;

    var boundDispatchProps = {};
    //bind currentParams to actions
    Object.keys(dispatchProps).forEach(function (key) {
      var action = dispatchProps[key];
      boundDispatchProps[key] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        action.apply(undefined, args.concat([currentParams]));
      };
    });

    var variables = stateProps.variables,
        selectedEntities = stateProps.selectedEntities,
        restStateProps = _objectWithoutProperties(stateProps, ["variables", "selectedEntities"]);

    return _extends({}, ownProps, {
      variables: stateProps.variables,
      selectedEntities: stateProps.selectedEntities,
      tableParams: _extends({}, ownProps.tableParams, restStateProps, dispatchProps, boundDispatchProps, {
        form: formName, //this will override the default redux form name
        isTableParamsConnected: true //let the table know not to do local sorting/filtering etc.
      })
    });
  }

  var toReturn = (0, _compose2.default)((0, _reactRedux.connect)(function (state, ownProps) {
    if (ownProps.isTableParamsConnected) {
      return {};
    }

    var _getMergedOpts = (0, _queryParams.getMergedOpts)(topLevelOptions, ownProps),
        formName = _getMergedOpts.formName;

    return {
      unusedProp: (0, _reduxForm.formValueSelector)(formName)(state, "reduxFormQueryParams") || {} //tnr: we need this to trigger withRouter and force it to update if it is nested in a redux-connected container.. very ugly but necessary
    };
  }), (0, _recompose.branch)(function (props) {
    //don't use withRouter if noRouter is passed!
    return !props.noRouter;
  }, _reactRouterDom.withRouter), (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps), _pureNoFunc2.default);
  if (Component) {
    return toReturn(Component);
  }
  return toReturn;
}

/**
 * Given the options, get the schema. This enables the user to provide
 * a function instead of an object for the schema.
 * @param {Object} options Merged options
 */
function getSchema(options) {
  var schema = options.schema;

  if ((0, _lodash.isFunction)(schema)) return schema(options);else return schema;
}
module.exports = exports["default"];