var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteralLoose(["\n    mutation ", "($input: [", "Input]) {\n      ", "(input: $input) {\n        createdItemsCursor {\n          results {\n            ", "\n          }\n        }\n      }\n    }\n    ", "\n  "], ["\n    mutation ", "($input: [", "Input]) {\n      ", "(input: $input) {\n        createdItemsCursor {\n          results {\n            ", "\n          }\n        }\n      }\n    }\n    ", "\n  "]),
    _templateObject2 = _taggedTemplateLiteralLoose(["\n    mutation ", "($input: [", "Input]) {\n      ", "(input: $input) {\n        updatedItemsCursor {\n          results {\n            ", "\n          }\n        }\n      }\n    }\n    ", "\n  "], ["\n    mutation ", "($input: [", "Input]) {\n      ", "(input: $input) {\n        updatedItemsCursor {\n          results {\n            ", "\n          }\n        }\n      }\n    }\n    ", "\n  "]);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { graphql } from "react-apollo";
import { connect } from "react-redux";
import compose from "lodash/fp/compose";
import gql from "graphql-tag";
import pascalCase from "pascal-case";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";
import generateFragmentWithFields from "../utils/generateFragmentWithFields";

/**
 * withUpsert
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param {options} options
 * @typedef {object} options
 * @property {string} mutationName - optional rename of the default upsert function withXXXX to whatever you want
 * @property {[queryNameStrings]} refetchQueries -
 * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
 * @property {obj | function} extraMutateArgs - obj or function that returns obj to get passed to the actual mutation call
 * @property {[string]} invalidate - array of model types to invalidate after the mutate
 * @property {boolean} asFunction - if true, this gives you back a function you can call directly instead of a HOC
 * @property {string} idAs - if not using a fragment, you get an id field back as default. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
 * @property {boolean} forceCreate - sometimes the thing you're creating won't have an id field (it might have a code or something else as its primary key). This lets you override the default behavior of updating if no id is found
 * @property {boolean} forceUpdate - sometimes the thing you're updating might have an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
 * @return upsertXXXX function that takes an object or array of objects to upsert. It returns a promise resolving to an array of created/updated outputs
 */

