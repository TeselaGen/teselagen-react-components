//@flow
import { withRouter } from "react-router-dom";
import { Fields, reduxForm } from "redux-form";
// import { connect } from "react-redux";
import compose from "lodash/fp/compose";
import { isEmpty, min, max, range } from "lodash";
import "../toastr";
import React from "react";
import moment from "moment";
import PagingTool from "./PagingTool";
import camelCase from "lodash/camelCase";
import { onEnterHelper } from "../utils/handlerHelpers";
import FilterAndSortMenu from "./FilterAndSortMenu";

import {
  Button,
  Menu,
  InputGroup,
  Spinner,
  Popover,
  Classes,
  Position,
  ContextMenu
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
            sortable={false}
            getTrProps={(state, rowInfo) => {
              if (!rowInfo) return {};
              const rowId = rowInfo.original.id;
              const rowSelected =
                reduxFormSelectedEntityIdMap.input.value[rowId];
              return {
                onClick: e => {
                  this.handleRowClick(e, rowInfo);
                },
                onContextMenu: e => {
                  e.preventDefault();
                  if (rowId === undefined) return;
                  const oldIdMap =
                    reduxFormSelectedEntityIdMap.input.value || {};
                  const newIdMap = oldIdMap[rowId]
                    ? oldIdMap
                    : { [rowId]: true };
                  reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
                  this.showContextMenu(newIdMap, e);
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

  handleRowClick = (e, rowInfo) => {
    const rowId = rowInfo.original.id;
    const { reduxFormSelectedEntityIdMap, entities } = this.props;
    if (rowId === undefined) return;
    const ctrl = e.metaKey || e.ctrlKey;
    const oldIdMap = reduxFormSelectedEntityIdMap.input.value || {};
    let newIdMap = {
      [rowId]: true
    };
    if (ctrl) {
      newIdMap = {
        ...oldIdMap,
        ...newIdMap
      };
    } else if (e.shiftKey && !isEmpty(oldIdMap)) {
      const currentlySelectedRowIndices = entities.reduce((acc, entity, i) => {
        return oldIdMap[entity.id] ? acc.concat(i) : acc;
      }, []);
      if (currentlySelectedRowIndices.length) {
        const minIndex = min(currentlySelectedRowIndices);
        const maxIndex = max(currentlySelectedRowIndices);
        if (rowInfo.index < minIndex || rowInfo.index > maxIndex) {
          if (
            rowInfo.index === minIndex - 1 ||
            rowInfo.index === maxIndex + 1
          ) {
            newIdMap = {
              ...oldIdMap,
              ...newIdMap
            };
          } else {
            const highRange =
              rowInfo.index < minIndex ? minIndex : rowInfo.index;
            const lowRange =
              rowInfo.index < minIndex ? rowInfo.index : maxIndex;
            range(lowRange, highRange).forEach(index => {
              const recordId = entities[index] && entities[index].id;
              if (recordId || recordId === 0) newIdMap[recordId] = true;
            });
            newIdMap = {
              ...oldIdMap,
              ...newIdMap
            };
          }
        }
      }
    }
    reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
  };

  showContextMenu = (idMap, e) => {
    const { entities, history, contextMenu } = this.props;
    const selectedRecords = entities.reduce((acc, entity) => {
      return idMap[entity.id] ? acc.concat(entity) : acc;
    }, []);
    const itemsToRender = contextMenu({
      selectedRecords,
      history
    });
    if (!itemsToRender) return null;
    const menu = (
      <Menu>
        {itemsToRender}
      </Menu>
    );
    ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
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
