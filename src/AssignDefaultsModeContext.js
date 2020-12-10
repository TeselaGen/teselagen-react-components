import React from "react";

export const AssignDefaultsModeContext = React.createContext({
  inAssignDefaultsMode: false,
  setAssignDefaultsMode: () => {}
});
