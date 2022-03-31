import React from "react";

export const AssignDefaultsModeContext = React.createContext({
  inAssignDefaultsMode: false,
  setAssignDefaultsMode: () => {}
});

export const workflowDefaultParamsObj = {
  taskNumber: undefined,
  workflowDefinitionName: undefined,
  workflowDefinitionId: undefined,
  workflowRunName: undefined,
  workflowRunId: undefined,
  toolName: undefined,
  workflowToolTitle: undefined,
  workflowTaskCode: undefined
};
export const WorkflowDefaultParamsContext = React.createContext(
  workflowDefaultParamsObj
);
