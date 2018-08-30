"use strict";

exports.__esModule = true;
exports.default = getMomentFormatter;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMomentFormatter(format) {
  return {
    formatDate: function formatDate(date) {
      return (0, _moment2.default)(date).format(format);
    },
    parseDate: function parseDate(str) {
      return (0, _moment2.default)(str, format).toDate();
    },
    placeholder: format
  };
}
module.exports = exports["default"];