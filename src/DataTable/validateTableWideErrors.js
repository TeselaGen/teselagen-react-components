import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";
import { getCellVal } from ".";

const uniqueMsg = "This value must be unique";
export function validateTableWideErrors({ entities, schema, newCellValidate }) {
  schema.fields.forEach(col => {
    const { path, isUnique } = col;
    if (isUnique) {
      const existingVals = {};
      entities.forEach(entity => {
        const val = getCellVal(entity, path, col);
        if (!val) return;
        const cellId = `${getIdOrCodeOrIndex(entity)}:${path}`;
        if (existingVals[val]) {
          newCellValidate[cellId] = uniqueMsg;
          newCellValidate[existingVals[val]] = uniqueMsg;
        } else {
          if (newCellValidate[cellId] === uniqueMsg) {
            delete newCellValidate[cellId];
          }
          existingVals[val] = cellId;
        }
      });
    }
  });
  return newCellValidate;
}
