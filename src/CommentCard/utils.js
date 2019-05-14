import { get, set } from "lodash";

export const REQUIRED_ERROR = "This field is required.";

export const validateRequiredFieldsGenerator = requiredFields => values =>
  validateRequiredFields(requiredFields, values);

export const validateRequiredFields = (requiredFields, values, errors = {}) => {
  requiredFields.forEach(field => {
    const fieldVal = get(values, field);
    if (!fieldVal || (Array.isArray(fieldVal) && !fieldVal.length)) {
      set(errors, field, REQUIRED_ERROR);
    }
  });
  return errors;
};
