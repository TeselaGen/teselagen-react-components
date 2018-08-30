"use strict";

exports.__esModule = true;
exports.ConnectedPagingTool = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2, _initialiseProps; /* eslint react/jsx-no-bind: 0 */

// import withQuery from "../enhancers/withQuery";
// import withUpsert from "../enhancers/withUpsert";
// import tableConfigurationFragment from "./utils/tableConfigurationFragment";
// import currentUserFragment from "./utils/currentUserFragment";
// import withDelete from "../enhancers/withDelete";
// import fieldOptionFragment from "./utils/fieldOptionFragment";


var _deepEqual = require("deep-equal");

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _redux = require("redux");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _reactSortableHoc = require("react-sortable-hoc");

var _copyToClipboard = require("copy-to-clipboard");

var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);

var _lodash = require("lodash");

var _core = require("@blueprintjs/core");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _domScrollIntoView = require("dom-scroll-into-view");

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _reactValues = require("react-values");

var _selection = require("./utils/selection");

var _rowClick = require("./utils/rowClick");

var _rowClick2 = _interopRequireDefault(_rowClick);

var _reactTable = require("react-table");

var _reactTable2 = _interopRequireDefault(_reactTable);

var _PagingTool = require("./PagingTool");

var _PagingTool2 = _interopRequireDefault(_PagingTool);

var _FilterAndSortMenu = require("./FilterAndSortMenu");

var _FilterAndSortMenu2 = _interopRequireDefault(_FilterAndSortMenu);

var _getIdOrCodeOrIndex = require("./utils/getIdOrCodeOrIndex");

var _getIdOrCodeOrIndex2 = _interopRequireDefault(_getIdOrCodeOrIndex);

var _SearchBar = require("./SearchBar");

var _SearchBar2 = _interopRequireDefault(_SearchBar);

var _DisplayOptions = require("./DisplayOptions");

var _DisplayOptions2 = _interopRequireDefault(_DisplayOptions);

var _DisabledLoadingComponent = require("./DisabledLoadingComponent");

var _DisabledLoadingComponent2 = _interopRequireDefault(_DisabledLoadingComponent);

var _InfoHelper = require("../InfoHelper");

var _InfoHelper2 = _interopRequireDefault(_InfoHelper);

var _SortableColumns = require("./SortableColumns");

var _SortableColumns2 = _interopRequireDefault(_SortableColumns);

var _recompose = require("recompose");

var _computePresets9 = require("./utils/computePresets");

var _computePresets10 = _interopRequireDefault(_computePresets9);

var _dataTableEnhancer = require("./dataTableEnhancer");

var _dataTableEnhancer2 = _interopRequireDefault(_dataTableEnhancer);

var _defaultProps = require("./defaultProps");

var _defaultProps2 = _interopRequireDefault(_defaultProps);

