"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getApolloMethods;

var _withQuery = require("./withQuery/withQuery");

var _withQuery2 = _interopRequireDefault(_withQuery);

var _withDelete = require("./withDelete");

var _withDelete2 = _interopRequireDefault(_withDelete);

var _withUpsert = require("./withUpsert");

var _withUpsert2 = _interopRequireDefault(_withUpsert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getApolloMethods(client) {
  return {
    upsert: function upsert(fragment, options, valueOrValues) {
      var optionsToUse = {};
      var valueOrValuesToUse = valueOrValues;
      if (!valueOrValues) {
        valueOrValuesToUse = options;
      } else {
        optionsToUse = options;
      }
      return (0, _withUpsert2.default)(fragment, _extends({
        asFunction: true,
        client: client
      }, optionsToUse))(valueOrValuesToUse);
    },
    query: function query(fragment, options) {
      return (0, _withQuery2.default)(fragment, _extends({ asFunction: true, client: client }, options))();
    },
    delete: function _delete(fragment, options, idOrIdsToDelete) {
      var optionsToUse = {};
      var idOrIdsToDeleteToUse = idOrIdsToDelete;
      if (!idOrIdsToDeleteToUse) {
        idOrIdsToDeleteToUse = options;
      } else {
        optionsToUse = options;
      }
      return (0, _withDelete2.default)(fragment, _extends({
        asFunction: true,
        client: client
      }, optionsToUse))(idOrIdsToDeleteToUse);
    }
  };
}
module.exports = exports["default"];