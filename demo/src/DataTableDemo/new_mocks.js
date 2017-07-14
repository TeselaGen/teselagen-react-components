import toArray from "lodash/toArray";

const MOCK_MATERIALS = {
  "1": {
    name: "Material 1asdasdasdasdasdasdasdasdasdasdasdassa",
    userStatus: 'pending',
    userLastName: 'denicola',
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "2": {
    name: "Material 2",
    userStatus: 'pending',
    userLastName: 'denicola',
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "3": {
    name: "Material 3",
    userStatus: 'pending',
    userLastName: 'denicola',
    addedBy: "Mike Fero",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "4": {
    name: "Material 4",
    userStatus: 'pending',
    userLastName: 'denicola',
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  }
};
export const entities = toArray(MOCK_MATERIALS);
export const schema = {
  // fields: {
  //   name: { type: "string", displayName: "Name" },
  //   addedBy: {
  //     type: "string",
  //     displayName: "Added By"
  //   },
  //   dateCreated: { type: "timestamp", displayName: "Date Created" },
  //   lastEdited: { type: "timestamp", displayName: "Last Edited" }
  // }
  model: "material",
  fields: {
    type: { type: "lookup", displayName: "Type" },
    name: { type: "string", displayName: "Name" },
    createdAt: { type: "timestamp", displayName: "Date Created" },
    updatedAt: { type: "timestamp", displayName: "Last Edited" },
    userStatus: {
      type: 'lookup',
      displayName: "User Status",
      sortDisabled: true,
      path: "user.status.name",
      reference: {
        sourceField: "userId",
        target: "user.id",
        reference: {
          sourceField: "statusId",
          target: "status.id"
        }
      },
    },
    userLastName: {
      sortDisabled: true,
      path: "user.lastName",
      reference: {
        sourceField: "userId",
        target: "user.id"
      },
      type: "string",
      displayName: "Added By"
    }
  }

};

export const columns = [
"type",
"name",
"createdAt",
"updatedAt",
"userStatus",
"userLastName",
];
