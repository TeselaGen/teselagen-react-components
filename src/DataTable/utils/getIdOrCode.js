export default record => {
  return record.id || record.id === 0 ? record.id : record.code;
};
