"use strict";

exports.__esModule = true;

var _lodash = require("lodash");

exports.default = {
  //NOTE: DO NOT SET DEFAULTS HERE FOR PROPS THAT GET COMPUTED AS PART OF PRESET GROUPS IN computePresets
  entities: [],
  noHeader: false,
  pageSize: 10,
  extraClasses: "",
  className: "",
  page: 1,
  style: {},
  isLoading: false,
  isCopyable: true,
  disabled: false,
  noSelect: false,
  noUserSelect: false,
  maxHeight: 800,
  isSimple: false,
  reduxFormSearchInput: {},
  reduxFormSelectedEntityIdMap: {},
  reduxFormExpandedEntityIdMap: {},
  isEntityDisabled: _lodash.noop,
  setSearchTerm: _lodash.noop,
  setFilter: _lodash.noop,
  showCount: false,
  clearFilters: _lodash.noop,
  setPageSize: _lodash.noop,
  setOrder: _lodash.noop,
  setPage: _lodash.noop,
  contextMenu: _lodash.noop,
  onDoubleClick: _lodash.noop,
  onRowSelect: _lodash.noop,
  onRowClick: _lodash.noop,
  onMultiRowSelect: _lodash.noop,
  onSingleRowSelect: _lodash.noop,
  onDeselect: _lodash.noop,
  addFilters: _lodash.noop,
  removeSingleFilter: _lodash.noop,
  resizePersist: _lodash.noop,
  resized: [],
  filters: [],
  isSingleSelect: false,
  withCheckboxes: false,
  withSort: true
};
module.exports = exports["default"];