import { withRouter } from "react-router-dom";
import { Fields, reduxForm } from "redux-form";
import { compose } from "redux";
import { range, isNumber } from "lodash";
import React from "react";
import moment from "moment";

import camelCase from "lodash/camelCase";
import {
  Button,
  Menu,
  InputGroup,
  Spinner,
  Popover,
  Classes,
  Position,
  ContextMenu,
  Checkbox
} from "@blueprintjs/core";

import { onEnterHelper } from "../utils/handlerHelpers";
import { getSelectedRowsFromEntities } from "./utils/selection";
import rowClick from "./utils/rowClick";
import ReactTable from "react-table";
import PagingTool from "./PagingTool";
import FilterAndSortMenu from "./FilterAndSortMenu";
import getIdOrCode from "./utils/getIdOrCode";
import "../toastr";
import "./style.css";

const noop = () => {};
class ReactDataTable extends React.Component {
  state = {
    columns: []
  };

  static defaultProps = {
    entities: [],
    withTitle: true,
    withSearch: true,
    withPaging: true,
    hidePageSizeWhenPossible: false,
    pageSize: 10,
    extraClasses: "",
    page: 1,
    style: {},
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    isLoading: false,
    isInfinite: false,
    isSingleSelect: false,
    withCheckboxes: false,
    setSearchTerm: noop,
    setFilter: noop,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    onDoubleClick: noop,
    onMultiRowSelect: noop,
    onSingleRowSelect: noop,
    onDeselect: noop
  };