require("../toastr");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataTable = (_temp2 = _class = function (_React$Component) {
  _inherits(DataTable, _React$Component);

  function DataTable() {
    var _temp, _this, _ret;

    _classCallCheck(this, DataTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  DataTable.prototype.componentDidMount = function componentDidMount() {
    this.updateFromProps({}, (0, _computePresets10.default)(this.props));
  };

  DataTable.prototype.componentDidUpdate = function componentDidUpdate(oldProps) {
    var table = _reactDom2.default.findDOMNode(this.table);
    var tableBody = table.querySelector(".rt-tbody");
    var headerNode = table.querySelector(".rt-thead.-header");
    if (headerNode) headerNode.style.overflowY = "inherit";
    if (tableBody && tableBody.scrollHeight > tableBody.clientHeight) {
      if (headerNode) {
        headerNode.style.overflowY = "scroll";
        headerNode.style.overflowX = "hidden";
      }
    }

    this.updateFromProps((0, _computePresets10.default)(oldProps), (0, _computePresets10.default)(this.props));
  };

  DataTable.prototype.render = function render() {
    var _this2 = this;

    var fullscreen = this.state.fullscreen;

    var _computePresets = (0, _computePresets10.default)(this.props),
        extraClasses = _computePresets.extraClasses,
        className = _computePresets.className,
        tableName = _computePresets.tableName,
        isLoading = _computePresets.isLoading,
        searchTerm = _computePresets.searchTerm,
        setSearchTerm = _computePresets.setSearchTerm,
        clearFilters = _computePresets.clearFilters,
        hidePageSizeWhenPossible = _computePresets.hidePageSizeWhenPossible,
        doNotShowEmptyRows = _computePresets.doNotShowEmptyRows,
        withTitle = _computePresets.withTitle,
        withSearch = _computePresets.withSearch,
        withPaging = _computePresets.withPaging,
        isInfinite = _computePresets.isInfinite,
        disabled = _computePresets.disabled,
        noHeader = _computePresets.noHeader,
        noFooter = _computePresets.noFooter,
        noPadding = _computePresets.noPadding,
        noFullscreenButton = _computePresets.noFullscreenButton,
        withDisplayOptions = _computePresets.withDisplayOptions,
        resized = _computePresets.resized,
        resizePersist = _computePresets.resizePersist,
        updateColumnVisibility = _computePresets.updateColumnVisibility,
        updateTableDisplayDensity = _computePresets.updateTableDisplayDensity,
        localStorageForceUpdate = _computePresets.localStorageForceUpdate,
        syncDisplayOptionsToDb = _computePresets.syncDisplayOptionsToDb,
        resetDefaultVisibility = _computePresets.resetDefaultVisibility,
        maxHeight = _computePresets.maxHeight,
        style = _computePresets.style,
        pageSize = _computePresets.pageSize,
        formName = _computePresets.formName,
        reduxFormSearchInput = _computePresets.reduxFormSearchInput,
        reduxFormSelectedEntityIdMap = _computePresets.reduxFormSelectedEntityIdMap,
        reduxFormExpandedEntityIdMap = _computePresets.reduxFormExpandedEntityIdMap,
        schema = _computePresets.schema,
        filters = _computePresets.filters,
        errorParsingUrlString = _computePresets.errorParsingUrlString,
        userSpecifiedCompact = _computePresets.userSpecifiedCompact,
        hideDisplayOptionsIcon = _computePresets.hideDisplayOptionsIcon,
        compact = _computePresets.compact,
        compactPaging = _computePresets.compactPaging,
        entityCount = _computePresets.entityCount,
        showCount = _computePresets.showCount,
        isSingleSelect = _computePresets.isSingleSelect,
        noSelect = _computePresets.noSelect,
        SubComponent = _computePresets.SubComponent,
        _computePresets$React = _computePresets.ReactTableProps,
        ReactTableProps = _computePresets$React === undefined ? {} : _computePresets$React,
        hideSelectedCount = _computePresets.hideSelectedCount,
        hideColumnHeader = _computePresets.hideColumnHeader,
        subHeader = _computePresets.subHeader,
        isViewable = _computePresets.isViewable,
        entities = _computePresets.entities,
        children = _computePresets.children,
        currentParams = _computePresets.currentParams,
        hasOptionForForcedHidden = _computePresets.hasOptionForForcedHidden,
        showForcedHiddenColumns = _computePresets.showForcedHiddenColumns,
        setShowForcedHidden = _computePresets.setShowForcedHidden;

    var updateColumnVisibilityToUse = updateColumnVisibility;
    var updateTableDisplayDensityToUse = updateTableDisplayDensity;
    var resetDefaultVisibilityToUse = resetDefaultVisibility;
    if (withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      updateColumnVisibilityToUse = function updateColumnVisibilityToUse() {
        updateColumnVisibility.apply(undefined, arguments);
        localStorageForceUpdate.input.onChange(Math.random());
      };
      updateTableDisplayDensityToUse = function updateTableDisplayDensityToUse() {
        updateTableDisplayDensity.apply(undefined, arguments);
        localStorageForceUpdate.input.onChange(Math.random());
      };
      resetDefaultVisibilityToUse = function resetDefaultVisibilityToUse() {
        resetDefaultVisibility.apply(undefined, arguments);
        localStorageForceUpdate.input.onChange(Math.random());
      };
    }
    var compactClassName = "";
    if (compactPaging) {
      compactClassName += " tg-compact-paging";
    }
    if (compact || userSpecifiedCompact) {
      compactClassName += "tg-compact-table";
    }
    var tableId = this.state.tableId;

    var hasFilters = filters.length || searchTerm || schema.fields.some(function (field) {
      return field.filterIsActive && field.filterIsActive(currentParams);
    });
    var additionalFilterKeys = schema.fields.reduce(function (acc, field) {
      if (field.filterKey) acc.push(field.filterKey);
      return acc;
    }, []);
    var filtersOnNonDisplayedFields = [];
    if (filters && filters.length) {
      schema.fields.forEach(function (_ref) {
        var isHidden = _ref.isHidden,
            displayName = _ref.displayName,
            path = _ref.path;

        var ccDisplayName = (0, _lodash.camelCase)(displayName || path);
        if (isHidden) {
          filters.forEach(function (filter) {
            if (filter.filterOn === ccDisplayName) {
              filtersOnNonDisplayedFields.push(_extends({}, filter, {
                displayName: displayName
              }));
            }
          });
        }
      });
    }
    var numRows = isInfinite ? entities.length : pageSize;
    var maybeSpinner = isLoading ? _react2.default.createElement(_core.Spinner, { className: _core.Classes.SMALL }) : undefined;
    var idMap = reduxFormSelectedEntityIdMap.input.value || {};
    var selectedRowCount = Object.keys(idMap).filter(function (key) {
      return idMap[key];
    }).length;

    var rowsToShow = doNotShowEmptyRows ? Math.min(numRows, entities.length) : numRows;
    // if there are no entities then provide enough space to show
    // no rows found message
    if (entities.length === 0 && rowsToShow < 3) rowsToShow = 3;

    var expandedRows = entities.reduce(function (acc, row, index) {
      var rowId = (0, _getIdOrCodeOrIndex2.default)(row, index);
      acc[index] = reduxFormExpandedEntityIdMap.input.value[rowId];
      return acc;
    }, {});
    var showHeader = (withTitle || withSearch || children) && !noHeader;

    var toggleFullscreenButton = _react2.default.createElement(_core.Button, {
      icon: "fullscreen",
      active: fullscreen,
      minimal: true,
      onClick: this.toggleFullscreen
    });

    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)("data-table-container", extraClasses, className, compactClassName, {
          fullscreen: fullscreen,
          "dt-isViewable": isViewable,
          "no-padding": noPadding,
          "hide-column-header": hideColumnHeader
        })
      },
      showHeader && _react2.default.createElement(
        "div",
        { className: "data-table-header" },
        _react2.default.createElement(
          "div",
          { className: "data-table-title-and-buttons" },
          tableName && withTitle && _react2.default.createElement(
            "span",
            { className: "data-table-title" },
            tableName
          ),
          children
        ),
        errorParsingUrlString && _react2.default.createElement(
          _core.Callout,
          { icon: "error", intent: _core.Intent.WARNING },
          "Error parsing URL"
        ),
        filtersOnNonDisplayedFields.length ? filtersOnNonDisplayedFields.map(function (_ref2) {
          var displayName = _ref2.displayName,
              path = _ref2.path,
              selectedFilter = _ref2.selectedFilter,
              filterValue = _ref2.filterValue;

          return _react2.default.createElement(
            "div",
            {
              key: displayName || (0, _lodash.startCase)(path),
              className: "tg-filter-on-non-displayed-field"
            },
            _react2.default.createElement(_core.Icon, { icon: "filter" }),
            _react2.default.createElement(
              "span",
              null,
              " ",
              displayName || (0, _lodash.startCase)(path),
              " ",
              selectedFilter,
              " ",
              filterValue,
              " "
            )
          );
        }) : "",
        withSearch && _react2.default.createElement(
          "div",
          { className: "data-table-search-and-clear-filter-container" },
          hasFilters ? _react2.default.createElement(_core.Button, {
            disabled: disabled,
            className: "data-table-clear-filters",
            onClick: function onClick() {
              clearFilters(additionalFilterKeys);
            },
            text: "Clear filters"
          }) : "",
          _react2.default.createElement(_SearchBar2.default, {
            reduxFormSearchInput: reduxFormSearchInput,
            setSearchTerm: setSearchTerm,
            maybeSpinner: maybeSpinner,
            disabled: disabled
          })
        )
      ),
      subHeader,
      _react2.default.createElement(_reactTable2.default, _extends({
        data: entities,
        ref: function ref(n) {
          if (n) _this2.table = n;
        },
        columns: this.renderColumns(),
        pageSize: rowsToShow,
        expanded: expandedRows,
        showPagination: false,
        sortable: false,
        loading: isLoading || disabled,
        defaultResized: resized,
        onResizedChange: function onResizedChange(newResized) {
          resizePersist(newResized);
        },
        getTbodyProps: function getTbodyProps() {
          return {
            id: tableId
          };
        },
        TheadComponent: this.getTheadComponent,
        ThComponent: this.getThComponent,
        getTrGroupProps: this.getTableRowProps,
        NoDataComponent: function NoDataComponent(_ref3) {
          var children = _ref3.children;
          return isLoading ? null : _react2.default.createElement(
            "div",
            { className: "rt-noData" },
            children
          );
        },
        LoadingComponent: function LoadingComponent(props) {
          return _react2.default.createElement(_DisabledLoadingComponent2.default, _extends({}, props, { disabled: disabled }));
        },
        style: _extends({
          maxHeight: maxHeight,
          minHeight: 150
        }, style),
        SubComponent: SubComponent
      }, ReactTableProps)),
      !noFooter && _react2.default.createElement(
        "div",
        {
          className: "data-table-footer",
          style: {
            justifyContent: isSingleSelect || hideSelectedCount ? "flex-end" : "space-between"
          }
        },
        !noSelect && !isSingleSelect && !hideSelectedCount && _react2.default.createElement(
          "div",
          { className: "tg-react-table-selected-count" },
          selectedRowCount + " Record" + (selectedRowCount === 1 ? "" : "s") + " Selected "
        ),
        showCount && entityCount + " " + (entityCount === 1 ? "Record" : "Total Records"),
        _react2.default.createElement(
          "div",
          { style: { display: "flex", flexWrap: "wrap" } },
          !noFullscreenButton && toggleFullscreenButton,
          withDisplayOptions && _react2.default.createElement(_DisplayOptions2.default, {
            disabled: disabled,
            hideDisplayOptionsIcon: hideDisplayOptionsIcon,
            resetDefaultVisibility: resetDefaultVisibilityToUse,
            updateColumnVisibility: updateColumnVisibilityToUse,
            updateTableDisplayDensity: updateTableDisplayDensityToUse,
            userSpecifiedCompact: userSpecifiedCompact,
            showForcedHiddenColumns: showForcedHiddenColumns,
            setShowForcedHidden: setShowForcedHidden,
            hasOptionForForcedHidden: hasOptionForForcedHidden,
            formName: formName,
            schema: schema
          }),
          !isInfinite && withPaging && (hidePageSizeWhenPossible ? entityCount > pageSize : true) ? _react2.default.createElement(_PagingTool2.default, (0, _computePresets10.default)(this.props)) : null
        )
      )
    );
  };

  return DataTable;
}(_react2.default.Component), _class.defaultProps = _defaultProps2.default, _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.state = {
    columns: [],
    fullscreen: false
  };

  this.toggleFullscreen = function () {
    _this3.setState({
      fullscreen: !_this3.state.fullscreen
    });
  };

  this.updateFromProps = function (oldProps, newProps) {
    var selectedIds = newProps.selectedIds,
        entities = newProps.entities,
        isEntityDisabled = newProps.isEntityDisabled,
        expandAllByDefault = newProps.expandAllByDefault,
        selectAllByDefault = newProps.selectAllByDefault,
        reduxFormSelectedEntityIdMap = newProps.reduxFormSelectedEntityIdMap,
        reduxFormExpandedEntityIdMap = newProps.reduxFormExpandedEntityIdMap;

    //handle programatic filter adding

    if (!(0, _deepEqual2.default)(newProps.additionalFilters, oldProps.additionalFilters)) {
      newProps.addFilters(newProps.additionalFilters);
    }
    if (!(0, _deepEqual2.default)(newProps.schema, oldProps.schema)) {
      var _newProps$schema = newProps.schema,
          schema = _newProps$schema === undefined ? {} : _newProps$schema;

      var columns = schema.fields ? schema.fields.reduce(function (columns, field, i) {
        if (field.isHidden) {
          return columns;
        }
        return columns.concat(_extends({}, field, {
          columnIndex: i
        }));
      }, []) : [];
      _this3.setState({ columns: columns });
    }
    //handle selecting all or expanding all
    if ((selectAllByDefault || expandAllByDefault) && !(0, _deepEqual2.default)(newProps.entities.map(function (_ref4) {
      var id = _ref4.id;
      return id;
    }), oldProps.entities && oldProps.entities.map(function (_ref5) {
      var id = _ref5.id;
      return id;
    }))) {
      if (selectAllByDefault) {
        reduxFormSelectedEntityIdMap.input.onChange(_extends({}, entities.reduce(function (acc, entity) {
          acc[entity.id] = { entity: entity };
          return acc;
        }, {}), reduxFormSelectedEntityIdMap.input.value || {}));
      }
      if (expandAllByDefault) {
        reduxFormExpandedEntityIdMap.input.onChange(_extends({}, entities.reduce(function (acc, e) {
          acc[e.id] = true;
          return acc;
        }, {}), reduxFormExpandedEntityIdMap.input.value || {}));
      }
    }

    // handle programmatic selection and scrolling

    var oldSelectedIds = oldProps.selectedIds;

    if ((0, _lodash.isEqual)(selectedIds, oldSelectedIds)) return;
    var idArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    var selectedEntities = entities.filter(function (e) {
      return idArray.indexOf((0, _getIdOrCodeOrIndex2.default)(e)) > -1 && !isEntityDisabled(e);
    });
    var newIdMap = selectedEntities.reduce(function (acc, entity) {
      acc[(0, _getIdOrCodeOrIndex2.default)(entity)] = { entity: entity };
      return acc;
    }, {});
    (0, _rowClick.finalizeSelection)({ idMap: newIdMap, props: newProps });
    var idToScrollTo = idArray[0];
    if (!idToScrollTo && idToScrollTo !== 0) return;
    var entityIndexToScrollTo = entities.findIndex(function (e) {
      return e.id === idToScrollTo || e.code === idToScrollTo;
    });
    var table = _reactDom2.default.findDOMNode(_this3.table);
    if (entityIndexToScrollTo === -1 || !table) return;
    var tableBody = table.querySelector(".rt-tbody");
    if (!tableBody) return;
    var rowEl = tableBody.getElementsByClassName("rt-tr-group")[entityIndexToScrollTo];
    if (!rowEl) return;
    (0, _domScrollIntoView2.default)(rowEl, tableBody, {
      alignWithTop: true
    });
  };

  this.moveColumn = function (_ref6) {
    var oldIndex = _ref6.oldIndex,
        newIndex = _ref6.newIndex;
    var columns = _this3.state.columns;

    var oldStateColumnIndex = void 0,
        newStateColumnIndex = void 0;
    columns.forEach(function (column, i) {
      if (oldIndex === column.columnIndex) oldStateColumnIndex = i;
      if (newIndex === column.columnIndex) newStateColumnIndex = i;
    });
    // because it is all handled in state we need
    // to perform the move and update the columnIndices
    // because they are used for the sortable columns
    var newColumns = (0, _reactSortableHoc.arrayMove)(columns, oldStateColumnIndex, newStateColumnIndex).map(function (column, i) {
      return _extends({}, column, {
        columnIndex: i
      });
    });
    _this3.setState({
      columns: newColumns
    });
  };

  this.getTheadComponent = function (props) {
    var _computePresets2 = (0, _computePresets10.default)(_this3.props),
        withDisplayOptions = _computePresets2.withDisplayOptions,
        moveColumnPersist = _computePresets2.moveColumnPersist,
        localStorageForceUpdate = _computePresets2.localStorageForceUpdate,
        syncDisplayOptionsToDb = _computePresets2.syncDisplayOptionsToDb;

    var moveColumnPersistToUse = moveColumnPersist;
    if (moveColumnPersist && withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      moveColumnPersistToUse = function moveColumnPersistToUse() {
        moveColumnPersist.apply(undefined, arguments);
        localStorageForceUpdate.input.onChange(Math.random());
      };
    }
    return _react2.default.createElement(_SortableColumns2.default, _extends({}, props, {
      withDisplayOptions: withDisplayOptions,
      moveColumn: moveColumnPersistToUse || _this3.moveColumn
    }));
  };

  this.getThComponent = (0, _redux.compose)((0, _recompose.withProps)(function (props) {
    var columnindex = props.columnindex;

    return {
      index: columnindex || 0
    };
  }), (0, _recompose.branch)(function (_ref7) {
    var immovable = _ref7.immovable;
    return "true" !== immovable;
  }, _reactSortableHoc.SortableElement))(function (_ref8) {
    var toggleSort = _ref8.toggleSort,
        className = _ref8.className,
        children = _ref8.children,
        rest = _objectWithoutProperties(_ref8, ["toggleSort", "className", "children"]);

    return _react2.default.createElement(
      "div",
      _extends({
        className: (0, _classnames2.default)("rt-th", className),
        onClick: function onClick(e) {
          return toggleSort && toggleSort(e);
        },
        role: "columnheader",
        tabIndex: "-1" // Resolves eslint issues without implementing keyboard navigation incorrectly
      }, rest),
      children
    );
  });

  this.getTableRowProps = function (state, rowInfo) {
    var _computePresets3 = (0, _computePresets10.default)(_this3.props),
        reduxFormSelectedEntityIdMap = _computePresets3.reduxFormSelectedEntityIdMap,
        reduxFormExpandedEntityIdMap = _computePresets3.reduxFormExpandedEntityIdMap,
        withCheckboxes = _computePresets3.withCheckboxes,
        _onDoubleClick = _computePresets3.onDoubleClick,
        history = _computePresets3.history,
        entities = _computePresets3.entities,
        isEntityDisabled = _computePresets3.isEntityDisabled;

    if (!rowInfo) return {};
    var entity = rowInfo.original;
    var rowId = (0, _getIdOrCodeOrIndex2.default)(entity, rowInfo.index);
    var rowSelected = reduxFormSelectedEntityIdMap.input.value[rowId];
    var isExpanded = reduxFormExpandedEntityIdMap.input.value[rowId];
    var rowDisabled = isEntityDisabled(entity);
    return {
      onClick: function onClick(e) {
        // if checkboxes are activated or row expander is clicked don't select row
        if (e.target.matches(".tg-expander, .tg-expander *")) {
          var _extends2;

          reduxFormExpandedEntityIdMap.input.onChange(_extends({}, reduxFormExpandedEntityIdMap.input.value, (_extends2 = {}, _extends2[rowId] = !isExpanded, _extends2)));
          return;
        } else if (withCheckboxes) {
          return;
        }
        (0, _rowClick2.default)(e, rowInfo, entities, (0, _computePresets10.default)(_this3.props));
      },
      onContextMenu: function onContextMenu(e) {
        e.preventDefault();
        if (rowId === undefined || rowDisabled) return;
        var oldIdMap = (0, _lodash.cloneDeep)(reduxFormSelectedEntityIdMap.input.value) || {};
        var newIdMap = void 0;
        if (withCheckboxes) {
          newIdMap = oldIdMap;
        } else {
          var _ref9;

          // if we are not using checkboxes we need to make sure
          // that the id of the record gets added to the id map
          newIdMap = oldIdMap[rowId] ? oldIdMap : (_ref9 = {}, _ref9[rowId] = { entity: entity }, _ref9);
          (0, _rowClick.finalizeSelection)({
            idMap: newIdMap,
            props: (0, _computePresets10.default)(_this3.props)
          });
        }
        _this3.showContextMenu(newIdMap, e, entity);
      },
      className: rowSelected && !withCheckboxes ? "selected" : "",
      onDoubleClick: function onDoubleClick() {
        if (rowDisabled) return;
        _onDoubleClick(rowInfo.original, rowInfo.index, history);
      }
    };
  };

  this.renderCheckboxHeader = function () {
    var _computePresets4 = (0, _computePresets10.default)(_this3.props),
        reduxFormSelectedEntityIdMap = _computePresets4.reduxFormSelectedEntityIdMap,
        isSingleSelect = _computePresets4.isSingleSelect,
        noSelect = _computePresets4.noSelect,
        noUserSelect = _computePresets4.noUserSelect,
        entities = _computePresets4.entities,
        isEntityDisabled = _computePresets4.isEntityDisabled;

    var checkedRows = (0, _selection.getSelectedRowsFromEntities)(entities, reduxFormSelectedEntityIdMap.input.value);
    var checkboxProps = {
      checked: false,
      indeterminate: false
    };
    var notDisabledEntityCount = entities.reduce(function (acc, e) {
      return isEntityDisabled(e) ? acc : acc + 1;
    }, 0);
    if (checkedRows.length === notDisabledEntityCount) {
      //tnr: maybe this will need to change if we want enable select all across pages
      checkboxProps.checked = notDisabledEntityCount !== 0;
    } else {
      if (checkedRows.length) {
        checkboxProps.indeterminate = true;
      }
    }

    return !isSingleSelect ? _react2.default.createElement(_core.Checkbox, _extends({
      disabled: noSelect || noUserSelect
      /* eslint-disable react/jsx-no-bind */
      , onChange: function onChange() {
        var newIdMap = (0, _lodash.cloneDeep)(reduxFormSelectedEntityIdMap.input.value) || {};
        entities.forEach(function (entity, i) {
          if (isEntityDisabled(entity)) return;
          var entityId = (0, _getIdOrCodeOrIndex2.default)(entity, i);
          if (checkboxProps.checked) {
            newIdMap[entityId] = false;
          } else {
            newIdMap[entityId] = { entity: entity };
          }
        });

        (0, _rowClick.finalizeSelection)({
          idMap: newIdMap,
          props: (0, _computePresets10.default)(_this3.props)
        });
        _this3.setState({ lastCheckedRow: undefined });
      }
      /* eslint-enable react/jsx-no-bind */
    }, checkboxProps)) : null;
  };

  this.renderCheckboxCell = function (row) {
    var rowIndex = row.index;

    var _computePresets5 = (0, _computePresets10.default)(_this3.props),
        reduxFormSelectedEntityIdMap = _computePresets5.reduxFormSelectedEntityIdMap,
        isSingleSelect = _computePresets5.isSingleSelect,
        noSelect = _computePresets5.noSelect,
        noUserSelect = _computePresets5.noUserSelect,
        entities = _computePresets5.entities,
        isEntityDisabled = _computePresets5.isEntityDisabled;

    var checkedRows = (0, _selection.getSelectedRowsFromEntities)(entities, reduxFormSelectedEntityIdMap.input.value);

    var lastCheckedRow = _this3.state.lastCheckedRow;


    var isSelected = checkedRows.some(function (rowNum) {
      return rowNum === rowIndex;
    });
    if (rowIndex >= entities.length) {
      return _react2.default.createElement("div", null);
    }
    var entity = entities[rowIndex];
    return _react2.default.createElement(_core.Checkbox, {
      disabled: noSelect || noUserSelect || isEntityDisabled(entity)
      /* eslint-disable react/jsx-no-bind*/
      , onChange: function onChange(e) {
        var newIdMap = (0, _lodash.cloneDeep)(reduxFormSelectedEntityIdMap.input.value) || {};
        var isRowCurrentlyChecked = checkedRows.indexOf(rowIndex) > -1;
        var entityId = (0, _getIdOrCodeOrIndex2.default)(entity, rowIndex);
        if (isSingleSelect) {
          var _newIdMap;

          newIdMap = (_newIdMap = {}, _newIdMap[entityId] = {
            entity: entity
          }, _newIdMap);
        } else if (e.shiftKey && rowIndex !== lastCheckedRow) {
          var start = rowIndex;
          var end = lastCheckedRow;
          for (var i = Math.min(start, end); i < Math.max(start, end) + 1; i++) {
            var isLastCheckedRowCurrentlyChecked = checkedRows.indexOf(lastCheckedRow) > -1;
            var tempEntity = entities[i];
            var tempEntityId = (0, _getIdOrCodeOrIndex2.default)(tempEntity, i);
            if (isLastCheckedRowCurrentlyChecked) {
              newIdMap[tempEntityId] = {
                entity: tempEntity
              };
            } else {
              newIdMap[tempEntityId] = false;
            }
          }
        } else {
          //no shift key
          if (isRowCurrentlyChecked) {
            newIdMap[entityId] = false;
          } else {
            newIdMap[entityId] = { entity: entity };
          }
        }

        (0, _rowClick.finalizeSelection)({
          idMap: newIdMap,
          props: (0, _computePresets10.default)(_this3.props)
        });
        _this3.setState({ lastCheckedRow: rowIndex });
      }
      /* eslint-enable react/jsx-no-bind*/
      , checked: isSelected
    });
  };

  this.renderColumns = function () {
    var _computePresets6 = (0, _computePresets10.default)(_this3.props),
        cellRenderer = _computePresets6.cellRenderer,
        withCheckboxes = _computePresets6.withCheckboxes,
        SubComponent = _computePresets6.SubComponent,
        entities = _computePresets6.entities,
        getCellHoverText = _computePresets6.getCellHoverText,
        withExpandAndCollapseAllButton = _computePresets6.withExpandAndCollapseAllButton,
        reduxFormExpandedEntityIdMap = _computePresets6.reduxFormExpandedEntityIdMap;

    var columns = _this3.state.columns;

    if (!columns.length) {
      return columns;
    }
    var columnsToRender = [].concat(SubComponent ? [_extends({}, withExpandAndCollapseAllButton && {
      Header: function Header() {
        var showCollapseAll = Object.values(reduxFormExpandedEntityIdMap.input.value).filter(function (i) {
          return i;
        }).length === entities.length;
        return _react2.default.createElement(_InfoHelper2.default, {
          content: showCollapseAll ? "Collapse All" : "Expand All",
          isButton: true,
          popoverProps: {
            modifiers: {
              preventOverflow: { enabled: false },
              hide: { enabled: false }
            }
          },
          onClick: function onClick() {
            showCollapseAll ? reduxFormExpandedEntityIdMap.input.onChange({}) : reduxFormExpandedEntityIdMap.input.onChange(entities.reduce(function (acc, e) {
              acc[e.id] = true;
              return acc;
            }, {}));
          },
          className: (0, _classnames2.default)("tg-expander-all", _core.Classes.MINIMAL, _core.Classes.SMALL),
          icon: showCollapseAll ? "chevron-down" : "chevron-right"
        });
      }
    }, {
      expander: true,
      Expander: function Expander(_ref10) {
        var isExpanded = _ref10.isExpanded;

        return _react2.default.createElement(_core.Button, {
          className: (0, _classnames2.default)("tg-expander", _core.Classes.MINIMAL, _core.Classes.SMALL),
          icon: isExpanded ? "chevron-down" : "chevron-right"
        });
      }
    })] : [], withCheckboxes ? [{
      Header: _this3.renderCheckboxHeader,
      Cell: _this3.renderCheckboxCell,
      width: 35,
      resizable: false,
      getHeaderProps: function getHeaderProps() {
        return {
          className: "tg-react-table-checkbox-header-container",
          immovable: "true"
        };
      },
      getProps: function getProps() {
        return {
          className: "tg-react-table-checkbox-cell-container"
        };
      }
    }] : []);
    columns.forEach(function (column) {
      var tableColumn = _extends({}, column, {
        Header: _this3.renderColumnHeader(column),
        accessor: column.path,
        getHeaderProps: function getHeaderProps() {
          return {
            // needs to be a string because it is getting passed
            // to the dom
            immovable: column.immovable ? "true" : "false",
            columnindex: column.columnIndex
          };
        }
      });
      if (column.width) {
        tableColumn.width = column.width;
      }
      if (cellRenderer && cellRenderer[column.path]) {
        tableColumn.Cell = function (row) {
          var val = cellRenderer[column.path](row.value, row.original, row);
          return val;
        };
      } else if (column.render) {
        tableColumn.Cell = function (row) {
          var val = column.render(row.value, row.original, row, _this3.props);
          return val;
        };
      } else if (column.type === "timestamp") {
        tableColumn.Cell = function (props) {
          return props.value ? (0, _moment2.default)(props.value).format("lll") : "";
        };
      } else if (column.type === "boolean") {
        tableColumn.Cell = function (props) {
          return props.value ? "True" : "False";
        };
      } else {
        tableColumn.Cell = function (props) {
          return props.value;
        };
      }
      var oldFunc = tableColumn.Cell;
      tableColumn.Cell = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        //wrap the original tableColumn.Cell function in another div in order to add a title attribute
        var val = oldFunc.apply(undefined, args);
        var title = typeof val !== "string" ? args[0].value : val;
        if (title) title = String(title);
        if (getCellHoverText) title = getCellHoverText.apply(undefined, args);
        return _react2.default.createElement(
          "div",
          {
            style: column.noEllipsis ? {} : { textOverflow: "ellipsis", overflow: "hidden" },
            title: title || undefined
          },
          val
        );
      };

      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  this.setManyRowsToCopy = function (selectedRecords) {
    var columns = _this3.state.columns;

    var allRowsText = [];
    selectedRecords.forEach(function (record) {
      var textForRow = [];
      columns.forEach(function (col) {
        var text = (0, _lodash.get)(record, col.path);
        if (col.getClipboardData) {
          text = col.getClipboardData(text, record);
        } else if (text !== undefined) text = String(text);else text = " ";
        if (text) {
          textForRow.push(text);
        }
      });
      allRowsText.push(textForRow.join("\t"));
    });
    return allRowsText.join("\n");
  };

  this.showContextMenu = function (idMap, e) {
    var _computePresets7 = (0, _computePresets10.default)(_this3.props),
        history = _computePresets7.history,
        contextMenu = _computePresets7.contextMenu,
        entities = _computePresets7.entities,
        isCopyable = _computePresets7.isCopyable;

    var selectedRecords = (0, _selection.getSelectedRecordsFromEntities)(entities, idMap);
    var itemsToRender = contextMenu({
      selectedRecords: selectedRecords,
      history: history
    });
    if (!itemsToRender && !isCopyable) return null;
    var menu = _react2.default.createElement(
      _core.Menu,
      null,
      itemsToRender,
      isCopyable && selectedRecords.length > 0 && _react2.default.createElement(_core.MenuItem, {
        key: "copySelectedRows",
        onClick: function onClick() {
          (0, _copyToClipboard2.default)(_this3.setManyRowsToCopy(selectedRecords));
          window.toastr.success("Selected rows copied");
        },
        icon: "clipboard",
        text: "Copy Rows to Clipboard"
      })
    );
    _core.ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
  };

  this.renderColumnHeader = function (column) {
    var _computePresets8 = (0, _computePresets10.default)(_this3.props),
        addFilters = _computePresets8.addFilters,
        setOrder = _computePresets8.setOrder,
        order = _computePresets8.order,
        withFilter = _computePresets8.withFilter,
        withSort = _computePresets8.withSort,
        filters = _computePresets8.filters,
        removeSingleFilter = _computePresets8.removeSingleFilter,
        currentParams = _computePresets8.currentParams,
        isLocalCall = _computePresets8.isLocalCall,
        setNewParams = _computePresets8.setNewParams;

    var displayName = column.displayName,
        sortDisabled = column.sortDisabled,
        filterDisabled = column.filterDisabled,
        renderTitleInner = column.renderTitleInner,
        _column$filterIsActiv = column.filterIsActive,
        filterIsActive = _column$filterIsActiv === undefined ? _lodash.noop : _column$filterIsActiv,
        noTitle = column.noTitle,
        path = column.path;

    var disableSorting = sortDisabled || !isLocalCall && typeof path === "string" && path.includes(".");
    var columnDataType = column.type;
    var isActionColumn = columnDataType === "action";
    var ccDisplayName = (0, _lodash.camelCase)(displayName || path);
    var columnTitle = displayName || (0, _lodash.startCase)(path);
    if (isActionColumn) columnTitle = "";
    var currentFilter = filters && filters.length && filters.filter(function (_ref11) {
      var filterOn = _ref11.filterOn;

      return filterOn === ccDisplayName;
    })[0];
    var filterActiveForColumn = !!currentFilter || filterIsActive(currentParams);
    var ordering = void 0;
    if (order && order.length) {
      order.forEach(function (order) {
        var orderField = order.replace("-", "");
        if (orderField === ccDisplayName) {
          if (orderField === order) {
            ordering = "asc";
          } else {
            ordering = "desc";
          }
        }
      });
    }

    var sortDown = ordering && ordering === "asc";
    var sortUp = ordering && !sortDown;
    var sortComponent = withSort && !disableSorting && !isActionColumn ? _react2.default.createElement(
      "div",
      { className: "tg-sort-arrow-container" },
      _react2.default.createElement(_core.Icon, {
        title: "Sort Z-A (Hold shift to sort multiple columns)",
        icon: "chevron-up",
        color: sortUp ? "#106ba3" : "",
        style: {
          display: sortUp ? "inherit" : undefined
        },
        iconSize: 12,
        onClick: function onClick(e) {
          setOrder("-" + ccDisplayName, sortUp, e.shiftKey);
        }
      }),
      _react2.default.createElement(_core.Icon, {
        title: "Sort A-Z (Hold shift to sort multiple columns)",
        icon: "chevron-down",
        color: sortDown ? "#106ba3" : "",
        iconSize: 12,
        style: {
          display: sortDown ? "inherit" : undefined
        },
        onClick: function onClick(e) {
          setOrder(ccDisplayName, sortDown, e.shiftKey);
        }
      })
    ) : null;
    var FilterMenu = column.FilterMenu || _FilterAndSortMenu2.default;
    var filterMenu = withFilter && !isActionColumn && !filterDisabled ? _react2.default.createElement(
      _reactValues.BooleanValue,
      { defaultValue: false },
      function (_ref12) {
        var value = _ref12.value,
            toggle = _ref12.toggle,
            clear = _ref12.clear;

        return _react2.default.createElement(
          _core.Popover,
          {
            position: "bottom",
            onClose: function onClose() {
              clear();
            },
            isOpen: value,
            modifiers: {
              preventOverflow: { enabled: false },
              hide: { enabled: false }
            }
          },
          _react2.default.createElement(_core.Icon, {
            style: { marginLeft: 5 },
            icon: "filter",
            onClick: toggle,
            className: (0, _classnames2.default)("tg-filter-menu-button", {
              "tg-active-filter": !!filterActiveForColumn
            })
          }),
          _react2.default.createElement(FilterMenu, {
            addFilters: addFilters,
            togglePopover: clear,
            removeSingleFilter: removeSingleFilter,
            currentFilter: currentFilter,
            filterOn: ccDisplayName,
            dataType: columnDataType,
            schemaForField: column,
            currentParams: currentParams,
            setNewParams: setNewParams
          })
        );
      }
    ) : null;

    return _react2.default.createElement(
      "div",
      { className: "tg-react-table-column-header" },
      (displayName || (0, _lodash.startCase)(path)) && !noTitle && _react2.default.createElement(
        "span",
        { title: columnTitle, className: "tg-react-table-name" },
        renderTitleInner ? renderTitleInner : columnTitle
      ),
      sortComponent,
      filterMenu
    );
  };
}, _temp2);
exports.default = (0, _dataTableEnhancer2.default)(DataTable);

var ConnectedPagingTool = (0, _dataTableEnhancer2.default)(_PagingTool2.default);
exports.ConnectedPagingTool = ConnectedPagingTool;