var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { DateInput, DateRangeInput } from "@blueprintjs/datetime";
import moment from "moment";
import { camelCase } from "lodash";
import classNames from "classnames";
import getMomentFormatter from "../utils/getMomentFormatter";
import { onEnterHelper } from "../utils/handlerHelpers";
import React from "react";

import { Menu, Intent, MenuDivider, InputGroup, Classes } from "@blueprintjs/core";
import DialogFooter from "../DialogFooter";
import "./style.css";
import "../toastr";

var FilterAndSortMenu = (_temp = _class = function (_React$Component) {
  _inherits(FilterAndSortMenu, _React$Component);

  function FilterAndSortMenu(props) {
    _classCallCheck(this, FilterAndSortMenu);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var selectedFilter = camelCase(getFilterMenuItems(props.dataType)[0]);
    _this.state = {
      selectedFilter: selectedFilter,
      filterValue: ""
    };
    return _this;
  }

  FilterAndSortMenu.prototype.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    if (this.props.currentFilter) {
      this.setState(_extends({}, this.props.currentFilter));
    }
  };
  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();
  // }

  FilterAndSortMenu.prototype.render = function render() {
    var _state = this.state,
        selectedFilter = _state.selectedFilter,
        filterValue = _state.filterValue;
    var _props = this.props,
        dataType = _props.dataType,
        currentFilter = _props.currentFilter,
        removeSingleFilter = _props.removeSingleFilter;
    var handleFilterChange = this.handleFilterChange,
        handleFilterValueChange = this.handleFilterValueChange,
        handleFilterSubmit = this.handleFilterSubmit;

    var filterTypesDictionary = {
      none: "",
      startsWith: "text",
      endsWith: "text",
      contains: "text",
      isExactly: "text",
      inList: "text",
      true: "boolean",
      false: "boolean",
      dateIs: "date",
      isBetween: "dateRange",
      isBefore: "date",
      isAfter: "date",
      greaterThan: "number",
      lessThan: "number",
      inRange: "numberRange",
      equalTo: "number"
    };
    var filterMenuItems = getFilterMenuItems(dataType);
    var ccSelectedFilter = camelCase(selectedFilter);
    var requiresValue = ccSelectedFilter && ccSelectedFilter !== "none";

    return React.createElement(
      Menu,
      { className: "data-table-header-menu" },
      React.createElement(
        "div",
        { className: "custom-menu-item" },
        React.createElement(
          "div",
          { className: classNames(Classes.SELECT, Classes.FILL) },
          React.createElement(
            "select",
            {
              onChange: function onChange(e) {
                var ccSelectedFilter = camelCase(e.target.value);
                handleFilterChange(ccSelectedFilter);
              },
              value: ccSelectedFilter
            },
            filterMenuItems.map(function (menuItem, index) {
              return React.createElement(
                "option",
                { key: index, value: camelCase(menuItem) },
                menuItem
              );
            })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "custom-menu-item" },
        React.createElement(FilterInput, {
          dataType: dataType,
          requiresValue: requiresValue,
          handleFilterSubmit: handleFilterSubmit,
          filterValue: filterValue,
          handleFilterValueChange: handleFilterValueChange,
          filterType: filterTypesDictionary[camelCase(selectedFilter)]
        })
      ),
      React.createElement(MenuDivider, null),
      React.createElement(DialogFooter, {
        secondaryClassName: Classes.POPOVER_DISMISS,
        onClick: function onClick() {
          handleFilterSubmit();
        },
        intent: Intent.SUCCESS,
        text: "Filter",
        secondaryText: "Clear",
        secondaryAction: function secondaryAction() {
          currentFilter && removeSingleFilter(currentFilter.filterOn);
        }
      })
    );
  };

  return FilterAndSortMenu;
}(React.Component), _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.handleFilterChange = function (selectedFilter) {
    _this2.setState({ selectedFilter: camelCase(selectedFilter) });
  };

  this.handleFilterValueChange = function (filterValue) {
    _this2.setState({ filterValue: filterValue });
  };

  this.handleFilterSubmit = function () {
    var _state2 = _this2.state,
        filterValue = _state2.filterValue,
        selectedFilter = _state2.selectedFilter;
    var togglePopover = _this2.props.togglePopover;

    var ccSelectedFilter = camelCase(selectedFilter);
    var filterValToUse = filterValue;
    if (ccSelectedFilter === "true" || ccSelectedFilter === "false") {
      //manually set the filterValue because none is set when type=boolean
      filterValToUse = ccSelectedFilter;
    }
    var _props2 = _this2.props,
        filterOn = _props2.filterOn,
        addFilters = _props2.addFilters,
        removeSingleFilter = _props2.removeSingleFilter;

    if (!filterValToUse) {
      return removeSingleFilter(filterOn);
    }
    addFilters([{
      filterOn: filterOn,
      selectedFilter: ccSelectedFilter,
      filterValue: filterValToUse
    }]);
    togglePopover();
  };
}, _temp);
export { FilterAndSortMenu as default };

