//@flow
import { withRouter } from "react-router-dom";
import { Fields, reduxForm } from "redux-form";
// import { connect } from "react-redux";
import compose from "lodash/fp/compose";

import "../toastr";
import React from "react";
import moment from "moment";
import PagingTool from "./PagingTool";
import camelCase from "lodash/camelCase";
import { onEnterHelper } from "../utils/handlerHelpers";
import getSelectedRowsFromRegions from "./utils/getSelectedRowsFromRegions";
import FilterAndSortMenu from "./FilterAndSortMenu";

import {
  Button,
  Menu,
  InputGroup,
  Spinner,
  Popover,
  Classes,
  Position
} from "@blueprintjs/core";
import ReactTable from "react-table";
import { RegionCardinality, Regions } from "@blueprintjs/table";

import "./style.css";
function noop() {}
class ReactDataTable extends React.Component {
  state = {
    dimensions: {
      width: -1
    },
    columns: []
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
          }
          columns.push({ displayName: field.displayName, schemaIndex: i });
          return columns;
        }, [])
      : [];
    this.setState({ columns });
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
      onRefresh,
      onDoubleClick,
      page,
      height,
      pageSize,
      reduxFormSearchInput,
      reduxFormSelectedEntityIdMap,
      selectedFilter,
      history
    } = this.props;

    const hasFilters = selectedFilter || searchTerm;
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading
      ? <Spinner className={Classes.SMALL} />
      : undefined;

    const selectedRowCount = Object.keys(
      reduxFormSelectedEntityIdMap.input.value || {}
    ).length;

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
          <ReactTable
            data={entities}
            columns={this.getColumns()}
            defaultPageSize={numRows}
            showPagination={false}
            sorting={false}
            getTrProps={(state, rowInfo) => {
              if (!rowInfo) return {};
              const rowSelected =
                reduxFormSelectedEntityIdMap.input.value[rowInfo.original.id];
              return {
                onClick: () => {
                  reduxFormSelectedEntityIdMap.input.onChange({
                    [rowInfo.original.id]: true
                  });
                },
                onContextMenu: () => {
                  //console.log('row context menu')
                },
                className: rowSelected ? "selected" : "",
                onDoubleClick: () => {
                  onDoubleClick(rowInfo.original, rowInfo.index, history);
                }
              };
            }}
          />
        </div>
        <div className={"data-table-footer"}>
          <div className={"tg-react-table-selected-count"}>
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

  getColumns = () => {
    const { schema, cellRenderer } = this.props;
    const { columns } = this.state;
    if (!columns.length) {
      return;
    }
    return columns.map(column => {
      const schemaForColumn = schema.fields[column.schemaIndex];
      const tableColumn = {
        Header: this.renderColumnHeader(column.schemaIndex),
        accessor: schemaForColumn.path
      };
      if (schemaForColumn.type === "timestamp") {
        tableColumn.Cell = props =>
          <span>
            {moment(new Date(props.value)).format("MMM D, YYYY")}
          </span>;
      } else if (schemaForColumn.type === "boolean") {
        tableColumn.Cell = props =>
          <span>
            {props.value ? "True" : "False"}
          </span>;
      }
      if (cellRenderer && cellRenderer[schemaForColumn.path]) {
        tableColumn.Cell = props =>
          <span>
            {cellRenderer[schemaForColumn.path](props)}
          </span>;
      }
      return tableColumn;
    });
  };

  renderBodyContextMenu = ({ regions }) => {
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

  renderColumnHeader = columnIndex => {
    const { schema, setFilter, setOrder, order, filterOn } = this.props;
    const { columns } = this.state;
    const column = columns[columnIndex];
    const schemaIndex = column["schemaIndex"];
    const schemaForField = schema.fields[schemaIndex];
    const { displayName, sortDisabled } = schemaForField;
    const columnDataType = schemaForField.type;
    const ccDisplayName = camelCase(displayName);
    const activeFilterClass =
      filterOn === ccDisplayName ? " tg-active-filter" : "";
    let ordering;

    if (order && order.length) {
      order.forEach(function(order) {
        const orderField = order.replace("-", "");
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
      <div className={"tg-react-table-column-header"}>
        <span title={displayName} className={"tg-react-table-name"}>
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
            onClick={e => {
              e.stopPropagation();
            }}
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
    );
  };

  // renderMenu = (dataType: TableDataTypes, schemaForField: SchemaForField) => {
  //   return <FilterAndSortMenu  dataType={dataType} schemaForField={schemaForField}/>;
  // };

  selectedRegionTransform = region => {
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

export default compose(
  withRouter,
  reduxForm({ form: "tgReactTable" })
)(function ReduxFormWrapper(props) {
  return (
    <Fields
      names={[
        "reduxFormQueryParams",
        "reduxFormSearchInput",
        "reduxFormSelectedEntityIdMap"
      ]}
      {...props}
      component={ReactDataTable}
    />
  );
});

// function getSelectedRowsFromEntities(entities, idMap) {
//   if (!idMap) return []
//   return entities.reduce((acc, entity, i) => {
//     if (idMap[entity.id]) {
//       acc.push(i)
//     }
//     return acc
//   }, [])
// }

// function getSelectedRegionsFromRowsArray(rowsArray) {
//   //tnr note: selected regions are structured as blocks of regions
//   // use getSelectedRowsFromRegions() to get the rows!
//   // selectedRegions: [
//   //     {
//   //         "rows": [
//   //             0, //selection block 1 going from row 0 to 1
//   //             1
//   //         ]
//   //     },
//   //     {
//   //         "rows": [
//   //             3, //selection block 2 going from row 3 to 3
//   //             3
//   //         ]
//   //     }
//   // ]
//   const selectedRegions = rowsArray
//     .sort()
//     .reduce((acc, rowNum, i) => {
//       const rowNumBefore = rowsArray[i - 1]
//       const rowNumAfter = rowsArray[i + 1]
//       if (rowNumBefore && rowNumBefore === rowNum - 1) {
//         const arrayToAddTo = acc.find(o => o.rows.indexOf(rowNumBefore) > -1)
//           .rows
//         arrayToAddTo.push(rowNum)
//       } else {
//         const rows = [rowNum]
//         if (!rowNumAfter || (rowNumAfter && rowNumAfter > rowNum + 1))
//           rows.push(rowNum)
//         acc.push({
//           rows
//         })
//       }
//       return acc
//     }, [])
//     .forEach(o => {
//       if (o.rows.length > 2) o.rows = [o.rows[0], o.rows[o.rows.length - 1]]
//     })
//   return selectedRegions
// }
// // <ColumnHeaderCell
// //   name={
// //     <span title={displayName}>
// //       <span>
// //         {displayName + "  "}
// //         {ordering &&
// //           (ordering === "asc"
// //             ? <span className={"pt-icon-standard pt-icon-arrow-down"} />
// //             : <span className={"pt-icon-standard pt-icon-arrow-up"} />)}
// //       </span>
// //     </span>
// //   }
// //   renderMenu={function() {
// //     return (
// //       <FilterAndSortMenu
// //         sortDisabled={sortDisabled}
// //         setFilter={setFilter}
// //         setOrder={setOrder}
// //         filterOn={camelCase(displayName)}
// //         dataType={columnDataType}
// //         schemaForField={schemaForField}
// //       />
// //     );
// //   }}
// // />

// function getIdMapFromSelectedRows(entities, selectedRows) {
//   return selectedRows.reduce(function(acc, rowNum) {
//     if (entities[rowNum]) acc[entities[rowNum].id] = true
//     return acc
//   }, {})
// }
