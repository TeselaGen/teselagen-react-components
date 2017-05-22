//@flow
import "../toastr";
import React from "react";
import times from "lodash/times";
import moment from "moment";
import debounce from "lodash/debounce";
import PagingToolbar from "./pagingToolbar";
import lo_map from "lodash/map";

import type {
  TableDataTypes,
  // SchemaForField,
  // QueryParams,
  // Paging,
  IRegion
} from "../flow_types";
import get from "lodash/get";

import {
  Button,
  Menu,
  Intent,
  MenuItem,
  MenuDivider,
  InputGroup,
  Spinner,
  Classes
} from "@blueprintjs/core";
import {
  Cell,
  Column,
  ColumnHeaderCell,
  ISelectedRegionTransform,
  RegionCardinality,
  Regions,
  Table,
  TableLoadingOption
} from "@blueprintjs/table";

import {
  /*DateInput, DateRangeInput, */ DateInput,
  DateRangeInput
} from "@blueprintjs/datetime";
import "./style.css";
import Measure from "react-measure";
function noop() {}
class DataTable extends React.Component {
  state = {
    dimensions: {
      width: -1
    },
    selectedRegions: []
  };

  props: {
    entities: Array<Object>,
    schema: Object,
    reduxFormSearchInput: Object,
    extraClasses: string,
    tableName?: string,
    isLoading: boolean,
    entityCount: number,
    page: number,
    pageSize: number,
    order: string,
    selectedFilter: string,
    filterValue: string,
    fieldName: string,
    searchTerm: string,
    columns: Array<string>,
    setSearchTerm: Function,
    setFilter: Function,
    clearFilters: Function,
    setPageSize: Function,
    setOrder: Function,
    setPage: Function,
    onDoubleClick?: Function,
    children?: any,
    withTitle: boolean,
    withSearch: boolean,
    withPaging: boolean,
    isInfinite: boolean,
    history: Object,
    onSingleRowSelect?: Function,
    onDeselect?: Function,
    onMultiRowSelect?: Function,
    cellRenderer: Object,
    customMenuItems: Object
  };

  static defaultProps = {
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
  };

  render() {
    const {
      entities,
      extraClasses,
      tableName,
      isLoading,
      columns,
      searchTerm,
      entityCount,
      setSearchTerm,
      clearFilters,
      setPageSize,
      setPage,
      // setSearchTerm,
      withTitle,
      withSearch,
      withPaging,
      isInfinite,
      onSingleRowSelect,
      onDeselect,
      onMultiRowSelect,
      page,
      pageSize,
      reduxFormSearchInput,
      selectedFilter
    } = this.props;
    const { dimensions } = this.state;
    const { width } = dimensions;

    const setPageSizeDebounced = debounce(pageSize => {
      setPageSize(pageSize);
    }, 300);
    const hasFilters = selectedFilter || searchTerm;
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading
      ? <Spinner className={Classes.SMALL} />
      : undefined;
    const numberOfColumns = columns ? columns.length : 0;
    const columnWidths = [];
    times(numberOfColumns, () => {
      columnWidths.push(width / numberOfColumns);
    });
    const loadingOptions: TableLoadingOption[] = [];
    if (isLoading) {
      loadingOptions.push(TableLoadingOption.CELLS);
      loadingOptions.push(TableLoadingOption.ROW_HEADERS);
    }
    // const selectRow = rowIndex => {
    //   this.setState({ selectedRegions: [{ rows: [rowIndex, rowIndex] }] });
    // };
    return (
      <div className={"data-table-container " + extraClasses}>
        <div className={"data-table-header"}>
          <div className={"data-table-title-and-buttons"}>

            {tableName &&
              withTitle &&
              <span className={"data-table-title"}>
                {tableName}
              </span>}

            {this.props.children}
          </div>
          {withSearch &&
            <div className={"data-table-search-and-clear-filter-container"}>
              {hasFilters
                ? <Button
                    className={"data-table-clear-filters"}
                    onClick={function() {
                      clearFilters();
                    }}
                    text={"Clear filters"}
                  />
                : ""}
              <SearchBar
                {...{
                  reduxFormSearchInput,
                  setSearchTerm,
                  maybeSpinner
                }}
              />
            </div>}
        </div>
        <div className={"data-table-body"}>

          <Measure
            onMeasure={dimensions => {
              this.setState({ dimensions });
            }}
          >
            <Table
              numRows={numRows}
              columnWidths={columnWidths}
              fillBodyWithGhostCells={true}
              loadingOptions={loadingOptions}
              isRowHeaderShown={false}
              isColumnResizable={false}
              renderBodyContextMenu={this.renderBodyContextMenu}
              selectedRegions={this.state.selectedRegions}
              selectedRegionTransform={this.selectedRegionTransform}
              defaultRowHeight={36}
              onSelection={selectedRegions => {
                this.setState({ selectedRegions });
                if (!selectedRegions.length && onDeselect) {
                  onDeselect();
                }
                if (selectedRegions.length === 1 && onSingleRowSelect) {
                  if (selectedRegions[0].rows) {
                    if (
                      selectedRegions[0].rows[0] === selectedRegions[0].rows[1]
                    ) {
                      const selectedRow = selectedRegions[0].rows[0];
                      const record = entities[selectedRow];
                      onSingleRowSelect(selectedRegions, record);
                    }
                  }
                } else if (onMultiRowSelect) {
                  onMultiRowSelect(selectedRegions);
                }
              }}
            >
              {entities && this.renderColumns()}
            </Table>
          </Measure>
        </div>
        {!isInfinite &&
          withPaging &&
          <div className={"data-table-footer"}>
            <PagingToolbar
              paging={{
                total: entityCount,
                page,
                pageSize
              }}
              setPage={setPage}
              setPageSize={setPageSizeDebounced}
            />
          </div>}
      </div>
    );
  }

