import React from "react";

const TableFormTrackerContext = React.createContext({
  formNames: [],
  pushFormName: () => {},
  isActive: false
});

export default TableFormTrackerContext;
