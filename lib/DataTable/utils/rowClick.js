"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = rowClick;
exports.finalizeSelection = finalizeSelection;

var _lodash = require("lodash");

var _selection = require("./selection");

var _getIdOrCodeOrIndex = require("./getIdOrCodeOrIndex");

var _getIdOrCodeOrIndex2 = _interopRequireDefault(_getIdOrCodeOrIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rowClick(e, rowInfo, entities, props) {
  var _newIdMap;

  var reduxFormSelectedEntityIdMap = props.reduxFormSelectedEntityIdMap,
      isSingleSelect = props.isSingleSelect,
      noSelect = props.noSelect,
      onRowClick = props.onRowClick,
      isEntityDisabled = props.isEntityDisabled;

  var entity = rowInfo.original;
  onRowClick(e, entity, rowInfo);
  if (noSelect || isEntityDisabled(entity)) return;
  var rowId = (0, _getIdOrCodeOrIndex2.default)(entity, rowInfo.index);
  if (rowId === undefined) return;

  var ctrl = e.metaKey || e.ctrlKey;
  var oldIdMap = reduxFormSelectedEntityIdMap.input.value || {};
  var rowSelected = oldIdMap[rowId];
  var newIdMap = (_newIdMap = {}, _newIdMap[rowId] = {
    time: new Date(),
    entity: entity
  }, _newIdMap);

  if (isSingleSelect) {
    if (rowSelected) newIdMap = {};
  } else if (rowSelected && e.shiftKey) return;else if (rowSelected && ctrl) {
    newIdMap = _extends({}, oldIdMap);
    delete newIdMap[rowId];
  } else if (rowSelected) {
    newIdMap = {};
  } else if (ctrl) {
    newIdMap = _extends({}, oldIdMap, newIdMap);
  } else if (e.shiftKey && !(0, _lodash.isEmpty)(oldIdMap)) {
    var _newIdMap2;

    newIdMap = (_newIdMap2 = {}, _newIdMap2[rowId] = {
      entity: entity
    }, _newIdMap2);
    var currentlySelectedRowIndices = (0, _selection.getSelectedRowsFromEntities)(entities, oldIdMap);
    if (currentlySelectedRowIndices.length) {
      var timeToBeat = {
        id: null,
        time: null
      };
      (0, _lodash.forEach)(oldIdMap, function (_ref, key) {
        var time = _ref.time;

        if (time && time > timeToBeat.time) timeToBeat = {
          id: key,
          time: time
        };
      });
      var mostRecentlySelectedIndex = entities.findIndex(function (e, i) {
        var id = (0, _getIdOrCodeOrIndex2.default)(e, i);
        if (!id && id !== 0) id = "";
        return id.toString() === timeToBeat.id;
      });

      if (mostRecentlySelectedIndex !== -1) {
        // clear out other selections in current group
        for (var i = mostRecentlySelectedIndex + 1; i < entities.length; i++) {
          var entityId = (0, _getIdOrCodeOrIndex2.default)(entities[i], i);
          if (!oldIdMap[entityId]) break;
          delete oldIdMap[entityId];
        }

        for (var _i = mostRecentlySelectedIndex - 1; _i >= 0; _i--) {
          var _entityId = (0, _getIdOrCodeOrIndex2.default)(entities[_i], _i);
          if (!oldIdMap[_entityId]) break;
          delete oldIdMap[_entityId];
        }

        var highRange = rowInfo.index < mostRecentlySelectedIndex ? mostRecentlySelectedIndex - 1 : rowInfo.index;
        var lowRange = rowInfo.index > mostRecentlySelectedIndex ? mostRecentlySelectedIndex + 1 : rowInfo.index;
        (0, _lodash.range)(lowRange, highRange + 1).forEach(function (i) {
          var recordId = entities[i] && (0, _getIdOrCodeOrIndex2.default)(entities[i], i);
          if (recordId || recordId === 0) newIdMap[recordId] = { entity: entities[i] };
        });
        newIdMap = _extends({}, oldIdMap, newIdMap);
      }
    }
  }

  finalizeSelection({ idMap: newIdMap, props: props });
}

function finalizeSelection(_ref2) {
  var idMap = _ref2.idMap,
      props = _ref2.props;
  var reduxFormSelectedEntityIdMap = props.reduxFormSelectedEntityIdMap,
      entities = props.entities,
      onDeselect = props.onDeselect,
      onSingleRowSelect = props.onSingleRowSelect,
      onMultiRowSelect = props.onMultiRowSelect,
      noDeselectAll = props.noDeselectAll,
      onRowSelect = props.onRowSelect,
      noSelect = props.noSelect;

  if (noSelect) return;
  if (noDeselectAll && Object.keys(idMap).filter(function (id) {
    return idMap[id];
  }).length === 0) {
    return;
  }
  reduxFormSelectedEntityIdMap.input.onChange(idMap);
  var selectedRecords = (0, _selection.getSelectedRecordsFromEntities)(entities, idMap);
  onRowSelect(selectedRecords);

  selectedRecords.length === 0 ? onDeselect() : selectedRecords.length > 1 ? onMultiRowSelect(selectedRecords) : onSingleRowSelect(selectedRecords[0]);
}