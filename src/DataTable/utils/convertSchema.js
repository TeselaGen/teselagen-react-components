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
  schemaToUse.fields = schemaToUse.fields.map(field => {
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
    fieldToUse.displayName =
      fieldToUse.displayName || startCase(fieldToUse.path);
    return fieldToUse;
  });
  return schemaToUse;
};
