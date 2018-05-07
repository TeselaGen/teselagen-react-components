/* eslint react/jsx-no-bind: 0 */
import deepEqual from "deep-equal";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose } from "redux";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { arrayMove } from "react-sortable-hoc";
import copy from "copy-to-clipboard";

import {
  camelCase,
  get,
  toArray,
  startCase,
  noop,
  isEqual,
  keyBy
} from "lodash";
import {
  Button,
  Menu,
  Spinner,
  // Popover,
  // Position,
  MenuItem,
  Classes,
  ContextMenu,
  Checkbox,
  Icon,
  Popover
} from "@blueprintjs/core";
import classNames from "classnames";
import scrollIntoView from "dom-scroll-into-view";
import { SortableElement } from "react-sortable-hoc";
import { getSelectedRowsFromEntities } from "./utils/selection";
import rowClick, { finalizeSelection } from "./utils/rowClick";
import ReactTable from "react-table";
import PagingTool from "./PagingTool";
import FilterAndSortMenu from "./FilterAndSortMenu";
import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";
import SearchBar from "./SearchBar";
import { getSelectedRecordsFromEntities } from "./utils/selection";
import DisplayOptions from "./DisplayOptions";
// import withQuery from "../enhancers/withQuery";
// import withUpsert from "../enhancers/withUpsert";
// import tableConfigurationFragment from "./utils/tableConfigurationFragment";
// import currentUserFragment from "./utils/currentUserFragment";
// import withDelete from "../enhancers/withDelete";
import withFields from "../enhancers/withFields";
// import fieldOptionFragment from "./utils/fieldOptionFragment";
import DisabledLoadingComponent from "./DisabledLoadingComponent";
import convertSchema from "./utils/convertSchema";
import "../toastr";
import "./style.css";
import withTableParams from "./utils/withTableParams";
import SortableColumns from "./SortableColumns";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withProps, branch } from "recompose";

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
    isCopyable: false,
    disabled: false,
    noSelect: false,
    noUserSelect: false,
    maxHeight: 800,
    isSimple: false,
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    reduxFormExpandedEntityIdMap: {},
    isEntityDisabled: noop,
    setSearchTerm: noop,
    setFilter: noop,
    showCount: false,
    clearFilters: noop,
    setPageSize: noop,
    setOrder: noop,
    setPage: noop,
    contextMenu: noop,
    onDoubleClick: noop,
    onRowSelect: noop,
    onRowClick: noop,
    onMultiRowSelect: noop,
    onSingleRowSelect: noop,
    onDeselect: noop,
    addFilters: noop,
    removeSingleFilter: noop,
    resizePersist: noop,
    resized: [],
    filters: [],
    isSingleSelect: false,
    withCheckboxes: false,
    withSort: true
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
            return columns.concat({
              ...field,
              columnIndex: i
            });
          }, [])
        : [];
      this.setState({ columns });
    }

    // handle programmatic selection and scrolling
    const { selectedIds, entities, isEntityDisabled } = newProps;
    const { selectedIds: oldSelectedIds } = oldProps;
    if (isEqual(selectedIds, oldSelectedIds)) return;
    const idArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    const selectedEntities = entities.filter(
      e => idArray.indexOf(getIdOrCodeOrIndex(e)) > -1 && !isEntityDisabled(e)
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
      if (headerNode) {
        headerNode.style.overflowY = "scroll";
        headerNode.style.overflowX = "hidden";
      }
    }
  }

  moveColumn = ({ oldIndex, newIndex }) => {
    const { columns } = this.state;
    let oldStateColumnIndex, newStateColumnIndex;
    columns.forEach((column, i) => {
      if (oldIndex === column.columnIndex) oldStateColumnIndex = i;
      if (newIndex === column.columnIndex) newStateColumnIndex = i;
    });
    // because it is all handled in state we need
    // to perform the move and update the columnIndices
    // because they are used for the sortable columns
    const newColumns = arrayMove(
      columns,
      oldStateColumnIndex,
      newStateColumnIndex
    ).map((column, i) => {
      return {
        ...column,
        columnIndex: i
      };
    });
    this.setState({
      columns: newColumns
    });
  };

  getTheadComponent = props => {
    const {
      withDisplayOptions,
      moveColumnPersist,
      localStorageForceUpdate,
      syncDisplayOptionsToDb
    } = computePresets(this.props);
    let moveColumnPersistToUse = moveColumnPersist;
    if (moveColumnPersist && withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      moveColumnPersistToUse = (...args) => {
        moveColumnPersist(...args);
        localStorageForceUpdate.input.onChange(Math.random());
      };
    }
    return (
      <SortableColumns
        {...props}
        withDisplayOptions={withDisplayOptions}
        moveColumn={moveColumnPersistToUse || this.moveColumn}
      />
    );
  };
  getThComponent = compose(
    withProps(props => {
      const { columnindex } = props;
      return {
        index: columnindex || 0
      };
    }),
    branch(({ immovable }) => "true" !== immovable, SortableElement)
  )(({ toggleSort, className, children, ...rest }) => (
    <div
      className={classNames("rt-th", className)}
      onClick={e => toggleSort && toggleSort(e)}
      role="columnheader"
      tabIndex="-1" // Resolves eslint issues without implementing keyboard navigation incorrectly
      {...rest}
    >
      {children}
    </div>
  ));

  render() {
    const {
      extraClasses,
      className,
      tableName,
      isLoading,
      searchTerm,
      setSearchTerm,
      clearFilters,
      hidePageSizeWhenPossible,
      doNotShowEmptyRows,
      withTitle,
      withSearch,
      withPaging,
      isInfinite,
      disabled,
      noHeader,
      noFooter,
      noPadding,
      withDisplayOptions,
      resized,
      resizePersist,
      updateColumnVisibility,
      updateTableDisplayDensity,
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
      userSpecifiedCompact,
      compact,
      compactPaging,
      entityCount,
      showCount,
      isSingleSelect,
      noSelect,
      SubComponent,
      ReactTableProps = {},
      hideSelectedCount,
      hideColumnHeader,
      subHeader,
      isViewable,
      entities,
      children
    } = computePresets(this.props);
    let updateColumnVisibilityToUse = updateColumnVisibility;
    let updateTableDisplayDensityToUse = updateTableDisplayDensity;
    let resetDefaultVisibilityToUse = resetDefaultVisibility;
    if (withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      updateColumnVisibilityToUse = (...args) => {
        updateColumnVisibility(...args);
        localStorageForceUpdate.input.onChange(Math.random());
      };
      updateTableDisplayDensityToUse = (...args) => {
        updateTableDisplayDensity(...args);
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
    if (compact || userSpecifiedCompact) {
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
    const showHeader = (withTitle || withSearch || children) && !noHeader;

    return (
      <div
        className={classNames(
          "data-table-container",
          extraClasses,
          className,
          compactClassName,
          {
            "dt-isViewable": isViewable,
            "no-padding": noPadding,
            "hide-column-header": hideColumnHeader
          }
        )}
      >
        {showHeader && (
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
        {subHeader}
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
          defaultResized={resized}
          onResizedChange={newResized => {
            resizePersist(newResized);
          }}
          getTbodyProps={() => ({
            id: tableId
          })}
          TheadComponent={this.getTheadComponent}
          ThComponent={this.getThComponent}
          getTrGroupProps={this.getTableRowProps}
          NoDataComponent={({ children }) =>
            isLoading ? null : <div className="rt-noData">{children}</div>
          }
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
                icon={isExpanded ? "chevron-down" : "chevron-right"}
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
                  {`${selectedRowCount} Record${
                    selectedRowCount === 1 ? "" : "s"
                  } Selected `}
                </div>
              )}
            {showCount &&
              `${entityCount} ${
                entityCount === 1 ? "Record" : "Total Records"
              }`}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {withDisplayOptions && (
                <DisplayOptions
                  disabled={disabled}
                  resetDefaultVisibility={resetDefaultVisibilityToUse}
                  updateColumnVisibility={updateColumnVisibilityToUse}
                  updateTableDisplayDensity={updateTableDisplayDensityToUse}
                  userSpecifiedCompact={userSpecifiedCompact}
                  formName={formName}
                  schema={schema}
                />
              )}
              {!isInfinite &&
              withPaging &&
              (hidePageSizeWhenPossible ? entityCount > pageSize : true) ? (
                <PagingTool {...computePresets(this.props)} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }

  getTableRowProps = (state, rowInfo) => {
    const {
      reduxFormSelectedEntityIdMap,
      reduxFormExpandedEntityIdMap,
      withCheckboxes,
      onDoubleClick,
      history,
      entities,
      isEntityDisabled
    } = computePresets(this.props);
    if (!rowInfo) return {};
    const entity = rowInfo.original;
    const rowId = getIdOrCodeOrIndex(entity, rowInfo.index);
    const rowSelected = reduxFormSelectedEntityIdMap.input.value[rowId];
    const isExpanded = reduxFormExpandedEntityIdMap.input.value[rowId];
    const rowDisabled = isEntityDisabled(entity);
    return {
      onClick: e => {
        // if checkboxes are activated or row expander is clicked don't select row
        if (e.target.matches(".tg-expander, .tg-expander *")) {
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
        if (rowId === undefined || rowDisabled) return;
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
        this.showContextMenu(newIdMap, e, entity);
      },
      className: rowSelected && !withCheckboxes ? "selected" : "",
      onDoubleClick: () => {
        if (rowDisabled) return;
        onDoubleClick(rowInfo.original, rowInfo.index, history);
      }
    };
  };

  renderCheckboxHeader = () => {
    const {
      reduxFormSelectedEntityIdMap,
      isSingleSelect,
      noSelect,
      noUserSelect,
      entities,
      isEntityDisabled
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
            disabled={noSelect || noUserSelect}
            /* eslint-disable react/jsx-no-bind */
            onChange={() => {
              const newIdMap = reduxFormSelectedEntityIdMap.input.value || {};
              entities.forEach((entity, i) => {
                if (isEntityDisabled(entity)) return;
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
      noUserSelect,
      entities,
      isEntityDisabled
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
          disabled={noSelect || noUserSelect || isEntityDisabled(entity)}
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
    const {
      cellRenderer,
      withCheckboxes,
      getCellHoverText,
      isCopyable
    } = computePresets(this.props);
    const { columns } = this.state;
    if (!columns.length) {
      return;
    }
    const columnsToRender = withCheckboxes
      ? [
          {
            Header: this.renderCheckboxHeader,
            Cell: this.renderCheckboxCell,
            width: 35,
            resizable: false,
            getHeaderProps: () => {
              return {
                className: "tg-react-table-checkbox-header-container",
                immovable: "true"
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
      const tableColumn = {
        ...column,
        Header: this.renderColumnHeader(column),
        accessor: column.path,
        getHeaderProps: () => ({
          // needs to be a string because it is getting passed
          // to the dom
          immovable: column.immovable ? "true" : "false",
          columnindex: column.columnIndex
        })
      };
      if (column.width) {
        tableColumn.width = column.width;
      }
      if (cellRenderer && cellRenderer[column.path]) {
        tableColumn.Cell = row => {
          const val = cellRenderer[column.path](row.value, row.original, row);
          return val;
        };
      } else if (column.render) {
        tableColumn.Cell = row => {
          const val = column.render(row.value, row.original, row);
          return val;
        };
      } else if (column.type === "timestamp") {
        tableColumn.Cell = props => {
          return props.value ? moment(props.value).format("lll") : "";
        };
      } else if (column.type === "boolean") {
        tableColumn.Cell = props => (props.value ? "True" : "False");
      } else {
        tableColumn.Cell = props => props.value;
      }
      const oldFunc = tableColumn.Cell;
      tableColumn.Cell = (...args) => {
        //wrap the original tableColumn.Cell function in another div in order to add a title attribute
        const val = oldFunc(...args);
        let title = typeof val !== "string" ? args[0].value : val;
        if (title) title = String(title);
        if (getCellHoverText) title = getCellHoverText(...args);
        return (
          <div
            style={
              column.noEllipsis
                ? {}
                : { textOverflow: "ellipsis", overflow: "hidden" }
            }
            title={title || undefined}
            className="hoverable"
          >
            {title !== undefined && isCopyable ? (
              <CopyToClipboard
                text={title}
                onCopy={() => {
                  window.toastr.success(`${title} - copy to clipboard`);
                }}
              >
                <span className="pt-icon-standard pt-icon-clipboard show-on-hover" />
              </CopyToClipboard>
            ) : (
              ""
            )}{" "}
            {val}
          </div>
        );
      };

      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  setManyRowsToCopy = selectedRecords => {
    const { columns } = this.state;
    let text;
    selectedRecords.forEach(row => {
      let textByRow;
      columns.forEach(col => {
        let text = get(row, col.path);
        if (text !== undefined) text = String(text); else text = " ";
        textByRow = textByRow
          ? textByRow + "\t" + text
          : text;
      });
      text = text ? text + textByRow + "\n" : textByRow + "\n";
    });
    return text;
  };

  showContextMenu = (idMap, e) => {
    const { history, contextMenu, entities, isCopyable } = computePresets(
      this.props
    );
    const selectedRecords = getSelectedRecordsFromEntities(entities, idMap);
    const itemsToRender = contextMenu({
      selectedRecords,
      history
    });
    if (!itemsToRender && !isCopyable) return null;
    const menu = (
      <Menu>
        {itemsToRender}
        {isCopyable &&
          selectedRecords.length > 0 && (
            <MenuItem
              key="copySelectedRows"
              onClick={() => {
                copy(this.setManyRowsToCopy(selectedRecords));
                window.toastr.success("Selected rows copied");
              }}
              icon="clipboard"
              text={"Copy Rows to clipboard"}
            />
          )}
      </Menu>
    );
    ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
  };

  renderColumnHeader = column => {
    const {
      addFilters,
      setOrder,
      order,
      withFilter,
      withSort,
      filters,
      removeSingleFilter,
      currentParams,
      isLocalCall,
      setNewParams
    } = computePresets(this.props);
    const {
      displayName,
      sortDisabled,
      filterDisabled,
      renderTitleInner,
      filterIsActive = noop,
      path
    } = column;
    const disableSorting =
      sortDisabled ||
      (!isLocalCall && typeof path === "string" && path.includes("."));
    const columnDataType = column.type;
    const isActionColumn = columnDataType === "action";
    const ccDisplayName = camelCase(displayName || path);
    let columnTitle = displayName || startCase(path);
    if (isActionColumn) columnTitle = "";
    const currentFilter =
      filters &&
      filters.length &&
      filters.filter(({ filterOn }) => {
        return filterOn === ccDisplayName;
      })[0];
    const filterActiveForColumn =
      !!currentFilter || filterIsActive(currentParams);
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
    const sortComponent =
      withSort && !disableSorting && !isActionColumn ? (
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
      ) : null;
    const FilterMenu = column.FilterMenu || FilterAndSortMenu;
    const filterMenu =
      withFilter && !isActionColumn && !filterDisabled ? (
        <Popover
          position="bottom"
          modifiers={{
            arrow: false
          }}
        >
          <Icon
            style={{ marginLeft: 5 }}
            icon="filter"
            className={classNames("tg-filter-menu-button", {
              "tg-active-filter": !!filterActiveForColumn
            })}
          />
          <FilterMenu
            addFilters={addFilters}
            removeSingleFilter={removeSingleFilter}
            currentFilter={currentFilter}
            filterOn={ccDisplayName}
            dataType={columnDataType}
            schemaForField={column}
            currentParams={currentParams}
            setNewParams={setNewParams}
          />
        </Popover>
      ) : null;

    return (
      <div className={"tg-react-table-column-header"}>
        {(displayName || startCase(path)) && (
          <span title={columnTitle} className={"tg-react-table-name"}>
            {renderTitleInner ? renderTitleInner : columnTitle}
          </span>
        )}
        {sortComponent}
        {filterMenu}
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

const enhancer = compose(
  //connect to withTableParams here in the dataTable component so that, in the case that the table is not manually connected,
  withTableParams({
    isLocalCall: true
  }),
  // withDelete(tableConfigurationFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withUpsert(tableConfigurationFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withUpsert(fieldOptionFragment, {
  //   refetchQueries: ["tableConfigurationQuery"]
  // }),
  // withQuery(currentUserFragment, {
  //   argsOverride: ["", ""],
  //   nameOverride: "currentUser",
  //   queryName: "dataTableCurrentUserQuery",
  //   options: props => {
  //     const { withDisplayOptions, syncDisplayOptionsToDb } = props;
  //     return {
  //       skip: !syncDisplayOptionsToDb || !withDisplayOptions
  //     };
  //   }
  // }),
  // withQuery(tableConfigurationFragment, {
  //   queryName: "tableConfigurationQuery",
  //   isPlural: true,
  //   options: props => {
  //     const {
  //       formName,
  //       withDisplayOptions,
  //       syncDisplayOptionsToDb,
  //       currentUser
  //     } = props;
  //     const userId = get(currentUser, "user.id");
  //     return {
  //       skip: !syncDisplayOptionsToDb || !withDisplayOptions || !userId,
  //       variables: {
  //         filter: {
  //           userId,
  //           formName
  //         }
  //       }
  //     };
  //   }
  // }),
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
      currentUser,
      isViewable
    } = propsToUse;
    let schemaToUse = convertSchema(schema);
    let fieldOptsByPath = {};
    let tableConfig = {};
    let resetDefaultVisibility;
    let updateColumnVisibility;
    let moveColumnPersist;
    let resizePersist;
    let resized;
    let updateTableDisplayDensity;
    let userSpecifiedCompact;
    if (isViewable) {
      schemaToUse.fields = [viewColumn, ...schemaToUse.fields];
    }
    if (withDisplayOptions) {
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
      userSpecifiedCompact = tableConfig.density === "compact";
      const columnOrderings = tableConfig.columnOrderings;
      fieldOptsByPath = keyBy(tableConfig.fieldOptions, "path");
      schemaToUse = {
        ...schemaToUse,
        fields: schemaToUse.fields.map(field => {
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

      if (columnOrderings) {
        schemaToUse.fields = schemaToUse.fields.sort(
          ({ path: path1 }, { path: path2 }) => {
            return (
              columnOrderings.indexOf(path1) - columnOrderings.indexOf(path2)
            );
          }
        );
      }

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
        updateColumnVisibility = function({ path, paths, shouldShow }) {
          const newFieldOpts = {
            ...fieldOptsByPath
          };
          let pathsToUse = paths ? paths : [path];
          pathsToUse.forEach(path => {
            newFieldOpts[path] = { path, isHidden: !shouldShow };
          });
          tableConfig.fieldOptions = toArray(newFieldOpts);
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        updateTableDisplayDensity = function(density) {
          tableConfig.density = density;
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        moveColumnPersist = function({ oldIndex, newIndex }) {
          //we might already have an array of the fields [path1, path2, ..etc]
          const columnOrderings =
            tableConfig.columnOrderings ||
            schemaToUse.fields.map(({ path }) => path); // columnOrderings is [path1, path2, ..etc]

          tableConfig.columnOrderings = arrayMove(
            columnOrderings,
            oldIndex,
            newIndex
          );
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
        resizePersist = function(newResized) {
          tableConfig.resized = newResized;
          window.localStorage.setItem(formName, JSON.stringify(tableConfig));
        };
      }
    }
    resized = tableConfig.resized;
    return {
      ...propsToUse,
      schema: schemaToUse,
      resized,
      resetDefaultVisibility,
      updateColumnVisibility,
      updateTableDisplayDensity,
      userSpecifiedCompact,
      resizePersist,
      moveColumnPersist
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
);

export default enhancer(ReactDataTable);

const ConnectedPagingTool = enhancer(PagingTool);
export { ConnectedPagingTool };

const viewColumn = {
  width: 35,
  noEllipsis: true,
  immovable: true,
  type: "action",
  render: () => {
    return <Icon className="dt-eyeIcon" icon="eye-open" />;
  }
};
