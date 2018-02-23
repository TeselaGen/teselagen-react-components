import { startCase } from "lodash";

export default schema => {
  let schemaToUse = schema;
  if (!schemaToUse.fields && Array.isArray(schema)) {
    schemaToUse = {
      fields: schema
    };
  }
  schemaToUse.fields = schemaToUse.fields.map(field => {
    if (typeof field === "string") {
      return {
        displayName: startCase(field),
        path: field,
        type: "string"
      };
    } else if (!field.type) {
      return {
        ...field,
        type: "string"
      };
    } else {
      return field;
    }
  });
  return schemaToUse;
};
