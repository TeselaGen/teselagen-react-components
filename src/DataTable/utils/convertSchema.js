import { startCase } from "lodash";

export default schema => {
  let schemaToUse = schema;
  if (!schemaToUse.fields && Array.isArray(schema)) {
    schemaToUse = {
      fields: schema
    };
  }
  schemaToUse = {
    ...schemaToUse
  };
  schemaToUse.fields = schemaToUse.fields.map((field, i) => {
    let fieldToUse = field;
    if (typeof field === "string") {
      fieldToUse = {
        displayName: startCase(field),
        path: field,
        type: "string"
      };
    } else if (!field.type) {
      fieldToUse = {
        ...field,
        type: "string"
      };
    }
    if (!fieldToUse.displayName) {
      fieldToUse = {
        ...fieldToUse,
        displayName: startCase(fieldToUse.path)
      };
    }
    // paths are needed for column resizing
    if (!fieldToUse.path) {
      fieldToUse = {
        ...fieldToUse,
        filterDisabled: true,
        sortDisabled: true,
        path: "fake-path" + i
      };
    }
    return fieldToUse;
  });
  return schemaToUse;
};
