//@flow
import "../toastr";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";
import React from "react";
import type {
  TableDataTypes
  // SchemaForField,
  // QueryParams,
  // Paging,
} from "../flow_types";

import {
  Button,
  Menu,
  Intent,
  MenuItem,
  MenuDivider,
  InputGroup
} from "@blueprintjs/core";

import {
  /*DateInput, DateRangeInput, */ DateInput,
  DateRangeInput
} from "@blueprintjs/datetime";
import "./style.css";

export default class FilterAndSortMenu extends React.Component {
  constructor(props) {
    super(props);
    const selectedFilter = getFilterMenuItems(props.dataType)[0];
    this.state = {
      selectedFilter,
      filterValue: ""
    };
  }
  props: {
    dataType: TableDataTypes,
    schemaForField: Object,
    filterOn: string,
    setOrder: Function,
    setFilter: Function
  };
  handleFilterChange = (selectedFilter: string) => {
    this.setState({ selectedFilter });
  };
  handleFilterValueChange = (filterValue: string): void => {
    this.setState({ filterValue });
  };
  handleFilterSubmit = () => {
    const { filterValue, selectedFilter } = this.state;
    const { filterOn, setFilter, schemaForField } = this.props;

    setFilter({
      schemaForField,
      filterOn,
      selectedFilter,
      filterValue
    });
  };

  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();
  // }

  render() {
    const { selectedFilter, filterValue } = this.state;
    const { dataType } = this.props;
    const {
      handleFilterChange,
      handleFilterValueChange,
      handleFilterSubmit
    } = this;
    const filterTypesDictionary = {
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
    const filterMenuItems = getFilterMenuItems(dataType);
    const requiresValue = selectedFilter && selectedFilter !== "None";

    return (
      <Menu className={"data-table-header-menu"}>
        <MenuItem
          // iconName={showFilterBy ? "caret-down" : "caret-right"}
          text="Filter by condition..."
          shouldDismissPopover={false}
        />
        <div className={"custom-menu-item"}>
          <div className="pt-select pt-fill">
            <select
              onChange={function(e) {
                const selectedFilter = e.target.value;
                handleFilterChange(selectedFilter);
              }}
              value={selectedFilter}
            >
              {filterMenuItems.map(function(menuItem, index) {
                // console.log('menuItem:', menuItem)
                return (
                  <option key={index} value={menuItem}>
                    {menuItem}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className={"custom-menu-item"}>
          <FilterInput
            dataType={dataType}
            requiresValue={requiresValue}
            handleFilterSubmit={handleFilterSubmit}
            filterValue={filterValue}
            handleFilterValueChange={handleFilterValueChange}
            filterType={filterTypesDictionary[selectedFilter]}
          />
        </div>
        <MenuDivider />
        {
          <div className={"custom-menu-item menu-buttons"}>
            <Button
              className={"pt-popover-dismiss"}
              intent={Intent.SUCCESS}
              onClick={() => {
                handleFilterSubmit();
              }}
              text="Ok"
            />
            <Button className={"pt-popover-dismiss"} text="Cancel" />
          </div>
        }
      </Menu>
    );
  }
}

class FilterInput extends React.Component {
  render() {
    const {
      handleFilterValueChange,
      handleFilterSubmit,
      filterValue,
      filterType
    } = this.props;
    //Options: Text, Single number (before, after, equals), 2 numbers (range),
    //Single Date (before, after, on), 2 dates (range)
    let inputGroup: JSX.Element = <div />;
    switch (filterType) {
      case "text":
        inputGroup = (
          <div className={"custom-menu-item"}>
            <InputGroup
              placeholder="Value"
              onChange={function(e) {
                handleFilterValueChange(e.target.value);
              }}
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              value={filterValue}
            />
          </div>
        );
        break;
      case "number":
        inputGroup = (
          <div className={"custom-menu-item"}>
            <InputGroup
              placeholder="Value"
              onChange={function(e) {
                handleFilterValueChange(e.target.value);
              }}
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              value={filterValue}
              type={"number"}
            />
          </div>
        );
        break;
      case "numberRange":
        inputGroup = (
          <div className={"custom-menu-item"}>
            <InputGroup
              placeholder="Value"
              onChange={function(e) {
                handleFilterValueChange([e.target.value, filterValue[1]]);
              }}
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              value={filterValue && filterValue[0]}
              type={"number"}
            />
            <InputGroup
              placeholder="Value"
              onChange={function(e) {
                handleFilterValueChange([filterValue[0], e.target.value]);
              }}
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              value={filterValue && filterValue[1]}
              type={"number"}
            />
          </div>
        );
        break;
      case "date":
        inputGroup = (
          <div className={"custom-menu-item"}>
            <DateInput
              maxDate={new Date()}
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              value={filterValue && filterValue[1]}
              onChange={selectedDates => {
                handleFilterValueChange(selectedDates);
              }}
            />
            <div />
          </div>
        );
        break;
      case "dateRange":
        inputGroup = (
          <div className={"custom-menu-item"}>
            <DateRangeInput
              {...onEnterOrBlurHelper(handleFilterSubmit)}
              popoverProps={{
                inline: false,
                tetherOptions: {
                  constraints: [
                    {
                      attachment: "together",
                      to: "window",
                      pin: true
                    }
                  ]
                }
              }}
              maxDate={new Date()}
              onChange={selectedDates => {
                handleFilterValueChange(selectedDates);
              }}
            />
          </div>
        );
        break;
      default:
      // to do
    }
    return inputGroup;
  }
}

function getFilterMenuItems(dataType) {
  let filterMenuItems = [];
  if (dataType === "string") {
    filterMenuItems = [
      "Text contains",
      "Text starts with",
      "Text ends with",
      "Text is exactly"
    ];
  } else if (dataType === "lookup") {
    filterMenuItems = [
      "Text contains",
      "Text starts with",
      "Text ends with",
      "Text is exactly"
    ];
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
