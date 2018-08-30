"use strict";

exports.__esModule = true;

exports.default = function (record, rowIndex) {
  if (record.id || record.id === 0) {
    return record.id;
  } else if (record.code) {
    return record.code;
  } else {
    return rowIndex;
  }
};

module.exports = exports["default"];