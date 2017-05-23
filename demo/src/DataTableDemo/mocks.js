import toArray from "lodash/toArray";

const MOCK_MATERIALS = {
  "1": {
    name: "Material 1asdasdasdasdasdasdasdasdasdasdasdassa",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "2": {
    name: "Material 2",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "3": {
    name: "Material 3",
    addedBy: "Mike Fero",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "4": {
    name: "Material 4",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  }
};
export const entities = toArray(MOCK_MATERIALS);
export const schema = {
  fields: {
    name: { type: "string", displayName: "Name" },
    addedBy: {
      type: "string",
      displayName: "Added By"
    },
    dateCreated: { type: "timestamp", displayName: "Date Created" },
    lastEdited: { type: "timestamp", displayName: "Last Edited" }
  }
};

export const columns = ["name", "addedBy", "dateCreated", "lastEdited"];
