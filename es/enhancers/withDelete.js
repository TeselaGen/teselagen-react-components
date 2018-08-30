var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteralLoose(["\n    mutation delete", "($input: [delete", "Input]) {\n      delete", "(input:$input) {\n        deletedCount\n      }\n    }\n  "], ["\n    mutation delete", "($input: [delete", "Input]) {\n      delete", "(input:$input) {\n        deletedCount\n      }\n    }\n  "]);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import pluralize from "pluralize";
import pascalCase from "pascal-case";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { camelCase } from "lodash";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";
import generateFragmentWithFields from "../utils/generateFragmentWithFields";

/**
 * withUpsert 
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param {options} 
 * @typedef {object} options
 * @property {[queryNameStrings]} refetchQueries - 
 * @property {string} mutationName - optional rename of the default delete function deleteXXXX to whatever you want
 * @property {obj | function} extraMutateArgs - obj or function that returns obj to get passed to the actual mutation call
 * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
 * @property {boolean} asFunction {boolean} if true, this gives you back a function you can call directly instead of a HOC
 TODO *    @param invalidate {[string]} array of model types to invalidate after the mutate
 * @return deleteXXXX function that takes an id or an array of ids of records to delete. It returns a promise resolving to an array of created/updated outputs
 */

export default function (nameOrFragment) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mutationName = options.mutationName,
      extraMutateArgs = options.extraMutateArgs,
      refetchQueries = options.refetchQueries,
      _options$showError = options.showError,
      showError = _options$showError === undefined ? true : _options$showError,
      client = options.client,
      asFunction = options.asFunction,
      rest = _objectWithoutProperties(options, ["mutationName", "extraMutateArgs", "refetchQueries", "showError", "client", "asFunction"]);

  var fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  if (Array.isArray(fragment)) {
    fragment = generateFragmentWithFields.apply(undefined, fragment);
  }
  var name = fragment ? fragment.definitions[0].typeCondition.name.value : nameOrFragment;
  var recordType = pascalCase(name);
  var pluralRecordType = pluralize(recordType);
  /*eslint-disable*/
  var deleteByIdsMutation = gql(_templateObject, recordType, recordType, recordType);
  /*eslint-enable*/

  var getExtraMutateArgs = function getExtraMutateArgs() {
    var extraArgs = {};
    if (typeof extraMutateArgs === "function") {
      extraArgs = _extends({}, extraArgs, extraMutateArgs.apply(undefined, arguments));
    } else {
      extraArgs = _extends({}, extraArgs, extraMutateArgs);
    }

    return extraArgs;
  };

  if (asFunction) {
    if (!client) return console.error("You need to pass the apollo client to withDelete if using as a function");
    return function deleteEntities() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _prepareArgs = prepareArgs(args),
          input = _prepareArgs.input,
          idArray = _prepareArgs.idArray,
          update = _prepareArgs.update;

      return client.mutate({
        mutation: deleteByIdsMutation,
        update: update,
        variables: {
          input: input
        }
      }).then(afterDeleteFunction({ idArray: idArray, recordType: recordType, name: name }));
    };
  }

  return graphql(deleteByIdsMutation, _extends({
    props: function props(_ref) {
      var _toReturn;

      var mutate = _ref.mutate;

      function deleteMutation() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var _prepareArgs2 = prepareArgs(args),
            input = _prepareArgs2.input,
            idArray = _prepareArgs2.idArray,
            update = _prepareArgs2.update;

        return mutate(_extends({
          variables: {
            input: input
          },
          update: update || invalidateQueriesOfTypes([pluralRecordType]),
          refetchQueries: refetchQueries
        }, getExtraMutateArgs.apply(undefined, args))).then(afterDeleteFunction({ idArray: idArray, recordType: recordType, name: name })).catch(function (e) {
          if (showError) {
            window.toastr.error("Error deleting " + recordType);
            console.error("withDelete " + recordType + " Error:", e);
          }
          throw e; //rethrow the error so it can be caught again if need be
        });
      }
      var toReturn = (_toReturn = {
        deleteEntities: deleteMutation
      }, _toReturn[camelCase("delete_" + recordType)] = deleteMutation, _toReturn);
      if (mutationName) {
        toReturn[mutationName] = deleteMutation;
      }
      return toReturn;
    }

  }, rest));
}

function prepareArgs(args) {
  var maybeIdArray = args[0],
      _args$ = args[1];
  _args$ = _args$ === undefined ? {} : _args$;
  var isCode = _args$.isCode,
      update = _args$.update;

  var idArray = Array.isArray(maybeIdArray) ? maybeIdArray : [maybeIdArray];
  if (idArray.length < 1) {
    console.error("Something went wrong, you need to pass at least one id when making a delete!");
  }
  var input = idArray.map(function (id) {
    var _ref2;

    return _ref2 = {}, _ref2[isCode ? "code" : "id"] = id, _ref2;
  });
  return {
    input: input,
    idArray: idArray,
    update: update
  };
}

var afterDeleteFunction = function afterDeleteFunction(_ref3) {
  var idArray = _ref3.idArray,
      recordType = _ref3.recordType,
      name = _ref3.name;
  return function (_ref4) {
    var data = _ref4.data;
    var deletedCount = data["delete" + recordType].deletedCount;

    if (deletedCount !== idArray.length) {
      console.error("Uh oh, the number of deleted items does not match the number of IDs passed in to be deleted! ");
      console.error("idArray.length:", idArray.length);
      console.error("deletedCount:", deletedCount);
      console.error("make sure you passed in the correct type " + name + " for the item you want to be deleting and that the item still exists! ");
    }
  };
};