/* eslint react/jsx-no-bind: 0 */
import deepEqual from "deep-equal";
import { compose } from "redux";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { arrayMove } from "react-sortable-hoc";
import copy from "copy-to-clipboard";
import {
  map,
  toString,
  camelCase,
  startCase,
  noop,
  isEqual,
  cloneDeep
} from "lodash";
import {
  Button,
  Menu,
  MenuItem,
  Classes,
  ContextMenu,
  Checkbox,
  Icon,
  Popover,
  Intent,
  Callout,
  Hotkey,
  Hotkeys,
  HotkeysTarget,
  Tooltip
} from "@blueprintjs/core";
import classNames from "classnames";
import scrollIntoView from "dom-scroll-into-view";
import { SortableElement } from "react-sortable-hoc";
import { BooleanValue } from "react-values";
import ReactTable from "react-table";
import { withProps, branch } from "recompose";
import InfoHelper from "../InfoHelper";
import { getSelectedRowsFromEntities } from "./utils/selection";
import rowClick, { finalizeSelection } from "./utils/rowClick";
import PagingTool from "./PagingTool";
import FilterAndSortMenu from "./FilterAndSortMenu";
import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";
import SearchBar from "./SearchBar";
import DisplayOptions from "./DisplayOptions";
// import tableConfigurationFragment from "./utils/tableConfigurationFragment";
// import currentUserFragment from "./utils/currentUserFragment";
// import withDelete from "../enhancers/withDelete";
// import fieldOptionFragment from "./utils/fieldOptionFragment";
import DisabledLoadingComponent from "./DisabledLoadingComponent";
import SortableColumns from "./SortableColumns";
import computePresets from "./utils/computePresets";
import dataTableEnhancer from "./dataTableEnhancer";
import defaultProps from "./defaultProps";
import "../toastr";
import "./style.css";
import { getRecordsFromIdMap } from "./utils/withSelectedEntities";

class DataTable extends React.Component {
  state = {
    columns: [],
    fullscreen: false
  };

  static defaultProps = defaultProps;

  toggleFullscreen = () => {
    this.setState({
      fullscreen: !this.state.fullscreen
    });
  };