  renderColumns = () => {
    const { columns, schema } = this.props;
    if (!columns.length) {
      return;
    }
    let columnsToRender = [];
    columns.forEach((column, index) => {
      let name = schema.fields[column].displayName;
      columnsToRender.push(
        <Column
          key={index}
          name={name}
          renderCell={this.renderCell}
          renderColumnHeader={this.renderColumnHeader}
        />
      );
    });
    return columnsToRender;
  };

  renderCell = (rowIndex: number, columnIndex: number) => {
    const {
      entities,
      schema,
      columns,
      history,
      onDoubleClick,
      cellRenderer
    } = this.props;
    const columnName = columns[columnIndex];
    const row = entities[rowIndex];
    if (!row) return <Cell />;
    const schemaForColumn = schema.fields[columnName];
    let cellData;
    if (schemaForColumn.path) {
      cellData = get(row, schemaForColumn.path);
    } else {
      cellData = row[columnName];
    }
    if (schemaForColumn.type === "timestamp") {
      cellData = moment(cellData).format("MMM D, YYYY");
    }
    if (cellRenderer && cellRenderer[columnName]) {
      cellData = cellRenderer[columnName](cellData);
    }
    return (
      <Cell>
        {onDoubleClick
          ? <div
              className={"clickable-cell"}
              onDoubleClick={() => {
                onDoubleClick(row, rowIndex, history);
              }}
            >
              {cellData}
            </div>
          : cellData}
      </Cell>
    );
  };

  renderBodyContextMenu = ({ regions }: Array<IRegion>) => {
    const { entities, history, customMenuItems } = this.props;
    //single selection

    const defaultMenuItems = {
      view: (recordData, history) => {
        const recordId = recordData.dbId;
        const route = "/" + recordData["__typename"] + "s" + "/" + recordId;
        return (
          <MenuItem
            key={recordId}
            iconName="eye-open"
            onClick={() => {
              history.push(route);
            }}
            text="View"
          />
        );
      },
      delete: () => (
        <MenuItem iconName="trash" onClick={() => {}} text="Delete" />
      )
    };

    const menuItems = { ...defaultMenuItems, ...(customMenuItems || {}) };

    if (regions.length === 1) {
      if (regions[0].rows) {
        if (regions[0].rows[0] === regions[0].rows[1]) {
          const selectedRow = regions[0].rows[0];
          const recordData = entities[selectedRow];
          return (
            <Menu>
              {lo_map(menuItems, menuItemGenerator =>
                menuItemGenerator(recordData, history)
              )}
            </Menu>
          );
        }
      }
    }
    return null;
  };

