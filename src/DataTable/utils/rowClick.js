import { isEmpty, forEach, range } from "lodash";
import {
  getSelectedRowsFromEntities,
  getSelectedRecordsFromEntities
} from "./selection";
import getIdOrCode from "./getIdOrCode";

export default (e, rowInfo, entities, props) => {
  const entity = rowInfo.original;
  const rowId = getIdOrCode(entity);
  if (rowId === undefined) return;

  const { reduxFormSelectedEntityIdMap, isSingleSelect } = props;
  const ctrl = e.metaKey || e.ctrlKey;
  const oldIdMap = reduxFormSelectedEntityIdMap.input.value || {};
  const rowSelected = oldIdMap[rowId];
  let newIdMap = {
    [rowId]: {
      time: new Date(),
      entity
    }
  };

  if (isSingleSelect) {
    if (rowSelected) newIdMap = {};
  } else if (rowSelected && e.shiftKey) return;
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
      [rowId]: {
        entity
      }
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
      forEach(oldIdMap, ({ time }, key) => {
        if (time && time > timeToBeat.time)
          timeToBeat = {
            id: key,
            time
          };
      });
      const mostRecentlySelectedIndex = entities.findIndex(e => {
        let id = getIdOrCode(e);
        if (!id && id !== 0) id = "";
        return id.toString() === timeToBeat.id;
      });

      if (mostRecentlySelectedIndex !== -1) {
        // clear out other selections in current group
        for (let i = mostRecentlySelectedIndex + 1; i < entities.length; i++) {
          const entityId = getIdOrCode(entities[i]);
          if (!oldIdMap[entityId]) break;
          delete oldIdMap[entityId];
        }

        for (let i = mostRecentlySelectedIndex - 1; i >= 0; i--) {
          const entityId = getIdOrCode(entities[i]);
          if (!oldIdMap[entityId]) break;
          delete oldIdMap[entityId];
        }

        const highRange =
          rowInfo.index < mostRecentlySelectedIndex
            ? mostRecentlySelectedIndex - 1
            : rowInfo.index;
        const lowRange =
          rowInfo.index > mostRecentlySelectedIndex
            ? mostRecentlySelectedIndex + 1
            : rowInfo.index;
        range(lowRange, highRange + 1).forEach(i => {
          const recordId = entities[i] && getIdOrCode(entities[i]);
          if (recordId || recordId === 0) newIdMap[recordId] = { entity };
        });
        newIdMap = {
          ...oldIdMap,
          ...newIdMap
        };
      }
    }
  }

  finalizeSelection({ idMap: newIdMap, props });
};

export function finalizeSelection({ idMap, props }) {
  const {
    reduxFormSelectedEntityIdMap,
    entities,
    onDeselect,
    onSingleRowSelect,
    onMultiRowSelect,
    onRowSelect
  } = props;
  reduxFormSelectedEntityIdMap.input.onChange(idMap);
  const selectedRecords = getSelectedRecordsFromEntities(entities, idMap);
  onRowSelect(selectedRecords);

  selectedRecords.length === 0
    ? onDeselect()
    : selectedRecords.length > 1
      ? onMultiRowSelect(selectedRecords)
      : onSingleRowSelect(selectedRecords[0]);
}