  updateFromProps = (oldProps, newProps) => {
    const {
      selectedIds,
      entities,
      isEntityDisabled,
      expandAllByDefault,
      selectAllByDefault,
      reduxFormSelectedEntityIdMap,
      reduxFormExpandedEntityIdMap,
      change
    } = newProps;

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
    //handle selecting all or expanding all
    if (
      (selectAllByDefault || expandAllByDefault) &&
      !deepEqual(
        newProps.entities.map(({ id }) => id),
        oldProps.entities && oldProps.entities.map(({ id }) => id)
      )
    ) {
      if (selectAllByDefault) {
        change("reduxFormSelectedEntityIdMap", {
          ...entities.reduce((acc, entity) => {
            acc[entity.id] = { entity };
            return acc;
          }, {}),
          ...(reduxFormSelectedEntityIdMap || {})
        });
      }
      if (expandAllByDefault) {
        change("reduxFormExpandedEntityIdMap", {
          ...entities.reduce((acc, e) => {
            acc[e.id] = true;
            return acc;
          }, {}),
          ...(reduxFormExpandedEntityIdMap || {})
        });
      }
    }

    // handle programmatic selection and scrolling

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

  componentDidMount() {
    this.updateFromProps({}, computePresets(this.props));
    const table = ReactDOM.findDOMNode(this.table);
    let theads = table.getElementsByClassName("rt-thead");
    let tbody = table.getElementsByClassName("rt-tbody")[0];

    tbody.addEventListener("scroll", () => {
      for (let i = 0; i < theads.length; i++) {
        theads.item(i).scrollLeft = tbody.scrollLeft;
      }
    });
  }

  componentDidUpdate(oldProps) {
    const table = ReactDOM.findDOMNode(this.table);
    // const tableBody = table.querySelector(".rt-tbody");
    // const headerNode = table.querySelector(".rt-thead.-header");
    // if (headerNode) headerNode.style.overflowY = "inherit";
    // if (tableBody && tableBody.scrollHeight > tableBody.clientHeight) {
    //   if (headerNode) {
    //     headerNode.style.overflowY = "scroll";
    //     headerNode.style.overflowX = "hidden";
    //   }
    // }

    this.updateFromProps(computePresets(oldProps), computePresets(this.props));

    let theads = table.getElementsByClassName("rt-thead");
    let tbody = table.getElementsByClassName("rt-tbody")[0];

    if (tbody.scrollHeight > tbody.clientHeight) {
      for (let i = 0; i < theads.length; i++) {
        theads.item(i).classList.add("vertical-scrollbar-present");
      }
    } else {
      for (let i = 0; i < theads.length; i++) {
        theads.item(i).classList.remove("vertical-scrollbar-present");
      }
    }

    // comment in to test what is causing re-render
    // Object.entries(this.props).forEach(
    //   ([key, val]) =>
    //     oldProps[key] !== val && console.info(`Prop '${key}' changed`)
    // );
  }

  handleCopyHotkey = () => {
    const { reduxFormSelectedEntityIdMap } = this.props;
    this.handleCopySelectedRows(
      getRecordsFromIdMap(reduxFormSelectedEntityIdMap)
    );
  };

  getCellCopyText = cellWrapper => {
    const text = cellWrapper && cellWrapper.getAttribute("data-copy-text");
    return text || "";
  };

  handleCopyRow = rowEl => {
    //takes in a row element
    const text = this.getRowCopyText(rowEl);
    if (!text) return;
    this.handleCopyHelper(text, "Row Copied");
  };

  getRowCopyText = rowEl => {
    //takes in a row element
    if (!rowEl) return;
    return map(rowEl.children, cellEl => {
      const cellChild = cellEl.querySelector(`[data-copy-text]`);
      if (!cellChild) return;
      return this.getCellCopyText(cellChild);
    }).join("\t");
  };

  handleCopyHelper = (stringToCopy, message) => {
    const copyHandler = e => {
      e.preventDefault();
      e.clipboardData.setData("text/plain", stringToCopy);
    };
    document.addEventListener("copy", copyHandler);
    !window.Cypress && copy(stringToCopy); //only fire the copy event if not in a cypress test
    document.removeEventListener("copy", copyHandler);
    window.toastr.success(message);
  };

  handleCopySelectedRows = (selectedRecords, e) => {
    const { entities = [] } = computePresets(this.props);
    const idToIndex = entities.reduce((acc, e, i) => {
      acc[e.id || e.code] = i;
      return acc;
    }, {});

    //index 0 of the table is the column titles
    //must add 1 to rowNum
    const rowNumbersToCopy = selectedRecords
      .map(rec => idToIndex[rec.id || rec.code] + 1)
      .sort();

    if (!rowNumbersToCopy.length) return;
    const allRowEls = e.target
      .closest(".ReactTable")
      .querySelectorAll(".rt-tr");
    const rowEls = rowNumbersToCopy.map(i => allRowEls[i]);

    //get row elements and call this.handleCopyRow for each const rowEls = this.getRowEls(rowNumbersToCopy)
    const textToCopy = map(rowEls, rowEl => this.getRowCopyText(rowEl))
      .filter(text => text)
      .join("\n");
    if (!textToCopy) return window.toastr.warning("No text to copy");
    this.handleCopyHelper(textToCopy, "Selected rows copied");
  };

  renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey
          combo="mod + c"
          label="Copy rows"
          onKeyDown={this.handleCopyHotkey}
        />
      </Hotkeys>
    );
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
      syncDisplayOptionsToDb,
      change
    } = computePresets(this.props);
    let moveColumnPersistToUse = moveColumnPersist;
    if (moveColumnPersist && withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      moveColumnPersistToUse = (...args) => {
        moveColumnPersist(...args);
        change("localStorageForceUpdate", Math.random());
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
    const { fullscreen } = this.state;
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
      noFullscreenButton,
      withDisplayOptions,
      resized,
      resizePersist,
      updateColumnVisibility,
      updateTableDisplayDensity,
      change,
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
      hideDisplayOptionsIcon,
      compact,
      compactPaging,
      entityCount,
      showCount,
      isSingleSelect,
      noSelect,
      SubComponent,
      shouldShowSubComponent,
      ReactTableProps = {},
      hideSelectedCount,
      hideColumnHeader,
      subHeader,
      isViewable,
      entities,
      children,
      topLeftItems,
      currentParams,
      hasOptionForForcedHidden,
      showForcedHiddenColumns,
      searchMenuButton,
      setShowForcedHidden
    } = computePresets(this.props);
    let updateColumnVisibilityToUse = updateColumnVisibility;
    let updateTableDisplayDensityToUse = updateTableDisplayDensity;
    let resetDefaultVisibilityToUse = resetDefaultVisibility;
    if (withDisplayOptions && !syncDisplayOptionsToDb) {
      //little hack to make localstorage changes get reflected in UI (we force an update to get the enhancers to run again :)
      updateColumnVisibilityToUse = (...args) => {
        updateColumnVisibility(...args);
        change("localStorageForceUpdate", Math.random());
      };
      updateTableDisplayDensityToUse = (...args) => {
        updateTableDisplayDensity(...args);
        change("localStorageForceUpdate", Math.random());
      };
      resetDefaultVisibilityToUse = (...args) => {
        resetDefaultVisibility(...args);
        change("localStorageForceUpdate", Math.random());
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
    const hasFilters =
      filters.length ||
      searchTerm ||
      schema.fields.some(
        field => field.filterIsActive && field.filterIsActive(currentParams)
      );
    const additionalFilterKeys = schema.fields.reduce((acc, field) => {
      if (field.filterKey) acc.push(field.filterKey);
      return acc;
    }, []);
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
    const idMap = reduxFormSelectedEntityIdMap || {};
    const selectedRowCount = Object.keys(idMap).filter(key => idMap[key])
      .length;

    let rowsToShow = doNotShowEmptyRows
      ? Math.min(numRows, entities.length)
      : numRows;
    // if there are no entities then provide enough space to show
    // no rows found message
    if (entities.length === 0 && rowsToShow < 3) rowsToShow = 3;

    const expandedRows = entities.reduce((acc, row, index) => {
      const rowId = getIdOrCodeOrIndex(row, index);
      acc[index] = reduxFormExpandedEntityIdMap[rowId];
      return acc;
    }, {});
    const showHeader = (withTitle || withSearch || children) && !noHeader;
    const toggleFullscreenButton = (
      <Button
        icon="fullscreen"
        active={fullscreen}
        minimal
        onClick={this.toggleFullscreen}
      />
    );

    const showNumSelected = !noSelect && !isSingleSelect && !hideSelectedCount;
    let selectedAndTotalMessage = "";
    if (showNumSelected) {
      selectedAndTotalMessage += `${selectedRowCount} Selected `;
    }
    if (showCount && showNumSelected) {
      selectedAndTotalMessage += `/ `;
    }
    if (showCount) {
      selectedAndTotalMessage += `${entityCount || 0} Total`;
    }
    if (selectedAndTotalMessage) {
      selectedAndTotalMessage = <div>{selectedAndTotalMessage}</div>;
    }

    const shouldShowPaging =
      !isInfinite &&
      withPaging &&
      (hidePageSizeWhenPossible ? entityCount > pageSize : true);

    let SubComponentToUse;
    if (SubComponent) {
      SubComponentToUse = row => {
        let shouldShow = true;
        if (shouldShowSubComponent) {
          shouldShow = shouldShowSubComponent(row.original);
        }
        if (shouldShow) {
          return SubComponent(row);
        }
      };
    }
    return (
      <div
        className={classNames(
          "data-table-container",
          extraClasses,
          className,
          compactClassName,
          {
            fullscreen,
            "dt-isViewable": isViewable,
            "no-padding": noPadding,
            "hide-column-header": hideColumnHeader
          }
        )}
      >
        {showHeader && (
          <div className="data-table-header">
            <div className="data-table-title-and-buttons">
              {tableName && withTitle && (
                <span className="data-table-title">{tableName}</span>
              )}
              {children}
              {topLeftItems}
            </div>
            {errorParsingUrlString && (
              <Callout
                icon="error"
                style={{
                  width: "unset"
                }}
                intent={Intent.WARNING}
              >
                Error parsing URL
              </Callout>
            )}
            {filtersOnNonDisplayedFields.length
              ? filtersOnNonDisplayedFields.map(
                  ({ displayName, path, selectedFilter, filterValue }) => {
                    let filterValToDisplay = filterValue;
                    if (Array.isArray(filterValue)) {
                      filterValToDisplay = filterValue.toString();
                    }
                    return (
                      <div
                        key={displayName || startCase(path)}
                        className="tg-filter-on-non-displayed-field"
                      >
                        <Icon icon="filter" />
                        <span>
                          {" "}
                          {displayName || startCase(path)} {selectedFilter}{" "}
                          {filterValToDisplay}{" "}
                        </span>
                      </div>
                    );
                  }
                )
              : ""}
            {withSearch && (
              <div className="data-table-search-and-clear-filter-container">
                {hasFilters ? (
                  <Tooltip content="Clear Filters">
                    <Button
                      minimal
                      intent="danger"
                      icon="filter-remove"
                      disabled={disabled}
                      className="data-table-clear-filters"
                      onClick={() => {
                        clearFilters(additionalFilterKeys);
                      }}
                    />
                  </Tooltip>
                ) : (
                  ""
                )}
                <SearchBar
                  {...{
                    reduxFormSearchInput,
                    setSearchTerm,
                    loading: isLoading,
                    searchMenuButton,
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
          onResizedChange={(newResized = []) => {
            const resizedToUse = newResized.map(column => {
              // have a min width of 50 so that columns don't disappear
              if (column.value < 50) {
                return {
                  ...column,
                  value: 50
                };
              } else {
                return column;
              }
            });
            resizePersist(resizedToUse);
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
            minHeight: 150,
            ...style
          }}
          SubComponent={SubComponentToUse}
          {...ReactTableProps}
        />
        {!noFooter && (
          <div
            className="data-table-footer"
            style={{
              justifyContent:
                !showNumSelected && !showCount ? "flex-end" : "space-between"
            }}
          >
            {selectedAndTotalMessage}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {!noFullscreenButton && toggleFullscreenButton}
              {withDisplayOptions && (
                <DisplayOptions
                  disabled={disabled}
                  hideDisplayOptionsIcon={hideDisplayOptionsIcon}
                  resetDefaultVisibility={resetDefaultVisibilityToUse}
                  updateColumnVisibility={updateColumnVisibilityToUse}
                  updateTableDisplayDensity={updateTableDisplayDensityToUse}
                  userSpecifiedCompact={userSpecifiedCompact}
                  showForcedHiddenColumns={showForcedHiddenColumns}
                  setShowForcedHidden={setShowForcedHidden}
                  hasOptionForForcedHidden={hasOptionForForcedHidden}
                  formName={formName}
                  schema={schema}
                />
              )}
              {shouldShowPaging && (
                <PagingTool {...computePresets(this.props)} />
              )}
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
      isEntityDisabled,
      change
    } = computePresets(this.props);
    if (!rowInfo) return {};
    const entity = rowInfo.original;
    const rowId = getIdOrCodeOrIndex(entity, rowInfo.index);
    const rowSelected = reduxFormSelectedEntityIdMap[rowId];
    const isExpanded = reduxFormExpandedEntityIdMap[rowId];
    const rowDisabled = isEntityDisabled(entity);
    return {
      onClick: e => {
        // if checkboxes are activated or row expander is clicked don't select row
        if (e.target.matches(".tg-expander, .tg-expander *")) {
          change("reduxFormExpandedEntityIdMap", {
            ...reduxFormExpandedEntityIdMap,
            [rowId]: !isExpanded
          });
          return;
        } else if (
          e.target.closest(".tg-react-table-checkbox-cell-container")
        ) {
          return;
        }
        rowClick(e, rowInfo, entities, computePresets(this.props));
      },
      onContextMenu: e => {
        e.preventDefault();
        if (rowId === undefined || rowDisabled) return;
        const oldIdMap = cloneDeep(reduxFormSelectedEntityIdMap) || {};
        let newIdMap;
        if (withCheckboxes) {
          newIdMap = oldIdMap;
        } else {
          // if we are not using checkboxes we need to make sure
          // that the id of the record gets added to the id map

          // this will update the record in redux to have the fresh data.
          // tg: we were running into issues of stale data because the redux
          // record does not get automatically updated when the record is updated
          oldIdMap[rowId] = { ...oldIdMap[rowId], entity };
          newIdMap = oldIdMap;
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
      reduxFormSelectedEntityIdMap
    );
    const checkboxProps = {
      checked: false,
      indeterminate: false
    };
    const notDisabledEntityCount = entities.reduce((acc, e) => {
      return isEntityDisabled(e) ? acc : acc + 1;
    }, 0);
    if (checkedRows.length === notDisabledEntityCount) {
      //tnr: maybe this will need to change if we want enable select all across pages
      checkboxProps.checked = notDisabledEntityCount !== 0;
    } else {
      if (checkedRows.length) {
        checkboxProps.indeterminate = true;
      }
    }

    return !isSingleSelect ? (
      <Checkbox
        disabled={noSelect || noUserSelect}
        /* eslint-disable react/jsx-no-bind */
        onChange={() => {
          const newIdMap = cloneDeep(reduxFormSelectedEntityIdMap) || {};
          entities.forEach((entity, i) => {
            if (isEntityDisabled(entity)) return;
            const entityId = getIdOrCodeOrIndex(entity, i);
            if (checkboxProps.checked) {
              newIdMap[entityId] = false;
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
      />
    ) : null;
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
      reduxFormSelectedEntityIdMap
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
      <Checkbox
        disabled={noSelect || noUserSelect || isEntityDisabled(entity)}
        /* eslint-disable react/jsx-no-bind*/
        onChange={e => {
          let newIdMap = cloneDeep(reduxFormSelectedEntityIdMap) || {};
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
                newIdMap[tempEntityId] = false;
              }
            }
          } else {
            //no shift key
            if (isRowCurrentlyChecked) {
              newIdMap[entityId] = false;
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
        checked={isSelected}
      />
    );
  };

  renderColumns = () => {
    const {
      cellRenderer,
      withCheckboxes,
      SubComponent,
      shouldShowSubComponent,
      entities,
      getCellHoverText,
      withExpandAndCollapseAllButton,
      reduxFormExpandedEntityIdMap,
      change
    } = computePresets(this.props);
    const { columns } = this.state;
    if (!columns.length) {
      return columns;
    }
    const columnsToRender = [];
    if (SubComponent) {
      columnsToRender.push({
        ...(withExpandAndCollapseAllButton && {
          Header: () => {
            const showCollapseAll =
              Object.values(reduxFormExpandedEntityIdMap).filter(i => i)
                .length === entities.length;
            return (
              <InfoHelper
                content={showCollapseAll ? "Collapse All" : "Expand All"}
                isButton
                popoverProps={{
                  modifiers: {
                    preventOverflow: { enabled: false },
                    hide: { enabled: false }
                  }
                }}
                onClick={() => {
                  showCollapseAll
                    ? change("reduxFormExpandedEntityIdMap", {})
                    : change(
                        "reduxFormExpandedEntityIdMap",
                        entities.reduce((acc, e) => {
                          acc[e.id] = true;
                          return acc;
                        }, {})
                      );
                }}
                className={classNames(
                  "tg-expander-all",
                  Classes.MINIMAL,
                  Classes.SMALL
                )}
                icon={showCollapseAll ? "chevron-down" : "chevron-right"}
              />
            );
          }
        }),
        expander: true,
        Expander: ({ isExpanded, original: record }) => {
          let shouldShow = true;
          if (shouldShowSubComponent) {
            shouldShow = shouldShowSubComponent(record);
          }
          if (!shouldShow) return null;
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
        }
      });
    }

    if (withCheckboxes) {
      columnsToRender.push({
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
      });
    }
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
          const val = column.render(row.value, row.original, row, this.props);
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
        const [row] = args;
        const val = oldFunc(...args);
        const text = this.getCopyTextForCell(val, row, column);

        //wrap the original tableColumn.Cell function in another div in order to add a title attribute
        let title = typeof val !== "string" ? args[0].value : val;
        if (title) title = String(title);
        if (getCellHoverText) title = getCellHoverText(...args);
        if (column.getTitleAttr) title = column.getTitleAttr(...args);
        return (
          <div
            style={
              column.noEllipsis
                ? {}
                : { textOverflow: "ellipsis", overflow: "hidden" }
            }
            data-test={"tgCell_" + column.path}
            className="tg-cell-wrapper"
            data-copy-text={text}
            title={title || undefined}
          >
            {val}
          </div>
        );
      };

      columnsToRender.push(tableColumn);
    });
    return columnsToRender;
  };

  getCopyTextForCell = (val, row, column) => {
    // TODOCOPY we need a way to potentially omit certain columns from being added as a \t element (talk to taoh about this)

    let text = val;
    const record = row.original;
    if (column.getClipboardData) {
      text = column.getClipboardData(row.value, record);
    } else if (column.render) {
      text = column.render(row.value, record, row, this.props);
    } else if (text) {
      text = String(text);
    }
    const stringText = toString(text);
    if (stringText === "[object Object]") return "";
    return stringText;
  };

  showContextMenu = (idMap, e) => {
    const { history, contextMenu, isCopyable } = computePresets(this.props);
    const selectedRecords = getRecordsFromIdMap(idMap);
    const itemsToRender = contextMenu({
      selectedRecords,
      history
    });
    if (!itemsToRender && !isCopyable) return null;
    const copyMenuItems = [];
    if (
      isCopyable &&
      (selectedRecords.length === 0 || selectedRecords.length === 1)
    ) {
      copyMenuItems.push(
        <MenuItem
          key="copySelectedRows"
          onClick={() => {
            const cell =
              e.target.querySelector(".tg-cell-wrapper") ||
              e.target.closest(".tg-cell-wrapper");
            const row = cell.closest(".rt-tr");
            this.handleCopyRow(row);
            // loop through each cell in the row
          }}
          icon="clipboard"
          text="Copy Row to Clipboard"
        />
      );
    }
    if (isCopyable && selectedRecords.length > 1) {
      copyMenuItems.push(
        <MenuItem
          key="copySelectedRows"
          onClick={() => {
            this.handleCopySelectedRows(selectedRecords, e);
            // loop through each cell in the row
          }}
          icon="clipboard"
          text="Copy Selected Rows to Clipboard"
        />
      );
    }
    e.persist();
    if (isCopyable) {
      copyMenuItems.push(
        <MenuItem
          key="copyCell"
          onClick={() => {
            //TODOCOPY: we need to make sure that the cell copy is being used by the row copy.. right now we have 2 different things going on
            //do we need to be able to copy hidden cells? It seems like it should just copy what's on the page..?
            const cellWrapper =
              e.target.querySelector(".tg-cell-wrapper") ||
              e.target.closest(".tg-cell-wrapper");
            const text = this.getCellCopyText(cellWrapper);
            this.handleCopyHelper(text, "Cell copied");
          }}
          icon="clipboard"
          text="Copy Cell to Clipboard"
        />
      );
    }
    const menu = (
      <Menu>
        {itemsToRender}
        {copyMenuItems}
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
      columnFilterDisabled,
      renderTitleInner,
      filterIsActive = noop,
      noTitle,
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
        <div className="tg-sort-arrow-container">
          <Icon
            title="Sort Z-A (Hold shift to sort multiple columns)"
            icon="chevron-up"
            color={sortUp ? "#106ba3" : undefined}
            style={{
              display: sortUp ? "inherit" : undefined
            }}
            iconSize={12}
            onClick={e => {
              setOrder("-" + ccDisplayName, sortUp, e.shiftKey);
            }}
          />
          <Icon
            title="Sort A-Z (Hold shift to sort multiple columns)"
            icon="chevron-down"
            color={sortDown ? "#106ba3" : undefined}
            iconSize={12}
            style={{
              display: sortDown ? "inherit" : undefined
            }}
            onClick={e => {
              setOrder(ccDisplayName, sortDown, e.shiftKey);
            }}
          />
        </div>
      ) : null;
    const FilterMenu = column.FilterMenu || FilterAndSortMenu;
    const filterMenu =
      withFilter &&
      !isActionColumn &&
      !filterDisabled &&
      !columnFilterDisabled ? (
        <BooleanValue defaultValue={false}>
          {({ value, toggle, clear }) => {
            return (
              <Popover
                position="bottom"
                onClose={() => {
                  clear();
                }}
                isOpen={value}
                modifiers={{
                  preventOverflow: { enabled: false },
                  hide: { enabled: false },
                  flip: { enabled: false }
                }}
              >
                <Icon
                  style={{ marginLeft: 5 }}
                  icon="filter"
                  onClick={toggle}
                  className={classNames("tg-filter-menu-button", {
                    "tg-active-filter": !!filterActiveForColumn
                  })}
                />
                <FilterMenu
                  addFilters={addFilters}
                  togglePopover={clear}
                  removeSingleFilter={removeSingleFilter}
                  currentFilter={currentFilter}
                  filterOn={ccDisplayName}
                  dataType={columnDataType}
                  schemaForField={column}
                  currentParams={currentParams}
                  setNewParams={setNewParams}
                />
              </Popover>
            );
          }}
        </BooleanValue>
      ) : null;

    return (
      <div
        data-test={displayName || startCase(path)}
        className="tg-react-table-column-header"
      >
        {(displayName || startCase(path)) && !noTitle && (
          <span title={columnTitle} className="tg-react-table-name">
            {renderTitleInner ? renderTitleInner : columnTitle}
          </span>
        )}
        {sortComponent}
        {filterMenu}
      </div>
    );
  };
}

// const CompToExport =  dataTableEnhancer(HotkeysTarget(DataTable));
// // CompToExport.selectRecords = (form, value) => {
// //   return change(form, "reduxFormSelectedEntityIdMap", value)
// // }
// export default CompToExport
export default dataTableEnhancer(HotkeysTarget(DataTable));
const ConnectedPagingTool = dataTableEnhancer(PagingTool);
export { ConnectedPagingTool };
