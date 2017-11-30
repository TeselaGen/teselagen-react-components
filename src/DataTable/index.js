/* eslint react/jsx-no-bind: 0 */
import deepEqual from "deep-equal";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { camelCase, get, toArray, startCase, noop, isEqual } from "lodash";
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
import scrollIntoView from "dom-scroll-into-view";
import { getSelectedRowsFromEntities } from "./utils/selection";
import rowClick, { finalizeSelection } from "./utils/rowClick";
import ReactTable from "react-table";
import PagingTool from "./PagingTool";
import FilterAndSortMenu from "./FilterAndSortMenu";
import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";
import SearchBar from "./SearchBar";
import { getSelectedRecordsFromEntities } from "./utils/selection";
import DisplayOptions from "./DisplayOptions";
import withQuery from "../enhancers/withQuery";
import withUpsert from "../enhancers/withUpsert";
import tableConfigurationFragment from "./utils/tableConfigurationFragment";
import currentUserFragment from "./utils/currentUserFragment";
import withDelete from "../enhancers/withDelete";
import withFields from "../enhancers/withFields";
import fieldOptionFragment from "./utils/fieldOptionFragment";
import DisabledLoadingComponent from "./DisabledLoadingComponent";
import "../toastr";
import "./style.css";
import withTableParams from "./utils/withTableParams";

//we use this to make adding preset prop groups simpler
function computePresets(props) {
  const { isSimple } = props;
  let toReturn = { ...props };
  if (isSimple) {
    //isSimplePreset
    toReturn = {
      noHeader: true,
      noFooter: true,
      noPadding: true,
      hidePageSizeWhenPossible: true,
      isInfinite: true,
      hideSelectedCount: true,
      withTitle: false,
      withSearch: false,
      withPaging: false,
      withFilter: false,
      ...toReturn
    };
  } else {
    toReturn = {
      // the usual defaults:
      noFooter: false,
      noPadding: false,
      hidePageSizeWhenPossible: false,
      isInfinite: false,
      hideSelectedCount: false,
      withTitle: true,
      withSearch: true,
      withPaging: true,
      withFilter: true,
      ...toReturn
    };
  }
  return toReturn;
}

class ReactDataTable extends React.Component {
  state = {
    columns: []
  };