  renderColumnHeader = (columnIndex: number) => {
    const { columns, schema, setFilter, setOrder, order } = this.props;

    const fieldName = columns[columnIndex];
    const schemaForField = schema.fields[fieldName];
    const { displayName } = schemaForField;
    const columnDataType = schema.fields[fieldName].type;

    let ordering;
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
    return (
      <ColumnHeaderCell
        name={
          <span title={displayName}>
            {displayName + "  "}
            {ordering &&
              (ordering === "asc"
                ? <span className={"pt-icon-standard pt-icon-arrow-down"} />
                : <span className={"pt-icon-standard pt-icon-arrow-up"} />)}
          </span>
        }
        menu={
          <FilterAndSortMenu
            setFilter={setFilter}
            setOrder={setOrder}
            fieldName={fieldName}
            dataType={columnDataType}
            schemaForField={schemaForField}
          />
        }
      />
    );
  };

  // renderMenu = (dataType: TableDataTypes, schemaForField: SchemaForField) => {
  //   return <FilterAndSortMenu  dataType={dataType} schemaForField={schemaForField}/>;
  // };

  selectedRegionTransform = (region: ISelectedRegionTransform) => {
    // convert cell selection to row selection
    if (Regions.getRegionCardinality(region) === RegionCardinality.CELLS) {
      return Regions.row(region.rows[0], region.rows[1]);
    }
    return region;
  };
}

// function QueryParams(props) {
//   return (
//       <Field
//         name={fieldName}
//         {...props}
//         component={Component}
//       />
//   );
// }
export default DataTable;

// type SelectedRegion = {rows?: Array<number>, cols?: Array<number>}

class FilterAndSortMenu extends React.Component {
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
    fieldName: string,
    setOrder: Function,
    setFilter: Function
  };
  handleFilterChange = (selectedFilter: string) => {
    this.setState({ selectedFilter: selectedFilter });
  };
  handleFilterValueChange = (filterValue: string): void => {
    this.setState({ filterValue: filterValue });
  };
  handleFilterSubmit = () => {
    const { filterValue, selectedFilter } = this.state;
    const { fieldName, setFilter, schemaForField } = this.props;

    setFilter({
      schemaForField,
      fieldName,
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
    const {
      dataType,
      schemaForField: { model },
      fieldName,
      setOrder
    } = this.props;
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
          iconName="sort-asc"
          onClick={() => {
            if (!model) setOrder(fieldName);
          }}
          text="Sort Asc"
        />
        <MenuItem
          iconName="sort-desc"
          onClick={() => {
            if (!model) setOrder("reverse:" + fieldName);
          }}
          text="Sort Desc"
        />
        <MenuDivider />
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
                return <option key={index} value={menuItem}>{menuItem}</option>;
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
              {...onEnterHelper(handleFilterSubmit)}
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
              {...onEnterHelper(handleFilterSubmit)}
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
              {...onEnterHelper(handleFilterSubmit)}
              value={filterValue && filterValue[0]}
              type={"number"}
            />
            <InputGroup
              placeholder="Value"
              onChange={function(e) {
                handleFilterValueChange([filterValue[0], e.target.value]);
              }}
              {...onEnterHelper(handleFilterSubmit)}
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
              {...onEnterHelper(handleFilterSubmit)}
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
              {...onEnterHelper(handleFilterSubmit)}
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

// import { Field, reduxForm } from "redux-form";
// const SearchBar = reduxForm({
//   form: "dataTableSearchInput"
// })(SearchBarInner);

// function SearchBarInner(props) {
//   return (
//     <div className={"data-table-search-and-filter"}>
//       <Field
//         name="searchTerm"
//         {...props}
//         component={renderSearchBarInputGroup}
//       />

//     </div>
//   );
// }

// function renderSearchBarInputGroup({ reduxFormSearchInput, setSearchTerm, maybeSpinner }) {
function SearchBar({ reduxFormSearchInput, setSearchTerm, maybeSpinner }) {
  return (
    <InputGroup
      className={"pt-round datatable-search-input"}
      placeholder="Search..."
      {...reduxFormSearchInput.input}
      {...onEnterHelper(function() {
        setSearchTerm(reduxFormSearchInput.input.value);
      })}
      rightElement={
        maybeSpinner ||
          <Button
            className={Classes.MINIMAL}
            iconName={"pt-icon-search"}
            onClick={function() {
              setSearchTerm(reduxFormSearchInput.input.value);
            }}
          />
      }
    />
  );
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

function onEnterHelper(callback) {
  //this is just
  return {
    onKeyDown: function(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}