  componentWillMount() {
    const { schema = {} } = this.props;
    const columns = schema.fields
      ? schema.fields.reduce((columns, field, schemaIndex) => {
          return field.isHidden
            ? columns
            : columns.concat({
                displayName: field.displayName,
                width: field.width,
                schemaIndex
              });
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
      hidePageSizeWhenPossible,
      doNotShowEmptyRows,
      setPage,
      withTitle,
      withSearch,
      withPaging,
      isInfinite,
      onRefresh,
      page,
      maxHeight,
      style,
      pageSize,
      reduxFormSearchInput,
      reduxFormSelectedEntityIdMap,
      selectedFilter
    } = this.props;
    let entityCountToUse = !isNumber(entityCount)
      ? entities.length
      : entityCount;
    const hasFilters = selectedFilter || searchTerm;
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading
      ? <Spinner className={Classes.SMALL} />
      : undefined;

    const selectedRowCount = Object.keys(
      reduxFormSelectedEntityIdMap.input.value || {}
    ).length;

    let rowsToShow = doNotShowEmptyRows
      ? Math.min(numRows, entities.length)
      : numRows;
    // if there are no entities then provide enough space to show
    // no rows found message
    if (entities.length === 0 && rowsToShow < 3) rowsToShow = 3;
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
                    onClick={() => {
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
        <ReactTable
          data={entities}
          columns={this.renderColumns()}
          pageSize={rowsToShow}
          showPagination={false}
          sortable={false}
          loading={isLoading}
          getTrGroupProps={this.getTableRowProps}
          style={{
            maxHeight,
            margin: "20px 0",
            ...style
          }}
        />
        <div className={"data-table-footer"}>
          <div className={"tg-react-table-selected-count"}>
            {selectedRowCount > 0
              ? ` ${selectedRowCount} Record${selectedRowCount === 1
                  ? ""
                  : "s"} Selected `
              : ""}
          </div>
          {!isInfinite &&
          withPaging &&
          (hidePageSizeWhenPossible ? entityCountToUse > pageSize : true)
            ? <PagingTool
                paging={{
                  total: entityCountToUse,
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

  getTableRowProps = (state, rowInfo) => {
    const {
      reduxFormSelectedEntityIdMap,
      withCheckboxes,
      onDoubleClick,
      history
    } = this.props;
    if (!rowInfo) return {};
    const rowId = getIdOrCode(rowInfo.original);
    const rowSelected = reduxFormSelectedEntityIdMap.input.value[rowId];
    return {
      onClick: e => {
        if (withCheckboxes) return;
        rowClick(e, rowInfo, this.props);
      },
      onContextMenu: e => {
        e.preventDefault();
        if (rowId === undefined) return;
        const oldIdMap = reduxFormSelectedEntityIdMap.input.value || {};
        let newIdMap;
        if (withCheckboxes) {
          newIdMap = oldIdMap;
        } else {
          // if we are not using checkboxes we need to make sure
          // that the id of the record gets added to the id map
          newIdMap = oldIdMap[rowId] ? oldIdMap : { [rowId]: true };
          reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
        }
        this.showContextMenu(newIdMap, e);
      },
      className: rowSelected && !withCheckboxes ? "selected" : "",
      onDoubleClick: () => {
        onDoubleClick(rowInfo.original, rowInfo.index, history);
      }
    };
  };

  renderCheckboxHeader = () => {
    const {
      entities,
      reduxFormSelectedEntityIdMap,
      isSingleSelect
    } = this.props;
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
      <div>
        {!isSingleSelect &&
          <Checkbox
            onChange={() => {
              const newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
              range(entities.length).forEach(i => {
                const entityId = getIdOrCode(entities[i]);
                if (checkboxProps.checked) {
                  delete newIdMap[entityId];
                } else {
                  newIdMap[entityId] = true;
                }
              });

              reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
              this.setState({ lastCheckedRow: undefined });
            }}
            {...checkboxProps}
            className={"tg-react-table-checkbox-cell-inner"}
          />}
      </div>
    );
  };

  renderCheckboxCell = row => {
    const rowIndex = row.index;
    const {
      entities,
      reduxFormSelectedEntityIdMap,
      isSingleSelect
    } = this.props;
    const checkedRows = getSelectedRowsFromEntities(
      entities,
      reduxFormSelectedEntityIdMap.input.value
    );
    const { lastCheckedRow } = this.state;

    const isSelected = checkedRows.some(rowNum => {
      return rowNum === rowIndex;
    });
    if (rowIndex >= entities.length) {
      return <div />;
    }
    const entity = entities[rowIndex];
    return (
      <div className={"tg-react-table-checkbox-cell"} style={{ width: 40 }}>
        <Checkbox
          onClick={e => {
            let newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
            const isRowCurrentlyChecked = checkedRows.indexOf(rowIndex) > -1;
            const entityId = getIdOrCode(entity);
            if (isSingleSelect) {
              newIdMap = { [entityId]: true };
            } else if (e.shiftKey && rowIndex !== lastCheckedRow) {
              const start = rowIndex;
              const end = lastCheckedRow;
              for (
                let i = Math.min(start, end);
                i < Math.max(start, end) + 1;
                i++
              ) {
                const isLastCheckedRowCurrentlyChecked =
                  checkedRows.indexOf(lastCheckedRow) > -1;
                const tempEntity = entities[i];
                const tempEntityId = getIdOrCode(tempEntity);
                if (isLastCheckedRowCurrentlyChecked) {
                  newIdMap[tempEntityId] = true;
                } else {
                  delete newIdMap[tempEntityId];
                }
              }
            } else {
              //no shift key
              if (isRowCurrentlyChecked) {
                delete newIdMap[entityId];
              } else {
                newIdMap[entityId] = true;
              }
            }

            reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
            this.setState({ lastCheckedRow: rowIndex });
          }}
          className={"tg-react-table-checkbox-cell-inner"}
          checked={isSelected}
        />
      </div>
    );
  };

  renderColumns = () => {
    const { schema, cellRenderer, withCheckboxes } = this.props;
    const { columns } = this.state;
    if (!columns.length) {
      return;
    }
    let columnsToRender = withCheckboxes
      ? [
          {
            Header: this.renderCheckboxHeader,
            Cell: this.renderCheckboxCell,
            width: 35,
            resizable: false,
            getHeaderProps: () => {
              return {
                className: "tg-react-table-checkbox-header-container"
              };
            },
            getProps: () => {
              return {
                className: "tg-react-table-checkbox-cell-container"
              };
            }
          }
        ]
      : [];
    columns.forEach(column => {
      const schemaForColumn = schema.fields[column.schemaIndex];
      const tableColumn = {
        Header: this.renderColumnHeader(column),
        accessor: schemaForColumn.path
      };
      if (column.width) {
        tableColumn.width = column.width;
      }
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
        tableColumn.Cell = cellRenderer[schemaForColumn.path];
        tableColumn.Cell = row => {
          const val = cellRenderer[schemaForColumn.path](
            row.value,
            row.original,
            row
          );
          return val;
        };
      }
      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  showContextMenu = (idMap, e) => {
    const { entities, history, contextMenu } = this.props;
    const selectedRecords = entities.reduce((acc, entity) => {
      return idMap[getIdOrCode(entity)] ? acc.concat(entity) : acc;
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

  renderColumnHeader = column => {
    const { schema, setFilter, setOrder, order, filterOn } = this.props;
    const schemaIndex = column["schemaIndex"];
    const schemaForField = schema.fields[schemaIndex];
    const { displayName, sortDisabled } = schemaForField;
    const columnDataType = schemaForField.type;
    const ccDisplayName = camelCase(displayName);
    const activeFilterClass =
      filterOn === ccDisplayName ? " tg-active-filter" : "";
    let ordering;

    if (order && order.length) {
      order.forEach(order => {
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
}

function SearchBar({ reduxFormSearchInput, setSearchTerm, maybeSpinner }) {
  return (
    <InputGroup
      className={"pt-round datatable-search-input"}
      placeholder="Search..."
      {...reduxFormSearchInput.input}
      {...onEnterHelper(() => {
        setSearchTerm(reduxFormSearchInput.input.value);
      })}
      rightElement={
        maybeSpinner ||
        <Button
          className={Classes.MINIMAL}
          iconName={"pt-icon-search"}
          onClick={() => {
            setSearchTerm(reduxFormSearchInput.input.value);
          }}
        />
      }
    />
  );
}

export default compose(
  withRouter,
  reduxForm({ form: "tgReactTable" }) //this can be and often is overridden at runtime (by passing a form prop)
)(props => {
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
