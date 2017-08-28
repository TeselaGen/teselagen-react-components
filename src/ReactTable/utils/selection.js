export const getSelectedRecordsFromEntities = (entities, idMap) => {
  if (!idMap) return [];
  return entities.reduce((acc, entity) => {
    return idMap[entity.id] ? acc.concat(entity) : acc;
  }, []);
};

export const getSelectedRowsFromEntities = (entities, idMap) => {
  if (!idMap) return [];
  return entities.reduce((acc, entity, i) => {
    return idMap[entity.id] ? acc.concat(i) : acc;
  }, []);
};
