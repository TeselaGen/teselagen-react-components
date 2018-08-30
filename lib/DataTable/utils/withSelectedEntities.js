"use strict";

exports.__esModule = true;
exports.default = withSelectedEntities;
exports.getRecordsFromIdMap = getRecordsFromIdMap;
exports.getSelectedEntities = getSelectedEntities;

var _reduxForm = require("redux-form");

var _lodash = require("lodash");

var _reactRedux = require("react-redux");

/**
 *
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} ...etc
 */
function withSelectedEntities() {
  for (var _len = arguments.length, formNames = Array(_len), _key = 0; _key < _len; _key++) {
    formNames[_key] = arguments[_key];
  }

  if (!formNames.length) {
    throw new Error("You need to pass at least one arg to withSelectedEntities");
  }
  if (typeof formNames[0] === "string") {
    //NEW WAY
    return (0, _reactRedux.connect)(function (state) {
      return formNames.reduce(function (acc, formName) {
        acc[formName + "SelectedEntities"] = getRecordsFromIdMap(state, formName);
        return acc;
      }, {});
    });
  } else {
    //OLD WAY:
    var _formNames$ = formNames[0],
        formName = _formNames$.formName,
        name = _formNames$.name;

    if (!formName) {
      throw new Error("Please pass a {formName} option when using withSelectedEntities");
    }
    return (0, _reactRedux.connect)(function (state) {
      var _ref;

      return _ref = {}, _ref[name || "selectedEntities"] = getRecordsFromIdMap(state, formName), _ref;
    });
  }
}

function getRecordsFromIdMap(state, formName) {
  var selector = (0, _reduxForm.formValueSelector)(formName);
  var selectedEntityIdMap = selector(state, "reduxFormSelectedEntityIdMap") || {};
  return (0, _lodash.reduce)(selectedEntityIdMap, function (acc, item) {
    if (item && item.entity) acc.push(item.entity);
    return acc;
  }, []);
}

function getSelectedEntities(storeOrState, formName) {
  var state = storeOrState.getState ? storeOrState.getState() : storeOrState;
  return getRecordsFromIdMap(state, formName);
}