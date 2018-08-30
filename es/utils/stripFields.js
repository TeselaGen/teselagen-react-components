var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

export default function stripFields(data, fieldStripper) {
  fieldStripper = fieldStripper || [];
  if (!data) return undefined;
  var arrayData = data;
  var isObject = false;
  if (!Array.isArray(data)) {
    arrayData = [data];
    isObject = true;
  }

  var keepField = function keepField(fieldName) {
    if (Array.isArray(fieldStripper)) return fieldStripper.indexOf(fieldName) > -1;
    return !fieldStripper(fieldName);
  };

  var filteredArrayData = arrayData.map(function (data) {
    var filteredData = {};

    Object.keys(data).forEach(function (dataKey) {
      var subData = data[dataKey];
      if (keepField(dataKey)) {
        if (subData !== null && ((typeof subData === "undefined" ? "undefined" : _typeof(subData)) === "object" || Array.isArray(subData))) {
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