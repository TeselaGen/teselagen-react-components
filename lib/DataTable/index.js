"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2, _class2, _temp3, _initialiseProps;

require("../toastr");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _times = require("lodash/times");

var _times2 = _interopRequireDefault(_times);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _debounce = require("lodash/debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _pagingToolbar = require("./pagingToolbar");

var _pagingToolbar2 = _interopRequireDefault(_pagingToolbar);

var _map = require("lodash/map");

var _map2 = _interopRequireDefault(_map);

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _datetime = require("@blueprintjs/datetime");

require("./style.css");

var _reactMeasure = require("react-measure");

var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

var _reduxForm = require("redux-form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function noop() {}
var DataTable = (_temp2 = _class = function (_React$Component) {
  _inherits(DataTable, _React$Component);

  function DataTable() {
    var _temp, _this, _ret;

    _classCallCheck(this, DataTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      dimensions: {
        width: -1
      },
      selectedRegions: []
    }, _this.renderColumns = function () {
      var _this$props = _this.props,
          columns = _this$props.columns,
          schema = _this$props.schema;

      if (!columns.length) {
        return;
      }
      var columnsToRender = [];
      columns.forEach(function (column, index) {
        var name = schema.fields[column].displayName;
        columnsToRender.push(_react2.default.createElement(_table.Column, {
          key: index,
          name: name,
          renderCell: _this.renderCell,
          renderColumnHeader: _this.renderColumnHeader
        }));
      });
      return columnsToRender;
    }, _this.renderCell = function (rowIndex, columnIndex) {
      var _this$props2 = _this.props,
          entities = _this$props2.entities,
          schema = _this$props2.schema,
          columns = _this$props2.columns,
          history = _this$props2.history,
          onDoubleClick = _this$props2.onDoubleClick,
          cellRenderer = _this$props2.cellRenderer;

      var columnName = columns[columnIndex];
      var row = entities[rowIndex];
      if (!row) return _react2.default.createElement(_table.Cell, null);
      var schemaForColumn = schema.fields[columnName];
      var cellData = void 0;
      if (schemaForColumn.path) {
        cellData = (0, _get2.default)(row, schemaForColumn.path);
      } else {
        cellData = row[columnName];
      }
      if (schemaForColumn.type === "timestamp") {
        cellData = (0, _moment2.default)(cellData).format("MMM D, YYYY");
      }
      if (cellRenderer && cellRenderer[columnName]) {
        cellData = cellRenderer[columnName](cellData);
      }
      return _react2.default.createElement(
        _table.Cell,
        null,
        onDoubleClick ? _react2.default.createElement(
          "div",
          {
            className: "clickable-cell",
            onDoubleClick: function (_onDoubleClick) {
              function onDoubleClick() {
                return _onDoubleClick.apply(this, arguments);
              }

              onDoubleClick.toString = function () {
                return _onDoubleClick.toString();
              };

              return onDoubleClick;
            }(function () {
              onDoubleClick(row, rowIndex, history);
            })
          },
          cellData
        ) : cellData
      );
    }, _this.renderBodyContextMenu = function (_ref) {
      var regions = _ref.regions;
      var _this$props3 = _this.props,
          entities = _this$props3.entities,
          history = _this$props3.history,
          customMenuItems = _this$props3.customMenuItems;
      //single selection

      var defaultMenuItems = {
        view: function view(recordData, history) {
          var recordId = recordData.dbId;
          var route = "/" + recordData["__typename"] + "s" + "/" + recordId;
          return _react2.default.createElement(_core.MenuItem
          // iconName={showFilterBy ? "caret-down" : "caret-right"}
          , {
            key: recordId,
            iconName: "eye-open",
            onClick: function onClick() {
              history.push(route);
            },
            text: "View"
          });
        },
        delete: function _delete() {
          return _react2.default.createElement(_core.MenuItem, { iconName: "trash", onClick: function onClick() {}, text: "Delete" });
        }
      };

      var menuItems = _extends({}, defaultMenuItems, customMenuItems || {});

      if (regions.length === 1) {
        if (regions[0].rows) {
          if (regions[0].rows[0] === regions[0].rows[1]) {
            var selectedRow = regions[0].rows[0];
            var recordData = entities[selectedRow];
            return _react2.default.createElement(
              _core.Menu,
              null,
              (0, _map2.default)(menuItems, function (menuItemGenerator) {
                return menuItemGenerator(recordData, history);
              })
            );
          }
        }
      }
      return null;
    }, _this.renderColumnHeader = function (columnIndex) {
      var _this$props4 = _this.props,
          columns = _this$props4.columns,
          schema = _this$props4.schema,
          setFilter = _this$props4.setFilter,
          setOrder = _this$props4.setOrder,
          order = _this$props4.order;


      var fieldName = columns[columnIndex];
      var schemaForField = schema.fields[fieldName];
      var displayName = schemaForField.displayName;

      var columnDataType = schema.fields[fieldName].type;

      var ordering = void 0;
      if (order) {
        var orderField = order.replace("reverse:", "");
        if (orderField === fieldName) {
          if (orderField === order) {
            ordering = "asc";
          } else {
            ordering = "desc";
          }
        }
      }
      // const menu = this.renderMenu(columnDataType, schemaForField);
      return _react2.default.createElement(_table.ColumnHeaderCell, {
        name: _react2.default.createElement(
          "span",
          null,
          displayName + "  ",
          ordering && (ordering === "asc" ? _react2.default.createElement("span", { className: "pt-icon-standard pt-icon-arrow-down" }) : _react2.default.createElement("span", { className: "pt-icon-standard pt-icon-arrow-up" }))
        ),
        menu: _react2.default.createElement(FilterAndSortMenu, {
          setFilter: setFilter,
          setOrder: setOrder,
          fieldName: fieldName,
          dataType: columnDataType,
          schemaForField: schemaForField
        })
      });
    }, _this.selectedRegionTransform = function (region) {
      // convert cell selection to row selection
      if (_table.Regions.getRegionCardinality(region) === _table.RegionCardinality.CELLS) {
        return _table.Regions.row(region.rows[0], region.rows[1]);
      }
      return region;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DataTable.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        entities = _props.entities,
        extraClasses = _props.extraClasses,
        tableName = _props.tableName,
        isLoading = _props.isLoading,
        columns = _props.columns,
        searchTerm = _props.searchTerm,
        entityCount = _props.entityCount,
        setSearchTerm = _props.setSearchTerm,
        clearFilters = _props.clearFilters,
        setPageSize = _props.setPageSize,
        setPage = _props.setPage,
        withTitle = _props.withTitle,
        withSearch = _props.withSearch,
        withPaging = _props.withPaging,
        isInfinite = _props.isInfinite,
        onSingleRowSelect = _props.onSingleRowSelect,
        onDeselect = _props.onDeselect,
        onMultiRowSelect = _props.onMultiRowSelect,
        page = _props.page,
        pageSize = _props.pageSize,
        selectedFilter = _props.selectedFilter;
    var dimensions = this.state.dimensions;
    var width = dimensions.width;


    var setPageSizeDebounced = (0, _debounce2.default)(function (pageSize) {
      setPageSize(pageSize);
    }, 300);

    var hasFilters = selectedFilter || searchTerm;
    var numRows = isInfinite ? entities.length : pageSize;
    var maybeSpinner = isLoading ? _react2.default.createElement(_core.Spinner, { className: _core.Classes.SMALL }) : undefined;
    var numberOfColumns = columns ? columns.length : 0;
    var columnWidths = [];
    (0, _times2.default)(numberOfColumns, function () {
      columnWidths.push(width / numberOfColumns);
    });
    var loadingOptions = [];
    if (isLoading) {
      loadingOptions.push(_table.TableLoadingOption.CELLS);
      loadingOptions.push(_table.TableLoadingOption.ROW_HEADERS);
    }
    // const selectRow = rowIndex => {
    //   this.setState({ selectedRegions: [{ rows: [rowIndex, rowIndex] }] });
    // };
    return _react2.default.createElement(
      "div",
      { className: "data-table-container " + extraClasses },
      _react2.default.createElement(
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
          this.props.children
        ),
        withSearch && _react2.default.createElement(
          "div",
          { className: 'data-table-search-and-clear-filter-container' },
          hasFilters ? _react2.default.createElement(_core.Button, {
            className: 'data-table-clear-filters',
            onClick: function onClick() {
              clearFilters();
            },
            text: "Clear filters"
          }) : "",
          _react2.default.createElement(SearchBar, {
            setSearchTerm: setSearchTerm,
            maybeSpinner: maybeSpinner,
            initialValues: { searchTerm: searchTerm }
          })
        )
      ),
      _react2.default.createElement(
        "div",
        { className: "data-table-body" },
        _react2.default.createElement(
          _reactMeasure2.default,
          {
            onMeasure: function onMeasure(dimensions) {
              _this2.setState({ dimensions: dimensions });
            }
          },
          _react2.default.createElement(
            _table.Table,
            {
              numRows: numRows,
              columnWidths: columnWidths,
              fillBodyWithGhostCells: true,
              loadingOptions: loadingOptions,
              isRowHeaderShown: false,
              isColumnResizable: false,
              renderBodyContextMenu: this.renderBodyContextMenu,
              selectedRegions: this.state.selectedRegions,
              selectedRegionTransform: this.selectedRegionTransform,
              defaultRowHeight: 36,
              onSelection: function onSelection(selectedRegions) {
                _this2.setState({ selectedRegions: selectedRegions });
                if (!selectedRegions.length && onDeselect) {
                  onDeselect();
                }
                if (selectedRegions.length === 1 && onSingleRowSelect) {
                  if (selectedRegions[0].rows) {
                    if (selectedRegions[0].rows[0] === selectedRegions[0].rows[1]) {
                      var selectedRow = selectedRegions[0].rows[0];
                      var record = entities[selectedRow];
                      onSingleRowSelect(selectedRegions, record);
                    }
                  }
                } else if (onMultiRowSelect) {
                  onMultiRowSelect(selectedRegions);
                }
              }
            },
            entities && this.renderColumns()
          )
        )
      ),
      !isInfinite && withPaging && _react2.default.createElement(
        "div",
        { className: "data-table-footer" },
        _react2.default.createElement(_pagingToolbar2.default, {
          paging: {
            total: entityCount,
            page: page,
            pageSize: pageSize
          },
          setPage: setPage,
          setPageSize: setPageSizeDebounced
        })
      )
    );
  };

  // renderMenu = (dataType: TableDataTypes, schemaForField: SchemaForField) => {
  //   return <FilterAndSortMenu  dataType={dataType} schemaForField={schemaForField}/>;
  // };

  return DataTable;
}(_react2.default.Component), _class.defaultProps = {
  entities: [],
  withTitle: true,
  withSearch: true,
  withPaging: true,
  pageSize: 10,
  extraClasses: "",
  page: 0,
  isLoading: false,
  isInfinite: false,
  columns: [],
  setSearchTerm: noop,
  setFilter: noop,
  clearFilters: noop,
  setPageSize: noop,
  setOrder: noop,
  setPage: noop
}, _temp2);
exports.default = DataTable;

// type SelectedRegion = {rows?: Array<number>, cols?: Array<number>}

var FilterAndSortMenu = (_temp3 = _class2 = function (_React$Component2) {
  _inherits(FilterAndSortMenu, _React$Component2);

  function FilterAndSortMenu(props) {
    _classCallCheck(this, FilterAndSortMenu);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

    _initialiseProps.call(_this3);

    var selectedFilter = getFilterMenuItems(props.dataType)[0];
    _this3.state = {
      selectedFilter: selectedFilter,
      filterValue: ""
    };
    return _this3;
  }

  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();
  // }

  FilterAndSortMenu.prototype.render = function render() {
    var _state = this.state,
        selectedFilter = _state.selectedFilter,
        filterValue = _state.filterValue;
    var _props2 = this.props,
        dataType = _props2.dataType,
        model = _props2.schemaForField.model,
        fieldName = _props2.fieldName,
        setOrder = _props2.setOrder;
    var handleFilterChange = this.handleFilterChange,
        handleFilterValueChange = this.handleFilterValueChange,
        handleFilterSubmit = this.handleFilterSubmit;

    var filterTypesDictionary = {
      None: "",
      "Text starts with": "text",
      "Text ends with": "text",
      "Text contains": "text",
      "Text is exactly": "text",
      // "Date is": "date",
      "Date is between": "dateRange",
      "Date is before": "date",
      "Date is after": "date",
      "Greater than": "number",
      "Less than": "number",
      "In range": "numberRange",
      "Equal to": "number"
    };
    var filterMenuItems = getFilterMenuItems(dataType);
    var requiresValue = selectedFilter && selectedFilter !== "None";

    return _react2.default.createElement(
      _core.Menu,
      { className: "data-table-header-menu" },
      _react2.default.createElement(_core.MenuItem, {
        iconName: "sort-asc",
        onClick: function onClick() {
          if (!model) setOrder(fieldName);
        },
        text: "Sort Asc"
      }),
      _react2.default.createElement(_core.MenuItem, {
        iconName: "sort-desc",
        onClick: function onClick() {
          if (!model) setOrder("reverse:" + fieldName);
        },
        text: "Sort Desc"
      }),
      _react2.default.createElement(_core.MenuDivider, null),
      _react2.default.createElement(_core.MenuItem, { text: "Filter by condition...",
        shouldDismissPopover: false
      }),
      _react2.default.createElement(
        "div",
        { className: "custom-menu-item" },
        _react2.default.createElement(
          "div",
          { className: "pt-select pt-fill" },
          _react2.default.createElement(
            "select",
            {
              onChange: function onChange(e) {
                var selectedFilter = e.target.value;
                handleFilterChange(selectedFilter);
              },
              value: selectedFilter
            },
            filterMenuItems.map(function (menuItem, index) {
              // console.log('menuItem:', menuItem)
              return _react2.default.createElement(
                "option",
                { key: index, value: menuItem },
                menuItem
              );
            })
          )
        )
      ),
      _react2.default.createElement(
        "div",
        { className: "custom-menu-item" },
        _react2.default.createElement(FilterInput, {
          dataType: dataType,
          requiresValue: requiresValue,
          handleFilterSubmit: handleFilterSubmit,
          filterValue: filterValue,
          handleFilterValueChange: handleFilterValueChange,
          filterType: filterTypesDictionary[selectedFilter]
        })
      ),
      _react2.default.createElement(_core.MenuDivider, null),
      _react2.default.createElement(
        "div",
        { className: "custom-menu-item menu-buttons" },
        _react2.default.createElement(_core.Button, {
          className: "pt-popover-dismiss",
          intent: _core.Intent.SUCCESS,
          onClick: function onClick() {
            handleFilterSubmit();
          },
          text: "Ok"
        }),
        _react2.default.createElement(_core.Button, { className: "pt-popover-dismiss", text: "Cancel" })
      )
    );
  };

  return FilterAndSortMenu;
}(_react2.default.Component), _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.handleFilterChange = function (selectedFilter) {
    _this4.setState({ selectedFilter: selectedFilter });
  };

  this.handleFilterValueChange = function (filterValue) {
    _this4.setState({ filterValue: filterValue });
  };

  this.handleFilterSubmit = function () {
    var _state2 = _this4.state,
        filterValue = _state2.filterValue,
        selectedFilter = _state2.selectedFilter;
    var _props3 = _this4.props,
        fieldName = _props3.fieldName,
        setFilter = _props3.setFilter,
        schemaForField = _props3.schemaForField;


    setFilter({
      schemaForField: schemaForField,
      fieldName: fieldName,
      selectedFilter: selectedFilter,
      filterValue: filterValue
    });
  };
}, _temp3);

var FilterInput = function (_React$Component3) {
  _inherits(FilterInput, _React$Component3);

  function FilterInput() {
    _classCallCheck(this, FilterInput);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  FilterInput.prototype.render = function render() {
    var _props4 = this.props,
        handleFilterValueChange = _props4.handleFilterValueChange,
        handleFilterSubmit = _props4.handleFilterSubmit,
        filterValue = _props4.filterValue,
        filterType = _props4.filterType;
    //Options: Text, Single number (before, after, equals), 2 numbers (range),
    //Single Date (before, after, on), 2 dates (range)

    var inputGroup = _react2.default.createElement("div", null);
    switch (filterType) {
      case "text":
        inputGroup = _react2.default.createElement(
          "div",
          { className: "custom-menu-item" },
          _react2.default.createElement(_core.InputGroup, _extends({
            placeholder: "Value",
            onChange: function onChange(e) {
              handleFilterValueChange(e.target.value);
            }
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue
          }))
        );
        break;
      case "number":
        inputGroup = _react2.default.createElement(
          "div",
          { className: "custom-menu-item" },
          _react2.default.createElement(_core.InputGroup, _extends({
            placeholder: "Value",
            onChange: function onChange(e) {
              handleFilterValueChange(e.target.value);
            }
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue,
            type: "number"
          }))
        );
        break;
      case "numberRange":
        inputGroup = _react2.default.createElement(
          "div",
          { className: "custom-menu-item" },
          _react2.default.createElement(_core.InputGroup, _extends({
            placeholder: "Value",
            onChange: function onChange(e) {
              handleFilterValueChange([e.target.value, filterValue[1]]);
            }
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue && filterValue[0],
            type: "number"
          })),
          _react2.default.createElement(_core.InputGroup, _extends({
            placeholder: "Value",
            onChange: function onChange(e) {
              handleFilterValueChange([filterValue[0], e.target.value]);
            }
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue && filterValue[1],
            type: "number"
          }))
        );
        break;
      case "date":
        inputGroup = _react2.default.createElement(
          "div",
          { className: "custom-menu-item" },
          _react2.default.createElement(_datetime.DateInput, _extends({
            maxDate: new Date()
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue && filterValue[1],
            onChange: function onChange(selectedDates) {
              handleFilterValueChange(selectedDates);
            }
          })),
          _react2.default.createElement("div", null)
        );
        break;
      case "dateRange":
        inputGroup = _react2.default.createElement(
          "div",
          { className: "custom-menu-item" },
          _react2.default.createElement(_datetime.DateRangeInput, _extends({}, onEnterHelper(handleFilterSubmit), {
            popoverProps: {
              inline: false,
              tetherOptions: {
                constraints: [{
                  attachment: "together",
                  to: "window",
                  pin: true
                }]
              }
            },
            maxDate: new Date(),
            onChange: function onChange(selectedDates) {
              handleFilterValueChange(selectedDates);
            }
          }))
        );
        break;
      default:
      // to do
    }
    return inputGroup;
  };

  return FilterInput;
}(_react2.default.Component);

var SearchBar = (0, _reduxForm.reduxForm)({
  form: "dataTableSearchInput"
})(SearchBarInner);

function SearchBarInner(props) {
  return _react2.default.createElement(
    "div",
    { className: "data-table-search-and-filter" },
    _react2.default.createElement(_reduxForm.Field, _extends({
      name: "searchTerm"
    }, props, {
      component: renderSearchBarInputGroup
    }))
  );
}

function renderSearchBarInputGroup(_ref2) {
  var input = _ref2.input,
      setSearchTerm = _ref2.setSearchTerm,
      maybeSpinner = _ref2.maybeSpinner;

  return _react2.default.createElement(_core.InputGroup, _extends({
    className: "pt-round datatable-search-input",
    placeholder: "Search..."
  }, input, onEnterHelper(function () {
    setSearchTerm(input.value);
  }), {
    rightElement: maybeSpinner || _react2.default.createElement(_core.Button, {
      className: _core.Classes.MINIMAL,
      iconName: "pt-icon-search",
      onClick: function onClick() {
        setSearchTerm(input.value);
      }
    })
  }));
}

function getFilterMenuItems(dataType) {
  var filterMenuItems = [];
  if (dataType === "string") {
    filterMenuItems = ["Text contains", "Text starts with", "Text ends with", "Text is exactly"];
  } else if (dataType === "lookup") {
    filterMenuItems = ["Text contains", "Text starts with", "Text ends with", "Text is exactly"];
  } else if (dataType === "number") {
    // else if (dataType === "lookup") {
    //   filterMenuItems = ["None"];
    // }
    filterMenuItems = ["Greater than", "Less than", "In range", "Equal to"];
  } else if (dataType === "timestamp") {
    filterMenuItems = ["Date is between", "Date is before", "Date is after"];
  }
  return filterMenuItems;
}

function onEnterHelper(callback) {
  //this is just
  return {
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}
module.exports = exports["default"];