"use strict";

exports.__esModule = true;

var _apolloCacheInvalidation = require("apollo-cache-invalidation");

var invalidateQueriesOfTypes = function invalidateQueriesOfTypes(typesArray) {
  var invalidations = typesArray.map(function (type) {
    var reType = new RegExp("^" + type + ".*");
    return [_apolloCacheInvalidation.ROOT, reType];
  });
  return (0, _apolloCacheInvalidation.invalidateFields)(function () {
    return invalidations;
  });
};

exports.default = invalidateQueriesOfTypes;
module.exports = exports["default"];