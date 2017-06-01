//@flow
import { withRouter } from "react-router-dom";
import "../toastr";
import React from "react";
import times from "lodash/times";
import moment from "moment";
import PagingTool from "./PagingTool";
import lo_map from "lodash/map";
import { onEnterHelper } from "./utils/onEnterOrBlurHelper";
import FilterAndSortMenu from "./FilterAndSortMenu";
import type {
  // SchemaForField,
  // QueryParams,
  TableParams,
  IRegion
} from "../flow_types";

import get from "lodash/get";

import {
  Button,
  Menu,
  MenuItem,
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
    extraClasses: string,
    tableName?: string,
    isLoading: boolean,
    entityCount: number,
    onDoubleClick?: Function,
    children?: any,
    withTitle: boolean,
    withSearch: boolean,
    withPaging: boolean,
    isInfinite: boolean,
    onRefresh?: Function,
    onSingleRowSelect?: Function,
    onDeselect?: Function,
    onMultiRowSelect?: Function,
    cellRenderer: Object,
    customMenuItems: Object,
    ...TableParams
  };

  static defaultProps = {
    entities: [],
    withTitle: true,
    withSearch: true,
    withPaging: true,
    pageSize: 10,
    extraClasses: "",
    page: 1,
    reduxFormSearchInput: {},
    isLoading: false,
    isInfinite: false,
    columns: [],
    setSearchTerm: noop,
    setFilter: noop,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    onDoubleClick: noop
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
      withTitle,
      withSearch,
      withPaging,
      isInfinite,
      onSingleRowSelect,
      onRefresh,
      onDeselect,
      onMultiRowSelect,
      page,
      pageSize,
      reduxFormSearchInput,
      selectedFilter
    } = this.props;

    const { dimensions } = this.state;
    const { width } = dimensions;

    const hasFilters = selectedFilter || searchTerm;
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading
      ? <Spinner className={Classes.SMALL} />
      : undefined;
    const numberOfColumns = columns ? columns.length : 0;
    const columnWidths = [];
    times(numberOfColumns, () => {
      columnWidths.push((width - 15) / numberOfColumns);
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
            <PagingTool
              paging={{
                total: entityCount,
                page,
                pageSize
              }}
              onRefresh={onRefresh}
              setPage={setPage}
              setPageSize={setPageSize}
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
      cellData = moment(new Date(cellData)).format("MMM D, YYYY");
    }
    if (cellRenderer && cellRenderer[columnName]) {
      cellData = cellRenderer[columnName](cellData);
    }
    return (
      <Cell>
        <div
          className={"clickable-cell"}
          onDoubleClick={() => {
            onDoubleClick(row, rowIndex, history);
          }}
        >
          {cellData}
        </div>
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

export default withRouter(DataTable);

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
