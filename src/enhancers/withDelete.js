import pluralize from "pluralize";
import pascalCase from "pascal-case";
import { gql } from "react-apollo";
import { graphql } from "react-apollo";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";

export default function(_recordType, options = {}) {
  const { mutationName, extraMutateArgs } = options;
  const recordType = pascalCase(_recordType);
  const pluralRecordType = pluralize(recordType);
  /*eslint-disable*/
  var deleteByIdsMutation = gql`
    mutation delete${recordType}($input: [delete${recordType}Input]) {
      delete${recordType}(input:$input) {
        deletedCount
      }
    }
  `;

  const getExtraMutateArgs = (...args) => {
    let extraArgs = {};
    if (typeof extraMutateArgs === "function") {
      extraArgs = { ...extraArgs, ...extraMutateArgs(...args) };
    } else {
      extraArgs = { ...extraArgs, ...extraMutateArgs };
    }

    return extraArgs;
  };

  /*eslint-enable*/
  return graphql(deleteByIdsMutation, {
    props: ({ mutate }) => ({
      [mutationName || `deleteEntities`]: (...args) => {
        const [maybeIdArray, { isCode } = {}] = args;
        const idArray = Array.isArray(maybeIdArray)
          ? maybeIdArray
          : [maybeIdArray];
        if (idArray.length < 1) {
          console.error(
            "Something went wrong, you need to pass at least one id when making a delete!"
          );
        }
        // idArray.forEach(function(id) {
        //   if (!Number.isInteger(id)) {
        //     console.error(
        //       "Ids passed to the delete mutation should all be integers but we got ",
        //       id,
        //       " instead"
        //     );
        //   }
        // });
        return mutate({
          variables: {
            input: idArray.map(id => {
              return {
                [isCode ? "code" : "id"]: id
              };
            })
          },
          update: invalidateQueriesOfTypes([pluralRecordType]),
          ...getExtraMutateArgs(...args)
        }).then(function({ data }) {
          const { deletedCount } = data[`delete${recordType}`];
          if (deletedCount !== idArray.length) {
            console.error(
              `Uh oh, the number of deleted items does not match the number of IDs passed in to be deleted! `
            );
            console.error("idArray.length:", idArray.length);
            console.error("deletedCount:", deletedCount);
            console.error(
              `make sure you passed in the correct type ${_recordType} for the item you want to be deleting and that the item still exists! `
            );
          }
        });
      }
    })
  });
}
