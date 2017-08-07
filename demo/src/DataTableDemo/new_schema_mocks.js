import Chance from 'chance';
import toArray from "lodash/toArray";
import times from "lodash/times";
const chance = new Chance()
const MOCK_MATERIALS = times(60).map(function (a,index) {
  
  return {
    id: index,
    name: chance.name(),
    user: {
      lastName: chance.name(),
      status: {
        name: chance.pickone(['pending', 'added'])
      }
    },
    type: 'denicolaType',
    addedBy: chance.name(),
    updatedAt: new Date().toLocaleString(),
    createdAt: new Date().toLocaleString()
  }
})

// const MOCK_MATERIALS = {
//   "1": {
//     id: 1,
//     name: "Material 1asdasdasdasdasdasdasdasdasdasdasdassa",
//     user: {
//       lastName: "Rich",
//       status: {
//         name: "pending"
//       }
//     },
//     type: 'denicolaType',
//     addedBy: "Sam DeNicola",
//     updatedAt: new Date().toLocaleString(),
//     createdAt: new Date().toLocaleString()
//   },
//   "2": {
//     id: 2,
//     name: "Material 2",
//     user: {
//       lastName: "Rich",
//       status: {
//         name: "pending"
//       }
//     },
//     type: 'denicolaType',
//     addedBy: "Sam DeNicola",
//     updatedAt: new Date().toLocaleString(),
//     createdAt: new Date().toLocaleString()
//   },
//   "3": {
//     id: 3,
//     name: "Material 3",
//     user: {
//       lastName: "Rich",
//       status: {
//         name: "pending"
//       }
//     },
//     type: 'denicolaType',
//     addedBy: "Mike Fero",
//     updatedAt: new Date().toLocaleString(),
//     createdAt: new Date().toLocaleString()
//   },
//   "4": {
//     id: 4,
//     name: "Material 4",
//     user: {
//       lastName: "Rich",
//       status: {
//         name: "pending"
//       }
//     },
//     type: 'denicolaType',
//     addedBy: "Sam DeNicola",
//     updatedAt: new Date().toLocaleString(),
//     createdAt: new Date().toLocaleString()
//   }
// };
// export const entities = toArray(MOCK_MATERIALS);
export const entities = MOCK_MATERIALS;
export const schema = {
  // fields: {
  //   name: { type: "string", displayName: "Name" },
  //   addedBy: {
  //     type: "string",
  //     displayName: "Added By"
  //   },
  //   createdAt: { type: "timestamp", displayName: "Date Created" },
  //   updatedAt: { type: "timestamp", displayName: "Last Edited" }
  // }
  model: "material",
  fields: [
    {path: "type", type: "lookup", displayName: "Type" },
    {path: "name", type: "string", displayName: "Name" },
    {path: "createdAt", type: "timestamp", displayName: "Date Created" },
    {path: "updatedAt", type: "timestamp", displayName: "Last Edited" },
    {
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
    {
      sortDisabled: true,
      path: "user.lastName",
      reference: {
        sourceField: "userId",
        target: "user.id"
      },
      type: "string",
      displayName: "Added By"
    }
  ]
};
