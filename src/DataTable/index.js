import deepEqual from "deep-equal";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import React from "react";
import moment from "moment";
import uniqid from "uniqid";
import { camelCase, get, toArray } from "lodash";
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
import SearchBar from "./SearchBar";
import { getSelectedRecordsFromEntities } from "./utils/selection";
import DisplayOptions from "./DisplayOptions";
import withQuery from "../enhancers/withQuery";
import withUpsert from "../enhancers/withUpsert";
import tableConfigurationFragment from "./utils/tableConfigurationFragment";
import currentUserFragment from "./utils/currentUserFragment";
import fieldOptionFragment from "../../lib/DataTable/utils/fieldOptionFragment";
import withDelete from "../enhancers/withDelete";
import withFields from "../enhancers/withFields";

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
    className: "",
    page: 1,
    style: {},
    maxHeight: 800,
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    isLoading: false,
    isInfinite: false,
    isSingleSelect: false,
    hideSelectedCount: false,
    withCheckboxes: false,
    setSearchTerm: noop,
    setFilter: noop,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    contextMenu: noop,
    onDoubleClick: noop,
    onRowSelect: noop,
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
            columns.push({
              displayName: field.displayName,
              schemaIndex: i,
              width: field.width
            });
            return columns;
          }, [])
        : [];
      this.setState({ columns });
    }

    // handle programmatic selection and scrolling
    const { tableId } = this.state;
    const { selectedIds, entities } = newProps;
    const { selectedIds: oldSelectedIds } = oldProps;
    if (selectedIds === oldSelectedIds) return;
    const idArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    const newIdMap = idArray.reduce((acc, idOrCode) => {
      if (idOrCode || idOrCode === 0) acc[idOrCode] = true;
      return acc;
    }, {});
    finalizeSelection({ idMap: newIdMap, props: newProps });
    const idToScrollTo = idArray[0];
    if (!idToScrollTo && idToScrollTo !== 0) return;
    const entityIndexToScrollTo = entities.findIndex(
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
      className,
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
      withDisplayOptions,
      updateColumnVisibility,
      localStorageForceUpdate,
      syncDisplayOptionsToDb,
      resetDefaultVisibility,
      maxHeight,
      style,
      pageSize,
      formName,
      reduxFormSearchInput,
      reduxFormSelectedEntityIdMap,
      schema,
      filters,
      errorParsingUrlString,
      compact,
      compactPaging,
      entityCount,
      isSingleSelect,
      hideSelectedCount,
      entities
    } = this.props;
    let updateColumnVisibilityToUse = updateColumnVisibility;
    let resetDefaultVisibilityToUse = resetDefaultVisibility;
    if (withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      updateColumnVisibilityToUse = (...args) => {
        updateColumnVisibility(...args);
        localStorageForceUpdate.input.onChange(Math.random());
      };
      resetDefaultVisibilityToUse = (...args) => {
        resetDefaultVisibility(...args);
        localStorageForceUpdate.input.onChange(Math.random());
      };
    }
    let compactClassName = "";
    if (compactPaging) {
      compactClassName += " tg-compact-paging";
    }
    if (compact) {
      compactClassName += "tg-compact-table";
    }
    const { tableId } = this.state;
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
      <div
        className={classNames(
          "data-table-container",
          extraClasses,
          className,
          compactClassName
        )}
      >
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
        />
        <div
          className={"data-table-footer"}
          style={{
            justifyContent:
              isSingleSelect || hideSelectedCount ? "flex-end" : "space-between"
          }}
        >
          {!isSingleSelect &&
          !hideSelectedCount && (
            <div className={"tg-react-table-selected-count"}>
              {`${selectedRowCount} Record${selectedRowCount === 1
                ? ""
                : "s"} Selected `}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap" }}>
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
            ) : null}
            {withDisplayOptions && (
              <DisplayOptions
                resetDefaultVisibility={resetDefaultVisibilityToUse}
                updateColumnVisibility={updateColumnVisibilityToUse}
                formName={formName}
                schema={schema}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  getTableRowProps = (state, rowInfo) => {
    const {
      reduxFormSelectedEntityIdMap,
      withCheckboxes,
      onDoubleClick,
      history,
      entities
    } = this.props;
    if (!rowInfo) return {};
    const entity = rowInfo.original;
    const rowId = getIdOrCode(entity);
    const rowSelected = reduxFormSelectedEntityIdMap.input.value[rowId];
    return {
      onClick: e => {
        if (withCheckboxes) return;
        rowClick(e, rowInfo, entities, this.props);
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
          newIdMap = oldIdMap[rowId] ? oldIdMap : { [rowId]: { entity } };
          finalizeSelection({ idMap: newIdMap, props: this.props });
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
      reduxFormSelectedEntityIdMap,
      isSingleSelect,
      entities
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
        {!isSingleSelect && (
          <Checkbox
            onChange={() => {
              const newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
              entities.forEach(entity => {
                const entityId = getIdOrCode(entity);
                if (checkboxProps.checked) {
                  delete newIdMap[entityId];
                } else {
                  newIdMap[entityId] = { entity };
                }
              });

              finalizeSelection({ idMap: newIdMap, props: this.props });
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
    const {
      reduxFormSelectedEntityIdMap,
      isSingleSelect,
      entities
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
              newIdMap = {
                [entityId]: {
                  entity
                }
              };
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
                  newIdMap[tempEntityId] = {
                    entity: tempEntity
                  };
                } else {
                  delete newIdMap[tempEntityId];
                }
              }
            } else {
              //no shift key
              if (isRowCurrentlyChecked) {
                delete newIdMap[entityId];
              } else {
                newIdMap[entityId] = { entity };
              }
            }

            finalizeSelection({
              idMap: newIdMap,
              props: this.props
            });
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
      if (cellRenderer && cellRenderer[schemaForColumn.path]) {
        tableColumn.Cell = row => {
          const val = cellRenderer[schemaForColumn.path](
            row.value,
            row.original,
            row
          );
          return val;
        };
      } else if (schemaForColumn.render) {
        tableColumn.Cell = row => {
          const val = schemaForColumn.render(row.value, row.original, row);
          return val;
        };
      } else if (schemaForColumn.type === "timestamp") {
        tableColumn.Cell = props =>
          moment(new Date(props.value)).format("MMM D, YYYY");
      } else if (schemaForColumn.type === "boolean") {
        tableColumn.Cell = props => (props.value ? "True" : "False");
      }

      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  showContextMenu = (idMap, e) => {
    const { history, contextMenu, entities } = this.props;
    const selectedRecords = getSelectedRecordsFromEntities(entities, idMap);
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
    const { renderTitleInner } = schemaForField;
    const { displayName, sortDisabled } = schemaForField;
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
          {renderTitleInner ? renderTitleInner : displayName + "  "}
        </span>
        {!sortDisabled && (
          <div className={"tg-sort-arrow-container"}>
            <span
              title={"Sort Z-A (Hold shift to sort multiple columns)"}
              onClick={e => {
                setOrder("-" + ccDisplayName, sortUp, e.shiftKey);
              }}
              className={classNames("pt-icon-standard", "pt-icon-chevron-up", {
                "tg-active-sort": sortUp
              })}
            />
            <span
              title={"Sort A-Z (Hold shift to sort multiple columns)"}
              onClick={e => {
                setOrder(ccDisplayName, sortDown, e.shiftKey);
              }}
              className={classNames(
                "pt-icon-standard",
                "pt-icon-chevron-down",
                {
                  "tg-active-sort": sortDown
                }
              )}
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
  withDelete(tableConfigurationFragment, {
    refetchQueries: ["tableConfigurationQuery"]
  }),
  withUpsert(tableConfigurationFragment, {
    refetchQueries: ["tableConfigurationQuery"]
  }),
  withUpsert(fieldOptionFragment, {
    refetchQueries: ["tableConfigurationQuery"]
  }),
  withQuery(currentUserFragment, {
    argsOverride: ["", ""],
    nameOverride: "currentUser",
    queryName: "dataTableCurrentUserQuery",
    options: props => {
      const { withDisplayOptions, syncDisplayOptionsToDb } = props;
      return {
        skip: !syncDisplayOptionsToDb || !withDisplayOptions
      };
    }
  }),
  withQuery(tableConfigurationFragment, {
    queryName: "tableConfigurationQuery",
    isPlural: true,
    options: props => {
      const {
        formName,
        withDisplayOptions,
        syncDisplayOptionsToDb,
        currentUser
      } = props;
      const userId = get(currentUser, "user.id");
      return {
        skip: !syncDisplayOptionsToDb || !withDisplayOptions || !userId,
        variables: {
          filter: {
            userId,
            formName
          }
        }
      };
    }
  }),
  connect((state, ownProps) => {
    let propsToUse = ownProps;
    if (!ownProps.isTableParamsConnected) {
      //this is the case where we're hooking up to withTableParams locally, so we need to take the tableParams off the props
      propsToUse = {
        ...ownProps,
        ...ownProps.tableParams
      };
    }

    const {
      schema,
      withDisplayOptions,
      syncDisplayOptionsToDb,
      formName,
      tableConfigurations,
      deleteTableConfiguration,
      upsertTableConfiguration,
      upsertFieldOption,
      currentUser
    } = propsToUse;

    let schemaToUse = schema;
    let fieldOptsByPath = {};
    let resetDefaultVisibility;
    let updateColumnVisibility;
    if (withDisplayOptions) {
      let tableConfig;
      if (syncDisplayOptionsToDb) {
        tableConfig = tableConfigurations && tableConfigurations[0];
      } else {
        tableConfig = window.localStorage.getItem(formName);
        tableConfig = tableConfig && JSON.parse(tableConfig);
      }
      console.log("tableConfig:", tableConfig);
      if (!tableConfig) {
        tableConfig = {
          fieldOptions: []
        };
      }

      fieldOptsByPath = tableConfig.fieldOptions.reduce((acc, fieldOpt) => {
        acc[fieldOpt.path] = fieldOpt;
        return acc;
      }, {});
      schemaToUse = {
        ...schema,
        fields: schema.fields.map(field => {
          const fieldOpt = fieldOptsByPath[field.path];
          if (fieldOpt) {
            return {
              ...field,
              isHidden: fieldOpt.isHidden
            };
          } else {
            return field;
          }
        })
      };

      if (syncDisplayOptionsToDb) {
        //sync up to db
        let tableConfigurationId;
        resetDefaultVisibility = function() {
          tableConfigurationId = tableConfig.id;

          if (tableConfigurationId) {
            deleteTableConfiguration(tableConfigurationId);
          }
        };
        updateColumnVisibility = function({ shouldShow, path }) {
          if (tableConfigurationId) {
            // toArray({...stripFields(fieldOptsByPath, ['__typename']), [path]: {isHidden: !shouldShow, path, ...stripFields(fieldOptsByPath[path] || {}, ['__typename']) }  })
            const existingFieldOpt = fieldOptsByPath[path] || {};
            upsertFieldOption({
              id: existingFieldOpt.id,
              path,
              isHidden: !shouldShow,
              tableConfigurationId
            });
          } else {
            upsertTableConfiguration({
              userId: currentUser.user.id,
              formName,
              fieldOptions: [
                {
                  path,
                  isHidden: !shouldShow
                }
              ]
            });
          }
        };
      } else {
        //sync display options with localstorage
        resetDefaultVisibility = function() {
          window.localStorage.removeItem(formName);
        };
        updateColumnVisibility = function({ path, shouldShow }) {
          tableConfig.fieldOptions = toArray({
            ...fieldOptsByPath,
            [path]: { path, isHidden: !shouldShow }
          });
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
      }
    }

    console.log("schemaToUse:", schemaToUse);
    return {
      ...propsToUse,
      schema: schemaToUse,
      resetDefaultVisibility,
      updateColumnVisibility
    };
  }),
  reduxForm(), //the formName is passed via withTableParams and is often user overridden
  withFields({
    names: [
      "localStorageForceUpdate",
      "reduxFormQueryParams",
      "reduxFormSearchInput",
      "reduxFormSelectedEntityIdMap"
    ]
  })
)(ReactDataTable);
