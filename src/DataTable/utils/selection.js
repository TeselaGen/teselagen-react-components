import getIdOrCode from "./getIdOrCode";

export const getSelectedRecordsFromEntities = (entities, idMap) => {
  if (!idMap) return [];
  return entities.reduce((acc, entity) => {
    return idMap[getIdOrCode(entity)] ? acc.concat(entity) : acc;
  }, []);
};

export const getSelectedRowsFromEntities = (entities, idMap) => {
  if (!idMap) return [];
  return entities.reduce((acc, entity, i) => {
    return idMap[getIdOrCode(entity)] ? acc.concat(i) : acc;
  }, []);
};
