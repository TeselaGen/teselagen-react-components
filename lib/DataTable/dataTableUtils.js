"use strict";

exports.__esModule = true;
var routeDoubleClick = exports.routeDoubleClick = function routeDoubleClick(row, rowIndex, history) {
  var recordType = row["__typename"];
  var recordId = row["dbId"];
  var route = "/" + recordType + "s" + "/" + recordId;
  history ? history.push(route) : console.warn("router history not passed to datatable");
};