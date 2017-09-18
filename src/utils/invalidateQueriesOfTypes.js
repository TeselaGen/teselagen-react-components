import { invalidateFields, ROOT } from "apollo-cache-invalidation";

const invalidateQueriesOfTypes = (typesArray: Array<string>): Function => {
  const invalidations = typesArray.map(function(type) {
    const reType = new RegExp(`^${type}.*`);
    return [ROOT, reType];
  });
  return invalidateFields(() => invalidations);
};

export default invalidateQueriesOfTypes;