export default function withUpsert(nameOrFragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mutationName = options.mutationName,
      _options$extraMutateA = options.extraMutateArgs,
      extraMutateArgs = _options$extraMutateA === undefined ? {} : _options$extraMutateA,
      invalidate = options.invalidate,
      asFunction = options.asFunction,
      idAs = options.idAs,
      topLevelForceCreate = options.forceCreate,
      topLevelForceUpdate = options.forceUpdate,
      client = options.client,
      refetchQueries = options.refetchQueries,
      _options$showError = options.showError,
      showError = _options$showError === undefined ? true : _options$showError,
      rest = _objectWithoutProperties(options, ["mutationName", "extraMutateArgs", "invalidate", "asFunction", "idAs", "forceCreate", "forceUpdate", "client", "refetchQueries", "showError"]);

  var fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  if (Array.isArray(fragment)) {
    fragment = generateFragmentWithFields.apply(undefined, fragment);
  }
  var name = fragment ? fragment.definitions[0].typeCondition.name.value : nameOrFragment;

  // const {fragment, extraMutateArgs} = options
  var fragName = fragment && fragment.definitions[0].name.value;
  var pascalCaseName = pascalCase(name);
  var createName = "create" + pascalCaseName;
  /* eslint-disable */
  var createMutation = gql(_templateObject, createName, createName, createName, fragName ? "..." + fragName : idAs || "id", fragment ? fragment : "");
  /* eslint-enable */

  var updateName = "update" + pascalCaseName;
  /* eslint-disable */
  var updateMutation = gql(_templateObject2, updateName, updateName, updateName, fragName ? "..." + fragName : idAs || "id", fragment ? fragment : "");
  /* eslint-enable */

  var getExtraMutateArgs = function getExtraMutateArgs() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var runtimeOptions = args && args[1];
    var extraMutateArgsToUse = runtimeOptions && runtimeOptions.extraMutateArgs ? runtimeOptions.extraMutateArgs : extraMutateArgs;
    var extraArgs = {};
    if (invalidate) {
      if (!Array.isArray(invalidate)) throw new Error('The invalidate option should be an array of model name strings eg ["user", "workflowRun"]');
      extraArgs = { options: invalidateQueriesOfTypes(invalidate) };
    }
    if (typeof extraMutateArgsToUse === "function") {
      extraArgs = _extends({}, extraArgs, extraMutateArgsToUse.apply(undefined, args));
    } else {
      extraArgs = _extends({}, extraArgs, extraMutateArgsToUse);
    }
    return extraArgs;
  };

  if (asFunction) {
    if (!client) return console.error("You need to pass the apollo client to withUpsert if using as a function");
    return function upsert(valueOrValues) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          update = _ref.update;

      var values = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];
      var isUpdate = !!(values[0].id || values[0].code);
      if (topLevelForceCreate) {
        isUpdate = false;
      }
      if (topLevelForceUpdate) {
        isUpdate = true;
      }
      return client.mutate({
        mutation: isUpdate ? updateMutation : createMutation,
        name: "createDataFile",
        variables: {
          input: values
        },
        update: update
      }).then(function (res) {
        return Promise.resolve(res.data[isUpdate ? updateName : createName][isUpdate ? "updatedItemsCursor" : "createdItemsCursor"].results);
      });
    };
  }

  return compose(graphql(createMutation, _extends({
    name: "createItem",
    props: function props(_ref2) {
      var _createItem = _ref2.createItem;

      return {
        createItem: function createItem() {
          var input = arguments.length <= 0 ? undefined : arguments[0];

          var _ref3 = (arguments.length <= 1 ? undefined : arguments[1]) || {},
              update = _ref3.update;

          return _createItem(_extends({
            variables: {
              input: input
            },
            update: update,
            refetchQueries: refetchQueries
          }, getExtraMutateArgs.apply(undefined, arguments)));
        }
      };
    }
  }, rest)), graphql(updateMutation, _extends({
    name: "updateItem",
    props: function props(_ref4) {
      var _updateItem = _ref4.updateItem;

      return {
        updateItem: function updateItem() {
          var input = arguments.length <= 0 ? undefined : arguments[0];

          var _ref5 = (arguments.length <= 1 ? undefined : arguments[1]) || {},
              update = _ref5.update;

          return _updateItem(_extends({
            variables: {
              input: input
            },
            update: update,
            refetchQueries: refetchQueries
          }, getExtraMutateArgs.apply(undefined, arguments)));
        }
      };
    }
  }, rest)), connect(function (state, ownProps) {
    var _ref6;

    var createItem = ownProps.createItem,
        updateItem = ownProps.updateItem,
        _ownProps$apolloOptio = ownProps.apolloOptions,
        apolloOptions = _ownProps$apolloOptio === undefined ? {} : _ownProps$apolloOptio;
    var _apolloOptions$forceC = apolloOptions.forceCreate,
        forceCreate = _apolloOptions$forceC === undefined ? topLevelForceCreate : _apolloOptions$forceC,
        _apolloOptions$forceU = apolloOptions.forceUpdate,
        forceUpdate = _apolloOptions$forceU === undefined ? topLevelForceUpdate : _apolloOptions$forceU;


    return _ref6 = {
      createItem: undefined, //set these to undefined so people won't be tempted to use them
      updateItem: undefined
    }, _ref6[mutationName || "upsert" + pascalCaseName] = function (valueOrValues) {
      for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      //the upsertXXX function is the only thing we should be calling
      var values = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];
      if (!values[0]) throw new Error("You have to pass at least 1 thing to create or update!");
      var isUpdate = !!(values[0].id || values[0].code);
      if (forceCreate) {
        isUpdate = false;
      }
      if (forceUpdate) {
        isUpdate = true;
      }
      return (isUpdate ? updateItem : createItem).apply(undefined, [values].concat(rest)).then(function (res) {
        return Promise.resolve(res.data[isUpdate ? updateName : createName][isUpdate ? "updatedItemsCursor" : "createdItemsCursor"].results);
      }).catch(function (e) {
        if (showError) {
          window.toastr.error("Error " + (isUpdate ? "updating" : "creating") + " " + pascalCaseName);
          console.error("withUpsert " + pascalCaseName + " Error:", e);
        }
        throw e; //rethrow the error so it can be caught again if need be
      });
    }, _ref6;
  }));
}