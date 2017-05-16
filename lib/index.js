'use strict';

exports.__esModule = true;

var _DataTable = require('./DataTable');

Object.defineProperty(exports, 'DataTable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DataTable).default;
  }
});

var _dataTableUtils = require('./DataTable/dataTableUtils');

Object.defineProperty(exports, 'routeDoubleClick', {
  enumerable: true,
  get: function get() {
    return _dataTableUtils.routeDoubleClick;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }