import getIdOrCodeOrIndex from "./getIdOrCodeOrIndex";

export var getSelectedRecordsFromEntities = function getSelectedRecordsFromEntities(entities, idMap) {
  if (!idMap) return [];
  return entities.reduce(function (acc, entity, i) {
    return idMap[getIdOrCodeOrIndex(entity, i)] ? acc.concat(entity) : acc;
  }, []);
};

export var getSelectedRowsFromEntities = function getSelectedRowsFromEntities(entities, idMap) {
  if (!idMap) return [];
  return entities.reduce(function (acc, entity, i) {
    return idMap[getIdOrCodeOrIndex(entity, i)] ? acc.concat(i) : acc;
  }, []);
};