  static defaultProps = {
    //NOTE: DO NOT SET DEFAULTS HERE FOR PROPS THAT GET COMPUTED AS PART OF PRESET GROUPS IN computePresets
    entities: [],
    noHeader: false,
    pageSize: 10,
    extraClasses: "",
    className: "",
    page: 1,
    style: {},
    isLoading: false,
    disabled: false,
    noSelect: false,
    maxHeight: 800,
    isSimple: false,
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    reduxFormExpandedEntityIdMap: {},
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
    filters: [],
    isSingleSelect: false,
    withCheckboxes: false
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
              displayName: field.displayName || startCase(field.path),
              schemaIndex: i,
              width: field.width
            });
            return columns;
          }, [])
        : [];
      this.setState({ columns });
    }

    // handle programmatic selection and scrolling
    const { selectedIds, entities } = newProps;
    const { selectedIds: oldSelectedIds } = oldProps;
    if (isEqual(selectedIds, oldSelectedIds)) return;
    const idArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    const selectedEntities = entities.filter(
      e => idArray.indexOf(getIdOrCodeOrIndex(e)) > -1
    );
    const newIdMap = selectedEntities.reduce((acc, entity) => {
      acc[getIdOrCodeOrIndex(entity)] = { entity };
      return acc;
    }, {});
    finalizeSelection({ idMap: newIdMap, props: newProps });
    const idToScrollTo = idArray[0];
    if (!idToScrollTo && idToScrollTo !== 0) return;
    const entityIndexToScrollTo = entities.findIndex(
      e => e.id === idToScrollTo || e.code === idToScrollTo
    );
    const table = ReactDOM.findDOMNode(this.table);
    if (entityIndexToScrollTo === -1 || !table) return;
    const tableBody = table.querySelector(".rt-tbody");
    if (!tableBody) return;
    const rowEl = tableBody.getElementsByClassName("rt-tr-group")[
      entityIndexToScrollTo
    ];
    if (!rowEl) return;
    scrollIntoView(rowEl, tableBody, {
      alignWithTop: true
    });
  };

  componentWillReceiveProps(newProps) {
    this.componentWillMountOrReceiveProps(
      computePresets(this.props),
      computePresets(newProps)
    );
  }
  componentWillMount() {
    this.componentWillMountOrReceiveProps({}, computePresets(this.props));
  }

  componentDidUpdate() {
    const table = ReactDOM.findDOMNode(this.table);
    const tableBody = table.querySelector(".rt-tbody");
    const headerNode = table.querySelector(".rt-thead.-header");
    if (headerNode) headerNode.style.overflowY = "inherit";
    if (tableBody && tableBody.scrollHeight > tableBody.clientHeight) {
      if (headerNode) headerNode.style.overflowY = "scroll";
    }
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
      disabled,
      noHeader,
      noFooter,
      noPadding,
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
      reduxFormExpandedEntityIdMap,
      schema,
      filters,
      errorParsingUrlString,
      compact,
      compactPaging,
      entityCount,
      isSingleSelect,
      noSelect,
      SubComponent,
      ReactTableProps = {},
      hideSelectedCount,
      entities,
      children
    } = computePresets(this.props);
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
      schema.fields.forEach(({ isHidden, displayName, path }) => {
        const ccDisplayName = camelCase(displayName || path);
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

    const expandedRows = entities.reduce((acc, row, index) => {
      const rowId = getIdOrCodeOrIndex(row, index);
      acc[index] = reduxFormExpandedEntityIdMap.input.value[rowId];
      return acc;
    }, {});

    return (
      <div
        className={classNames(
          "data-table-container",
          extraClasses,
          className,
          compactClassName,
          { "no-padding": noPadding }
        )}
      >
        {!noHeader && (
          <div className={"data-table-header"}>
            <div className={"data-table-title-and-buttons"}>
              {tableName &&
                withTitle && (
                  <span className={"data-table-title"}>{tableName}</span>
                )}
              {children}
            </div>
            {errorParsingUrlString && (
              <span className={"pt-icon-error pt-intent-warning"}>
                Error parsing URL
              </span>
            )}
            {filtersOnNonDisplayedFields.length
              ? filtersOnNonDisplayedFields.map(
                  ({ displayName, path, selectedFilter, filterValue }) => {
                    return (
                      <div
                        key={displayName || startCase(path)}
                        className={"tg-filter-on-non-displayed-field"}
                      >
                        <span className={"pt-icon-filter"} />
                        <span>
                          {" "}
                          {displayName || startCase(path)} {selectedFilter}{" "}
                          {filterValue}{" "}
                        </span>
                      </div>
                    );
                  }
                )
              : ""}
            {withSearch && (
              <div className={"data-table-search-and-clear-filter-container"}>
                {hasFilters ? (
                  <Button
                    disabled={disabled}
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
                    maybeSpinner,
                    disabled
                  }}
                />
              </div>
            )}
          </div>
        )}
        <ReactTable
          data={entities}
          ref={n => {
            if (n) this.table = n;
          }}
          columns={this.renderColumns()}
          pageSize={rowsToShow}
          expanded={expandedRows}
          showPagination={false}
          sortable={false}
          loading={isLoading || disabled}
          getTbodyProps={() => ({
            id: tableId
          })}
          getTrGroupProps={this.getTableRowProps}
          NoDataComponent={({ children }) =>
            isLoading ? null : <div className="rt-noData">{children}</div>}
          LoadingComponent={props => (
            <DisabledLoadingComponent {...{ ...props, disabled }} />
          )}
          style={{
            maxHeight,
            ...style
          }}
          ExpanderComponent={({ isExpanded }) => {
            return (
              <Button
                className={classNames(
                  "tg-expander",
                  Classes.MINIMAL,
                  Classes.SMALL
                )}
                iconName={isExpanded ? "chevron-down" : "chevron-right"}
              />
            );
          }}
          SubComponent={SubComponent}
          {...ReactTableProps}
        />
        {!noFooter && (
          <div
            className={"data-table-footer"}
            style={{
              justifyContent:
                isSingleSelect || hideSelectedCount
                  ? "flex-end"
                  : "space-between"
            }}
          >
            {!noSelect &&
              !isSingleSelect &&
              !hideSelectedCount && (
                <div className={"tg-react-table-selected-count"}>
                  {`${selectedRowCount} Record${selectedRowCount === 1
                    ? ""
                    : "s"} Selected `}
                </div>
              )}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {withDisplayOptions && (
                <DisplayOptions
                  disabled={disabled}
                  resetDefaultVisibility={resetDefaultVisibilityToUse}
                  updateColumnVisibility={updateColumnVisibilityToUse}
                  formName={formName}
                  schema={schema}
                />
              )}
              {!isInfinite &&
              withPaging &&
              (hidePageSizeWhenPossible ? entityCount > pageSize : true) ? (
                <PagingTool
                  paging={{
                    total: entityCount,
                    page,
                    pageSize
                  }}
                  disabled={disabled}
                  onRefresh={onRefresh}
                  setPage={setPage}
                  setPageSize={setPageSize}
                  onPageChange={this.onPageChange}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }

  onPageChange = () => {
    const { reduxFormSelectedEntityIdMap, entities } = computePresets(
      this.props
    );
    const record = get(entities, "[0]");
    if (!record || (!record.id && record.id !== 0 && !record.code)) {
      reduxFormSelectedEntityIdMap.input.onChange({});
    }
  };

  getTableRowProps = (state, rowInfo) => {
    const {
      reduxFormSelectedEntityIdMap,
      reduxFormExpandedEntityIdMap,
      withCheckboxes,
      onDoubleClick,
      history,
      entities
    } = computePresets(this.props);
    if (!rowInfo) return {};
    const entity = rowInfo.original;
    const rowId = getIdOrCodeOrIndex(entity, rowInfo.index);
    const rowSelected = reduxFormSelectedEntityIdMap.input.value[rowId];
    const isExpanded = reduxFormExpandedEntityIdMap.input.value[rowId];
    return {
      onClick: e => {
        // if checkboxes are activated or row expander is clicked don't select row
        if (e.target.classList.contains("tg-expander")) {
          reduxFormExpandedEntityIdMap.input.onChange({
            ...reduxFormExpandedEntityIdMap.input.value,
            [rowId]: !isExpanded
          });
          return;
        } else if (withCheckboxes) {
          return;
        }

        rowClick(e, rowInfo, entities, computePresets(this.props));
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
          finalizeSelection({
            idMap: newIdMap,
            props: computePresets(this.props)
          });
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
      noSelect,
      entities
    } = computePresets(this.props);
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
            disabled={noSelect}
            /* eslint-disable react/jsx-no-bind */

            onChange={() => {
              const newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
              entities.forEach((entity, i) => {
                const entityId = getIdOrCodeOrIndex(entity, i);
                if (checkboxProps.checked) {
                  delete newIdMap[entityId];
                } else {
                  newIdMap[entityId] = { entity };
                }
              });

              finalizeSelection({
                idMap: newIdMap,
                props: computePresets(this.props)
              });
              this.setState({ lastCheckedRow: undefined });
            }}
            /* eslint-enable react/jsx-no-bind */

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
      noSelect,
      entities
    } = computePresets(this.props);
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
          disabled={noSelect}
          /* eslint-disable react/jsx-no-bind*/

          onChange={e => {
            let newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
            const isRowCurrentlyChecked = checkedRows.indexOf(rowIndex) > -1;
            const entityId = getIdOrCodeOrIndex(entity, rowIndex);
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
                const tempEntityId = getIdOrCodeOrIndex(tempEntity, i);
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
              props: computePresets(this.props)
            });
            this.setState({ lastCheckedRow: rowIndex });
          }}
          /* eslint-enable react/jsx-no-bind*/

          className={"tg-react-table-checkbox-cell-inner"}
          checked={isSelected}
        />
      </div>
    );
  };

  renderColumns = () => {
    const { schema, cellRenderer, withCheckboxes } = computePresets(this.props);
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
        ...schemaForColumn,
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
        tableColumn.Cell = props => {
          return props.value ? moment(new Date(props.value)).format("lll") : "";
        };
      } else if (schemaForColumn.type === "boolean") {
        tableColumn.Cell = props => (props.value ? "True" : "False");
      } else {
        tableColumn.Cell = props => props.value;
      }
      const oldFunc = tableColumn.Cell;
      tableColumn.Cell = (...args) => {
        //wrap the original tableColumn.Cell function in another div in order to add a title attribute
        const val = oldFunc(...args);
        let title = String(typeof val !== "string" ? args[0].value : val);
        return (
          <div
            style={{ textOverflow: "ellipsis", overflow: "hidden" }}
            title={title}
          >
            {val}
          </div>
        );
      };

      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  showContextMenu = (idMap, e) => {
    const { history, contextMenu, entities } = computePresets(this.props);
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
      withFilter,
      filters,
      removeSingleFilter
    } = computePresets(this.props);
    const schemaForField = schema.fields[column.schemaIndex];
    const {
      displayName,
      sortDisabled,
      renderTitleInner,
      path
    } = schemaForField;
    const columnDataType = schemaForField.type;
    const isActionColumn = columnDataType === "action";
    const ccDisplayName = isActionColumn ? "" : camelCase(displayName || path);
    const currentFilter =
      filters &&
      filters.length &&
      filters.filter(({ filterOn }) => {
        return filterOn === ccDisplayName;
      })[0];
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

    const sortComponent = (
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
          className={classNames("pt-icon-standard", "pt-icon-chevron-down", {
            "tg-active-sort": sortDown
          })}
        />
      </div>
    );

    const filterMenu = withFilter ? (
      <Popover position={Position.BOTTOM_RIGHT}>
        <Button
          title={"Filter"}
          className={classNames(
            "tg-filter-menu-button",
            Classes.MINIMAL,
            { "tg-active-filter": !!currentFilter },
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
    ) : null;

    return (
      <div className={"tg-react-table-column-header"}>
        {(displayName || startCase(path)) && (
          <span
            title={displayName || startCase(path)}
            className={"tg-react-table-name"}
          >
            {renderTitleInner
              ? renderTitleInner
              : (displayName || startCase(path)) + "  "}
          </span>
        )}
        {!sortDisabled && !isActionColumn && sortComponent}
        {!isActionColumn && filterMenu}
      </div>
    );
  };
}

/**
 * @param {options} options 
 * @typedef {object} options
 * @property {boolean} isPlural Are we searching for 1 thing or many?
 * @property {string} queryName What the props come back on ( by default = modelName + 'Query')
 */

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
      "reduxFormSelectedEntityIdMap",
      "reduxFormExpandedEntityIdMap"
    ]
  })
)(ReactDataTable);
