import deepEqual from "deep-equal";
import { connect } from "react-redux";
import { Fields, reduxForm } from "redux-form";
import { compose } from "redux";
import { range, take, drop } from "lodash";
import React from "react";
import moment from "moment";
import uniqid from "uniqid";
import camelCase from "lodash/camelCase";
import {
  Button,
  Menu,
  Spinner,
  Popover,
  Classes,
  Position,
  ContextMenu,
  Checkbox
} from "@blueprintjs/core";
import classNames from "classnames";
import { getSelectedRowsFromEntities } from "./utils/selection";
import rowClick, { finalizeSelection } from "./utils/rowClick";
import ReactTable from "react-table";
import PagingTool from "./PagingTool";
import FilterAndSortMenu from "./FilterAndSortMenu";
import getIdOrCode from "./utils/getIdOrCode";
import { filterEntitiesLocal, orderEntitiesLocal } from "./utils/queryParams";
import SearchBar from "./SearchBar";
import "../toastr";
import "./style.css";
import withTableParams from "./utils/withTableParams";

const ROW_HEIGHT = 35;

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
    maxHeight: 800,
    localConnected: false, //we aren't connected to an external db for our sorting/filtering/paging
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
    onDeselect: noop,
    addFilters: noop,
    removeSingleFilter: noop,
    filters: []
  };

  componentWillMountOrReceiveProps = (oldProps, newProps) => {
    //handle programatic filter adding
    if (!deepEqual(newProps.additionalFilters, oldProps.additionalFilters)) {
      newProps.addFilters(newProps.additionalFilters);
    }
    if (!deepEqual(newProps.schema, oldProps.schema)) {
      const { schema = {} } = newProps;
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
    //handle local sorting!
    let newEntities;
    let newEntityCount;
    if (
      !deepEqual(
        {
          entities: newProps.entities,
          schema: newProps.schema,
          order: newProps.order,
          filters: newProps.filters,
          pageSize: newProps.pageSize,
          page: newProps.page,
          isInfinite: newProps.isInfinite,
          entityCount: newProps.entityCount,
          searchTerm: newProps.searchTerm
        },
        {
          entities: oldProps.entities,
          schema: oldProps.schema,
          order: oldProps.order,
          filters: oldProps.filters,
          pageSize: oldProps.pageSize,
          page: oldProps.page,
          isInfinite: oldProps.isInfinite,
          entityCount: oldProps.entityCount,
          searchTerm: oldProps.searchTerm
        }
      )
    ) {
      const {
        schema = {},
        order,
        entities,
        filters,
        pageSize,
        page,
        isInfinite,
        entityCount,
        searchTerm
      } = newProps;
      newEntities = entities;
      newEntityCount = entityCount;
      if (newProps.localConnected) {
        //if the table is local (aka not directly connected to a db) then we need to
        //handle filtering/paging/sorting all on the front end
        newEntities = filterEntitiesLocal(
          filters,
          searchTerm,
          newEntities,
          schema
        );
        newEntities = orderEntitiesLocal(order, newEntities, schema);

        newEntityCount = newEntities.length;
        //calculate the sorted, filtered, paged entities for the local table

        if (!isInfinite) {
          const offset = (page - 1) * pageSize;
          newEntities = take(drop(newEntities, offset), pageSize);
        }
      }
      this.setState({ entities: newEntities, entityCount: newEntityCount });
    }

    // handle programmatic selection and scrolling
    const { tableId } = this.state;
    const { selectedIds } = newProps;
    const { selectedIds: oldSelectedIds, entities: oldEntities } = oldProps;
    newEntities = newEntities || oldEntities;
    if (selectedIds === oldSelectedIds) return;
    const idArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    const newIdMap = idArray.reduce((acc, idOrCode) => {
      acc[idOrCode] = true;
      return acc;
    }, {});
    finalizeSelection({ idMap: newIdMap, props: newProps });
    const idToScrollTo = idArray[0];
    if (!idToScrollTo && idToScrollTo !== 0) return;
    const entityIndexToScrollTo = newEntities.findIndex(
      e => e.id === idToScrollTo || e.code === idToScrollTo
    );
    if (entityIndexToScrollTo === -1) return;
    const scrollHeight = ROW_HEIGHT * entityIndexToScrollTo;
    const tableBody = document.getElementById(tableId);
    if (tableBody) tableBody.scrollTop = scrollHeight;
  };

  componentWillReceiveProps(newProps) {
    this.componentWillMountOrReceiveProps(this.props, newProps);
  }
  componentWillMount() {
    // table id is used for programmatic scroll
    const tableId = uniqid();
    this.setState({ tableId });
    this.componentWillMountOrReceiveProps({}, this.props);
  }

  render() {
    const {
      extraClasses,
      tableName,
      isLoading,
      searchTerm,
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
      schema,
      filters,
      errorParsingUrlString,
      compact
    } = this.props;
    const { entities, tableId, entityCount } = this.state;
    const hasFilters = filters.length || searchTerm;
    const filtersOnNonDisplayedFields = [];
    if (filters && filters.length) {
      schema.fields.forEach(({ isHidden, displayName }) => {
        const ccDisplayName = camelCase(displayName);
        if (isHidden) {
          filters.forEach(filter => {
            if (filter.filterOn === ccDisplayName) {
              filtersOnNonDisplayedFields.push({
                ...filter,
                displayName
              });
            }
          });
        }
      });
    }
    const numRows = isInfinite ? entities.length : pageSize;
    const maybeSpinner = isLoading ? (
      <Spinner className={Classes.SMALL} />
    ) : (
      undefined
    );

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
            withTitle && (
              <span className={"data-table-title"}>{tableName}</span>
            )}
            {this.props.children}
          </div>
          {errorParsingUrlString && (
            <span className={"pt-icon-error pt-intent-warning"}>
              Error parsing URL
            </span>
          )}
          {filtersOnNonDisplayedFields.length ? (
            filtersOnNonDisplayedFields.map(
              ({ displayName, selectedFilter, filterValue }) => {
                return (
                  <div
                    key={displayName}
                    className={"tg-filter-on-non-displayed-field"}
                  >
                    <span className={"pt-icon-filter"} />
                    <span>
                      {" "}
                      {displayName} {selectedFilter} {filterValue}{" "}
                    </span>
                  </div>
                );
              }
            )
          ) : (
            ""
          )}
          {withSearch && (
            <div className={"data-table-search-and-clear-filter-container"}>
              {hasFilters ? (
                <Button
                  className={"data-table-clear-filters"}
                  onClick={() => {
                    clearFilters();
                  }}
                  text={"Clear filters"}
                />
              ) : (
                ""
              )}
              <SearchBar
                {...{
                  reduxFormSearchInput,
                  setSearchTerm,
                  maybeSpinner
                }}
              />
            </div>
          )}
        </div>
        <ReactTable
          data={entities}
          columns={this.renderColumns()}
          pageSize={rowsToShow}
          showPagination={false}
          sortable={false}
          loading={isLoading}
          getTbodyProps={() => ({
            id: tableId
          })}
          getTrGroupProps={this.getTableRowProps}
          NoDataComponent={({ children }) =>
            isLoading ? null : <div className="rt-noData">{children}</div>}
          style={{
            maxHeight,
            margin: "20px 0",
            ...style
          }}
          className={classNames({ compact })}
        />
        <div className={"data-table-footer"}>
          <div className={"tg-react-table-selected-count"}>
            {selectedRowCount > 0 ? (
              ` ${selectedRowCount} Record${selectedRowCount === 1
                ? ""
                : "s"} Selected `
            ) : (
              ""
            )}
          </div>
          {!isInfinite &&
          withPaging &&
          (hidePageSizeWhenPossible ? entityCount > pageSize : true) ? (
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
          ) : (
            <div className={"tg-placeholder"} />
          )}
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
        rowClick(e, rowInfo, this.state.entities, this.props);
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
    const { reduxFormSelectedEntityIdMap, isSingleSelect } = this.props;
    const { entities } = this.state;
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
        {!isSingleSelect && (
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
          />
        )}
      </div>
    );
  };

  renderCheckboxCell = row => {
    const rowIndex = row.index;
    const { reduxFormSelectedEntityIdMap, isSingleSelect } = this.props;
    const { entities } = this.state;
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
        tableColumn.Cell = props => (
          <span>{moment(new Date(props.value)).format("MMM D, YYYY")}</span>
        );
      } else if (schemaForColumn.type === "boolean") {
        tableColumn.Cell = props => (
          <span>{props.value ? "True" : "False"}</span>
        );
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
    const { history, contextMenu } = this.props;
    const { entities } = this.state;
    const selectedRecords = entities.reduce((acc, entity) => {
      return idMap[getIdOrCode(entity)] ? acc.concat(entity) : acc;
    }, []);
    const itemsToRender = contextMenu({
      selectedRecords,
      history
    });
    if (!itemsToRender) return null;
    const menu = <Menu>{itemsToRender}</Menu>;
    ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
  };

  renderColumnHeader = column => {
    const {
      schema,
      addFilters,
      setOrder,
      order,
      filters,
      removeSingleFilter
    } = this.props;
    const schemaIndex = column["schemaIndex"];
    const schemaForField = schema.fields[schemaIndex];
    const { displayName, sortDisabled, path } = schemaForField;
    const columnDataType = schemaForField.type;
    const ccDisplayName = camelCase(displayName);
    const currentFilter =
      filters &&
      filters.length &&
      filters.filter(({ filterOn }) => {
        return filterOn === ccDisplayName;
      })[0];
    const activeFilterClass = currentFilter ? "tg-active-filter" : "";
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

    const sortDown = ordering && ordering === "asc";
    const sortUp = ordering && !sortDown;

    return (
      <div className={"tg-react-table-column-header"}>
        <span title={displayName} className={"tg-react-table-name"}>
          {displayName + "  "}
        </span>
        {!sortDisabled && (
          <div className={"tg-sort-arrow-container"}>
            <span
              title={"Sort Z-A (Hold shift to sort multiple columns)"}
              onClick={e => {
                setOrder("-" + ccDisplayName, sortUp, e.shiftKey);
              }}
              className={
                "pt-icon-standard pt-icon-chevron-up " +
                (sortUp ? "tg-active-sort" : "")
              }
            />
            <span
              title={"Sort A-Z (Hold shift to sort multiple columns)"}
              onClick={e => {
                setOrder(ccDisplayName, sortDown, e.shiftKey);
              }}
              className={
                "pt-icon-standard pt-icon-chevron-down " +
                (sortDown ? "tg-active-sort" : "")
              }
            />
          </div>
        )}
        <Popover position={Position.BOTTOM_RIGHT}>
          <Button
            title={"Filter"}
            className={classNames(
              "tg-filter-menu-button",
              Classes.MINIMAL,
              activeFilterClass,
              Classes.SMALL
            )}
            iconName="filter"
          />
          <FilterAndSortMenu
            addFilters={addFilters}
            removeSingleFilter={removeSingleFilter}
            currentFilter={currentFilter}
            filterOn={ccDisplayName}
            dataType={columnDataType}
            schemaForField={schemaForField}
          />
        </Popover>
      </div>
    );
  };
}

export default compose(
  //connect to withTableParams here in the dataTable component so that, in the case that the table is not manually connected,
  withTableParams({
    isLocalCall: true
  }),
  connect((state, ownProps) => {
    if (!ownProps.isTableParamsConnected) {
      //this is the case where we're hooking up to withTableParams locally, so we need to take the tableParams off the props
      //and set localConnected: true
      return {
        localConnected: true, //we aren't connected to an external db for our sorting/filtering/paging
        ...ownProps.tableParams
      };
    } else {
      return {};
    }
  }),
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
