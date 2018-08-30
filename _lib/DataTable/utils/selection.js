"use strict";

exports.__esModule = true;
exports.getSelectedRowsFromEntities = exports.getSelectedRecordsFromEntities = undefined;

var _getIdOrCodeOrIndex = require("./getIdOrCodeOrIndex");

var _getIdOrCodeOrIndex2 = _interopRequireDefault(_getIdOrCodeOrIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSelectedRecordsFromEntities = exports.getSelectedRecordsFromEntities = function getSelectedRecordsFromEntities(entities, idMap) {
  if (!idMap) return [];
  return entities.reduce(function (acc, entity, i) {
    return idMap[(0, _getIdOrCodeOrIndex2.default)(entity, i)] ? acc.concat(entity) : acc;
  }, []);
};

var getSelectedRowsFromEntities = exports.getSelectedRowsFromEntities = function getSelectedRowsFromEntities(entities, idMap) {
  if (!idMap) return [];
  return entities.reduce(function (acc, entity, i) {
    return idMap[(0, _getIdOrCodeOrIndex2.default)(entity, i)] ? acc.concat(i) : acc;
  }, []);
};