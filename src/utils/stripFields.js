export default function stripFields(data, fieldStripper) {
  fieldStripper = fieldStripper || [];
  if (!data) return undefined;
  let arrayData = data;
  let isObject = false;
  if (!Array.isArray(data)) {
    arrayData = [data];
    isObject = true;
  }

  const keepField = fieldName => {
    if (Array.isArray(fieldStripper))
      return fieldStripper.indexOf(fieldName) > -1;
    return !fieldStripper(fieldName);
  };

  const filteredArrayData = arrayData.map(function(data) {
    let filteredData = {};

    Object.keys(data).forEach(function(dataKey) {
      const subData = data[dataKey];
      if (keepField(dataKey)) {
        if (
          subData !== null &&
          (typeof subData === "object" || Array.isArray(subData))
        ) {
          filteredData[dataKey] = stripFields(subData, fieldStripper);
        } else {
          filteredData[dataKey] = subData;
        }
      }
    });

    return filteredData;
  });

  if (isObject) {
    return filteredArrayData[0];
  }
  return filteredArrayData;
}