var FilterInput = function (_React$Component2) {
  _inherits(FilterInput, _React$Component2);

  function FilterInput() {
    _classCallCheck(this, FilterInput);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  FilterInput.prototype.render = function render() {
    var _props3 = this.props,
        handleFilterValueChange = _props3.handleFilterValueChange,
        handleFilterSubmit = _props3.handleFilterSubmit,
        filterValue = _props3.filterValue,
        filterType = _props3.filterType;
    //Options: Text, Single number (before, after, equals), 2 numbers (range),
    //Single Date (before, after, on), 2 dates (range)

    var inputGroup = React.createElement("div", null);
    switch (filterType) {
      case "text":
        inputGroup = React.createElement(
          "div",
          { className: "custom-menu-item" },
          React.createElement(InputGroup, _extends({
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
        inputGroup = React.createElement(
          "div",
          { className: "custom-menu-item" },
          React.createElement(InputGroup, _extends({
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
        inputGroup = React.createElement(
          "div",
          { className: "custom-menu-item" },
          React.createElement(InputGroup, _extends({
            placeholder: "Value",
            onChange: function onChange(e) {
              handleFilterValueChange([e.target.value, filterValue[1]]);
            }
          }, onEnterHelper(handleFilterSubmit), {
            value: filterValue && filterValue[0],
            type: "number"
          })),
          React.createElement(InputGroup, _extends({
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
        inputGroup = React.createElement(
          "div",
          { className: "custom-menu-item" },
          React.createElement(DateInput, _extends({
            value: filterValue ? moment(filterValue).toDate() : undefined
          }, getMomentFormatter("MM/DD/YYYY"), {
            minDate: moment(0).toDate(),
            maxDate: moment(9999999999999).toDate(),
            onChange: function onChange(selectedDates) {
              handleFilterValueChange(selectedDates);
            }
          }))
        );
        break;
      case "dateRange":
        var filterValueToUse = filterValue && filterValue.split && filterValue.split(".");
        inputGroup = React.createElement(
          "div",
          { className: "custom-menu-item" },
          React.createElement(DateRangeInput, _extends({
            value: filterValueToUse && filterValueToUse[0] && filterValueToUse[1] ? [new Date(filterValueToUse[0]), new Date(filterValueToUse[1])] : undefined
          }, getMomentFormatter("MM/DD/YYYY"), {
            minDate: moment(0).toDate(),
            maxDate: moment(99999999999999).toDate(),
            onChange: function onChange(selectedDates) {
              if (selectedDates[0] && selectedDates[1]) {
                handleFilterValueChange(selectedDates);
              }
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
}(React.Component);

function getFilterMenuItems(dataType) {
  var filterMenuItems = [];
  if (dataType === "string") {
    filterMenuItems = ["Contains", "Starts with", "Ends with", "Is exactly", "In List"];
  } else if (dataType === "lookup") {
    filterMenuItems = ["Contains", "Starts with", "Ends with", "Is exactly"];
  } else if (dataType === "boolean") {
    filterMenuItems = ["True", "False"];
  } else if (dataType === "number") {
    // else if (dataType === "lookup") {
    //   filterMenuItems = ["None"];
    // }
    filterMenuItems = ["Greater than", "Less than", "In range", "Equal to", "In List"];
  } else if (dataType === "timestamp") {
    filterMenuItems = ["Is between", "Is before", "Is after"];
  }
  return filterMenuItems;
}