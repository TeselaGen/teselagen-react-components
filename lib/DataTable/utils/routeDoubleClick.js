"use strict";

exports.__esModule = true;
exports.default = routeDoubleClick;

var _pluralize = require("pluralize");

var _pluralize2 = _interopRequireDefault(_pluralize);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routeDoubleClick(row, rowIndex, history) {
  var recordType = row["__typename"] || "";
  var recordId = row["dbId"] || row["id"];
  var route = "/" + (0, _pluralize2.default)((0, _lodash.kebabCase)(recordType)) + "/" + recordId;
  history ? history.push(route) : console.warn("react router history not passed to datatable");
}
module.exports = exports["default"];