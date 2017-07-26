//@flow

import { withRouter } from "react-router-dom";
import "../toastr";
import React from "react";
import times from "lodash/times";
import moment from "moment";
import PagingTool from "./PagingTool";
import camelCase from "lodash/camelCase";
import { onEnterHelper } from "../utils/handlerHelpers";
import getSelectedRowsFromRegions from "./utils/getSelectedRowsFromRegions";
import FilterAndSortMenu from "./FilterAndSortMenu";
import type {
  // SchemaForField,
  // QueryParams,
  TableParams,
  IRegion
} from "../flow_types";

import get from "lodash/get";

import { Button, Menu, InputGroup, Spinner, Classes } from "@blueprintjs/core";
import {
  Cell,
  Column,
  ColumnHeaderCell,
  ISelectedRegionTransform,
  RegionCardinality,
  Regions,
  Table,
  TableLoadingOption,
  SelectionModes
} from "@blueprintjs/table";

import "./style.css";
import Measure from "react-measure";
function noop() {}
class DataTable extends React.Component {
  state = {
    dimensions: {
      width: -1
    },
    selectedRegions: [],
    columns: []
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
    containerWidth: number,
    onRefresh?: Function,
    onSingleRowSelect?: Function,
    onDeselect?: Function,
    onMultiRowSelect?: Function,
    cellRenderer: Object,
    contextMenu: Object,
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
    setSearchTerm: noop,
    setFilter: noop,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    onDoubleClick: noop
  };

  componentWillMount() {
    const { schema } = this.props;
    const columns = schema.fields.reduce(function(columns, field, i) {
      if (field.isHidden) {
        return columns;
      } else {
        columns.push({ displayName: field.displayName, schemaIndex: i });
        return columns;
      }
    }, []);
    this.setState({ columns: columns });
  }
  render() {
    const {
      entities,
      extraClasses,
      tableName,
      isLoading,
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
      containerWidth,
      onRefresh,
      onDeselect,
      onMultiRowSelect,
      page,
      pageSize,
      reduxFormSearchInput,
      selectedFilter,
      bpTableProps = {}
    } = this.props;
    const { dimensions, columns } = this.state;
    let { width } = dimensions;
    if (containerWidth) width = containerWidth;

    const hasFilters = selectedFilter || searchTerm;
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading
      ? <Spinner className={Classes.SMALL} />
      : undefined;
    const numberOfColumns = columns ? columns.length : 0;
    const columnWidths = [];
    times(numberOfColumns, () => {
      columnWidths.push(width / numberOfColumns); //SD why did we have the width - X ? removing for now...
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
              selectionModes={SelectionModes.ROWS_AND_CELLS}
              onSelection={selectedRegions => {
                //tnr: we might need to come back here and manually add in logic to stop multiple rows from being selected when
                // allowMultipleSelection is false
                // const selectedRows = getSelectedRowsFromRegions(selectedRegions)
                // const {selectedRegions: oldSelectedRegions} = this.state

                // const {allowMultipleSelection} = bpTableProps
                // if (allowMultipleSelection === false) {

                // }
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
              {...bpTableProps}
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
    const { columns } = this.state;
    if (!columns.length) {
      return;
    }
    let columnsToRender = [];
    columns.forEach((column, index) => {
      columnsToRender.push(
        <Column
          key={index}
          name={column.displayName}
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
      history,
      onDoubleClick,
      cellRenderer
    } = this.props;
    const { columns } = this.state;
    const column = columns[columnIndex];
    const row = entities[rowIndex];
    if (!row) return <Cell />;
    const schemaForColumn = schema.fields[column.schemaIndex];
    let cellData;
    cellData = get(row, schemaForColumn.path);
    if (schemaForColumn.type === "timestamp") {
      cellData = moment(new Date(cellData)).format("MMM D, YYYY");
    } else if (schemaForColumn.type === "boolean") {
      cellData = cellData ? "True" : "False";
    }
    if (cellRenderer && cellRenderer[schemaForColumn.path]) {
      cellData = cellRenderer[schemaForColumn.path](cellData);
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
    const { entities, history, contextMenu } = this.props;
    //single selection
    // const contextMenu = { ...(contextMenu || {}) };
    const selectedRows = getSelectedRowsFromRegions(regions);
    const selectedRecords = selectedRows.map(row => {
      return entities[row];
    });
    if (selectedRows.length < 1 || !contextMenu || !contextMenu.length) {
      return null;
    }
    const itemsToRender = contextMenu({
      selectedRecords,
      history,
      selectedRows,
      regions
    });
    if (!itemsToRender) return null;
    return (
      <Menu>
        {itemsToRender}
      </Menu>
    );
  };

  renderColumnHeader = (columnIndex: number) => {
    const { schema, setFilter, setOrder, order } = this.props;
    const { columns } = this.state;
    const schemaIndex = columns[columnIndex]["schemaIndex"];
    const schemaForField = schema.fields[schemaIndex];
    const { displayName, sortDisabled } = schemaForField;
    const columnDataType = schemaForField.type;

    let ordering;
    if (order && typeof order === "string") {
      var orderField = order.replace("reverse:", "");
      if (orderField === camelCase(displayName)) {
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
            <span>
              {displayName + "  "}
              {ordering &&
                (ordering === "asc"
                  ? <span className={"pt-icon-standard pt-icon-arrow-down"} />
                  : <span className={"pt-icon-standard pt-icon-arrow-up"} />)}
            </span>
          </span>
        }
        renderMenu={function() {
          return (
            <FilterAndSortMenu
              sortDisabled={sortDisabled}
              setFilter={setFilter}
              setOrder={setOrder}
              camelCaseDisplayName={camelCase(displayName)}
              dataType={columnDataType}
              schemaForField={schemaForField}
            />
          );
        }}
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

export default withRouter(DataTable);
