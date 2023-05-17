import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";
import { getCellVal } from ".";
import { forEach } from "lodash";

const uniqueMsg = "This value must be unique";
export function validateTableWideErrors({
  entities,
  schema,
  optionalUserSchema,
  newCellValidate
}) {
  forEach(newCellValidate, (err, cellId) => {
    if (err && err._isTableWideError) {
      delete newCellValidate[cellId];
    }
  });
  if (schema.tableWideValidation) {
    const newErrs = schema.tableWideValidation({
      entities,
    });
    forEach(newErrs, (err, cellId) => {
      newCellValidate[cellId] = {
        message: err,
        _isTableWideError: true
      };
    })
  }
  schema.fields.forEach(col => {
    let { path, isUnique } = col;
    if (isUnique) {
      if (optionalUserSchema) {
        path = col.matches[0].item.path;
      }
      const existingVals = {};
      entities.forEach(entity => {
        const val = getCellVal(entity, path, col);
        if (!val) return;
        const cellId = `${getIdOrCodeOrIndex(entity)}:${path}`;
        if (existingVals[val]) {
          newCellValidate[cellId] = {
            message: uniqueMsg,
            _isTableWideError: true
          };
          newCellValidate[existingVals[val]] = {
            message: uniqueMsg,
            _isTableWideError: true
          };
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
