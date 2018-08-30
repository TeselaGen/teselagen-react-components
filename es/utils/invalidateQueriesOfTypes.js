import { invalidateFields, ROOT } from "apollo-cache-invalidation";

var invalidateQueriesOfTypes = function invalidateQueriesOfTypes(typesArray) {
  var invalidations = typesArray.map(function (type) {
    var reType = new RegExp("^" + type + ".*");
    return [ROOT, reType];
  });
  return invalidateFields(function () {
    return invalidations;
  });
};

export default invalidateQueriesOfTypes;