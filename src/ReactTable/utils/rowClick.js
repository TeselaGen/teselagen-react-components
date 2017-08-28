import { isEmpty, forEach, range } from "lodash";
import {
  getSelectedRowsFromEntities,
  getSelectedRecordsFromEntities
} from "./selection";

export default (e, rowInfo, props) => {
  const rowId = rowInfo.original.id;
  const {
    reduxFormSelectedEntityIdMap,
    entities,
    onDeselect,
    onSingleRowSelect,
    onMultiRowSelect
  } = props;
  if (rowId === undefined) return;
  const ctrl = e.metaKey || e.ctrlKey;
  const oldIdMap = reduxFormSelectedEntityIdMap.input.value || {};
  const rowSelected = oldIdMap[rowId];
  let newIdMap = {
    [rowId]: new Date()
  };
  if (rowSelected && e.shiftKey) return;
  else if (rowSelected && ctrl) {
    newIdMap = {
      ...oldIdMap
    };
    delete newIdMap[rowId];
  } else if (rowSelected) {
    newIdMap = {};
  } else if (ctrl) {
    newIdMap = {
      ...oldIdMap,
      ...newIdMap
    };
  } else if (e.shiftKey && !isEmpty(oldIdMap)) {
    newIdMap = {
      [rowId]: true
    };
    const currentlySelectedRowIndices = getSelectedRowsFromEntities(
      entities,
      oldIdMap
    );
    if (currentlySelectedRowIndices.length) {
      let timeToBeat = {
        id: null,
        time: null
      };
      forEach(oldIdMap, (value, key) => {
        if (typeof value !== "boolean" && value > timeToBeat.time)
          timeToBeat = {
            id: parseInt(key, 10),
            time: value
          };
      });
      const mostRecentlySelectedIndex = entities.findIndex(
        e => e.id === timeToBeat.id
      );
      if (mostRecentlySelectedIndex !== -1) {
        // clear out other selections in current group
        for (let i = mostRecentlySelectedIndex + 1; i < entities.length; i++) {
          if (!oldIdMap[entities[i].id]) break;
          delete oldIdMap[entities[i].id];
        }

        for (let i = mostRecentlySelectedIndex - 1; i >= 0; i--) {
          if (!oldIdMap[entities[i].id]) break;
          delete oldIdMap[entities[i].id];
        }

        const highRange =
          rowInfo.index < mostRecentlySelectedIndex
            ? mostRecentlySelectedIndex - 1
            : rowInfo.index;
        const lowRange =
          rowInfo.index > mostRecentlySelectedIndex
            ? mostRecentlySelectedIndex + 1
            : rowInfo.index;
        range(lowRange, highRange + 1).forEach(index => {
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

  reduxFormSelectedEntityIdMap.input.onChange(newIdMap);
  const selectedRecords = getSelectedRecordsFromEntities(entities, newIdMap);
  selectedRecords.length === 0
    ? onDeselect && onDeselect()
    : selectedRecords.length > 1
      ? onMultiRowSelect(selectedRecords)
      : onSingleRowSelect(selectedRecords[0]);
};
