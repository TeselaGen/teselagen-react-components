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

import {
  Button,
  Menu,
  InputGroup,
  Checkbox,
  Spinner,
  Popover,
  Classes,
  Position
} from "@blueprintjs/core";
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
    height?: number | string,
    onRefresh?: Function,
    onSingleRowSelect?: Function,
    onDeselect?: Function,
    onMultiRowSelect?: Function,
    cellRenderer: Object,
    contextMenu: Object,
    withCheckboxes: Object,
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
    height: "100%",
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    isLoading: false,
    isInfinite: false,
    withCheckboxes: false,
    setSearchTerm: noop,
    setFilter: noop,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    onDoubleClick: noop
  };

  componentWillMount() {
    const { schema = {} } = this.props;
    const columns = schema.fields
      ? schema.fields.reduce(function(columns, field, i) {
          if (field.isHidden) {
            return columns;
          } else {
            columns.push({ displayName: field.displayName, schemaIndex: i });
            return columns;
          }
        }, [])
      : [];
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
      withCheckboxes,
      isInfinite,
      onSingleRowSelect,
      containerWidth,
      onRefresh,
      onDeselect,
      onMultiRowSelect,
      page,
      height,
      pageSize,
      reduxFormSearchInput,
      reduxFormSelectedEntityIdMap,
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
    const CHECKBOX_COLUMN_WIDTH = 35;
    times(numberOfColumns, () => {
      columnWidths.push(
        (width - (withCheckboxes ? CHECKBOX_COLUMN_WIDTH : 0)) / numberOfColumns
      ); //SD why did we have the width - X ? removing for now...
    });
    if (withCheckboxes) {
      columnWidths.unshift(CHECKBOX_COLUMN_WIDTH);
    }
    const loadingOptions: TableLoadingOption[] = [];
    if (isLoading) {
      loadingOptions.push(TableLoadingOption.CELLS);
      loadingOptions.push(TableLoadingOption.ROW_HEADERS);
    }

    const selectedRowCount = Object.keys(
      reduxFormSelectedEntityIdMap.input.value || {}
    ).length;
    // const selectRow = rowIndex => {
    //   this.setState({ selectedRegions: [{ rows: [rowIndex, rowIndex] }] });
    // };
    return (
      <div
        style={{ height }}
        className={"data-table-container " + extraClasses}
      >
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
              loadingOptions={loadingOptions}
              isRowHeaderShown={false}
              isColumnResizable={false}
              renderBodyContextMenu={this.renderBodyContextMenu}
              selectedRegions={getSelectedRegionsFromRowsArray(
                withCheckboxes
                  ? []
                  : getSelectedRowsFromEntities(
                      entities,
                      reduxFormSelectedEntityIdMap.input.value
                    )
              )}
              selectedRegionTransform={this.selectedRegionTransform}
              defaultRowHeight={36}
              selectionModes={
                withCheckboxes
                  ? SelectionModes.NONE
                  : SelectionModes.ROWS_AND_CELLS
              }
              onSelection={(selectedRegions, ...args) => {
                //tnr: we might need to come back here and manually add in logic to stop multiple rows from being selected when
                // allowMultipleSelection is false
                // const selectedRows = getSelectedRowsFromRegions(selectedRegions)
                // const {selectedRegions: oldSelectedRegions} = this.state

                // const {allowMultipleSelection} = bpTableProps
                // if (allowMultipleSelection === false) {

                // }
                if (withCheckboxes) return;
                reduxFormSelectedEntityIdMap.input.onChange(
                  getIdMapFromSelectedRows(
                    entities,
                    getSelectedRowsFromRegions(selectedRegions)
                  )
                );
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
        <div className={"data-table-footer"}>
          <div className={"tg-datatable-selected-count"}>
            {selectedRowCount > 0
              ? ` ${selectedRowCount} Record${selectedRowCount === 1
                  ? ""
                  : "s"} Selected `
              : ""}
          </div>
          {!isInfinite && withPaging
            ? <PagingTool
                paging={{
                  total: entityCount,
                  page,
                  pageSize
                }}
                onRefresh={onRefresh}
                setPage={setPage}
                setPageSize={setPageSize}
              />
            : <div className={"tg-placeholder"} />}
        </div>
      </div>
    );
  }

  renderColumns = () => {
    const { columns } = this.state;
    const { withCheckboxes } = this.props;
    if (!columns.length) {
      return;
    }
    let columnsToRender = withCheckboxes
      ? [
          <Column
            key={"checkboxes"}
            name={"checkboxes"}
            renderCell={this.renderCheckboxCell}
            renderColumnHeader={this.renderCheckboxHeader}
          />
        ]
      : [];
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

  renderCheckboxCell = (rowIndex: number, columnIndex: number) => {
    const { entities, reduxFormSelectedEntityIdMap } = this.props;

    const checkedRows = getSelectedRowsFromEntities(
      entities,
      reduxFormSelectedEntityIdMap.input.value
    );

    const { lastCheckedRow } = this.state;
    // const selectedRows = getSelectedRowsFromRegions(selectedRegions);
    const isSelected = checkedRows.some(rowNum => {
      return rowNum === rowIndex;
    });
    if (rowIndex >= entities.length) {
      return <Cell />;
    }
    const entity = entities[rowIndex];
    return (
      <Cell className={"tg-checkbox-cell"} style={{ width: 40 }}>
        <Checkbox
          onClick={e => {
            let newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
            const isRowCurrentlyChecked = checkedRows.indexOf(rowIndex) > -1;

            if (e.shiftKey && rowIndex !== lastCheckedRow) {
              var start = rowIndex;
              var end = lastCheckedRow;
              for (
                var i = Math.min(start, end);
                i < Math.max(start, end) + 1;
                i++
              ) {
                const isLastCheckedRowCurrentlyChecked =
                  checkedRows.indexOf(lastCheckedRow) > -1;
                let tempEntity = entities[i];
                if (isLastCheckedRowCurrentlyChecked) {
                  newIdMap[tempEntity.id] = true;
                } else {
                  delete newIdMap[tempEntity.id];
                }
              }
            } else {
              //no shift key
              if (isRowCurrentlyChecked) {
                delete newIdMap[entity.id];
              } else {
                newIdMap[entity.id] = true;
              }
            }

            reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
            this.setState({ lastCheckedRow: rowIndex });
          }}
          className={"tg-checkbox-cell-inner"}
          checked={isSelected}
        />
      </Cell>
    );
  };

  renderCell = (rowIndex: number, columnIndex: number) => {
    const {
      entities,
      schema,
      history,
      onDoubleClick,
      cellRenderer,
      withCheckboxes
    } = this.props;
    const { columns } = this.state;
    const column = columns[columnIndex + (withCheckboxes ? -1 : 0)];
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

  renderCheckboxHeader = (columnIndex: number) => {
    const { entities, reduxFormSelectedEntityIdMap } = this.props;
    const checkedRows = getSelectedRowsFromEntities(
      entities,
      reduxFormSelectedEntityIdMap.input.value
    );
    const checkboxProps = {
      checked: false,
      indeterminate: false
    };
    if (checkedRows.length === entities.length) {
      //tnr: maybe this will need to change if we want enable select all across pages
      checkboxProps.checked = true;
    } else {
      if (checkedRows.length) {
        checkboxProps.indeterminate = true;
      }
    }

    return (
      <ColumnHeaderCell className={"tg-checkbox-header-cell"}>
        <Checkbox
          onChange={e => {
            let newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
            Array.from(Array(entities.length).keys()).forEach(function(i) {
              if (checkboxProps.checked) {
                delete newIdMap[entities[i].id];
              } else {
                newIdMap[entities[i].id] = true;
              }
            });

            reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
            this.setState({ lastCheckedRow: undefined });
            // this.setState({selectedRegions: getSelectedRegionsFromRowsArray(newRows)})
          }}
          {...checkboxProps}
          className={"tg-checkbox-cell-inner"}
        />
      </ColumnHeaderCell>
    );
  };

  renderColumnHeader = (columnIndex: number) => {
    const {
      schema,
      setFilter,
      setOrder,
      order,
      filterOn,
      withCheckboxes
    } = this.props;
    const { columns } = this.state;
    const schemaIndex =
      columns[columnIndex + (withCheckboxes ? -1 : 0)]["schemaIndex"];
    const schemaForField = schema.fields[schemaIndex];
    const { displayName, sortDisabled } = schemaForField;
    const columnDataType = schemaForField.type;
    const ccDisplayName = camelCase(displayName);
    const activeFilterClass =
      filterOn === ccDisplayName ? " tg-active-filter" : "";
    let ordering;

    if (order && order.length) {
      order.forEach(function(order) {
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

    const isOrderedDown = ordering && ordering === "asc";
    // const menu = this.renderMenu(columnDataType, schemaForField);
    return (
      <ColumnHeaderCell>
        <div className={"tg-datatable-column-header"}>
          <span title={displayName} className={"tg-datatable-name"}>
            {displayName + "  "}
          </span>
          {!sortDisabled &&
            <div className={"tg-sort-arrow-container"}>
              <span
                title={"Sort Z-A"}
                onClick={() => {
                  setOrder("reverse:" + ccDisplayName);
                }}
                className={
                  "pt-icon-standard pt-icon-chevron-up " +
                  (ordering && !isOrderedDown ? "tg-active-sort" : "")
                }
              />
              <span
                title={"Sort A-Z"}
                onClick={() => {
                  setOrder(ccDisplayName);
                }}
                className={
                  "pt-icon-standard pt-icon-chevron-down " +
                  (ordering && isOrderedDown ? "tg-active-sort" : "")
                }
              />
            </div>}
          <Popover position={Position.BOTTOM_RIGHT}>
            <Button
              title={"Filter"}
              className={
                "tg-filter-menu-button " + Classes.MINIMAL + activeFilterClass
              }
              iconName="filter"
            />
            <FilterAndSortMenu
              setFilter={setFilter}
              filterOn={ccDisplayName}
              dataType={columnDataType}
              schemaForField={schemaForField}
            />
          </Popover>
        </div>
      </ColumnHeaderCell>
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

function getSelectedRowsFromEntities(entities, idMap) {
  if (!idMap) return [];
  return entities.reduce((acc, entity, i) => {
    if (idMap[entity.id]) {
      acc.push(i);
    }
    return acc;
  }, []);
}

function getSelectedRegionsFromRowsArray(rowsArray) {
  //tnr note: selected regions are structured as blocks of regions
  // use getSelectedRowsFromRegions() to get the rows!
  // selectedRegions: [
  //     {
  //         "rows": [
  //             0, //selection block 1 going from row 0 to 1
  //             1
  //         ]
  //     },
  //     {
  //         "rows": [
  //             3, //selection block 2 going from row 3 to 3
  //             3
  //         ]
  //     }
  // ]
  const selectedRegions = rowsArray
    .sort()
    .reduce((acc, rowNum, i) => {
      const rowNumBefore = rowsArray[i - 1];
      const rowNumAfter = rowsArray[i + 1];
      if (rowNumBefore && rowNumBefore === rowNum - 1) {
        const arrayToAddTo = acc.find(o => o.rows.indexOf(rowNumBefore) > -1)
          .rows;
        arrayToAddTo.push(rowNum);
      } else {
        const rows = [rowNum];
        if (!rowNumAfter || (rowNumAfter && rowNumAfter > rowNum + 1))
          rows.push(rowNum);
        acc.push({
          rows
        });
      }
      return acc;
    }, [])
    .forEach(o => {
      if (o.rows.length > 2) o.rows = [o.rows[0], o.rows[o.rows.length - 1]];
    });
  return selectedRegions;
}
// <ColumnHeaderCell
//   name={
//     <span title={displayName}>
//       <span>
//         {displayName + "  "}
//         {ordering &&
//           (ordering === "asc"
//             ? <span className={"pt-icon-standard pt-icon-arrow-down"} />
//             : <span className={"pt-icon-standard pt-icon-arrow-up"} />)}
//       </span>
//     </span>
//   }
//   renderMenu={function() {
//     return (
//       <FilterAndSortMenu
//         sortDisabled={sortDisabled}
//         setFilter={setFilter}
//         setOrder={setOrder}
//         filterOn={camelCase(displayName)}
//         dataType={columnDataType}
//         schemaForField={schemaForField}
//       />
//     );
//   }}
// />

function getIdMapFromSelectedRows(entities, selectedRows) {
  return selectedRows.reduce(function(acc, rowNum) {
    acc[entities[rowNum].id] = true;
    return acc;
  }, {});
}
