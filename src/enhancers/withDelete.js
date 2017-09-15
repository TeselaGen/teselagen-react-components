import pluralize from "pluralize";
import pascalCase from "pascal-case";
import { gql } from "react-apollo";
import { graphql } from "react-apollo";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";

/**
 * withUpsert 
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param options 
 *    @param refetchQueries {[queryNameStrings]} 
 *    @param mutationName {string} optional rename of the default upsert function withXXXX to whatever you want
 *    @param extraMutateArgs {obj | function} obj or function that returns obj to get passed to the actual mutation call
 *    @param showError {boolean} default=true -- whether or not to show a default error message on failure
 TODO *    @param invalidate {[string]} array of model types to invalidate after the mutate
 TODO *    @param asFunction {boolean} if true, this gives you back a function you can call directly instead of a HOC
 * @return deleteXXXX function that takes an id or an array of ids of records to delete. It returns a promise resolving to an array of created/updated outputs
 */

export default function(nameOrFragment, options = {}) {
  const {
    mutationName,
    extraMutateArgs,
    refetchQueries,
    showError = true,
    ...rest
  } = options;
  const fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  const name = fragment
    ? fragment.definitions[0].typeCondition.name.value
    : nameOrFragment;
  const recordType = pascalCase(name);
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
          refetchQueries,
          ...getExtraMutateArgs(...args)
        })
          .then(function({ data }) {
            const { deletedCount } = data[`delete${recordType}`];
            if (deletedCount !== idArray.length) {
              console.error(
                `Uh oh, the number of deleted items does not match the number of IDs passed in to be deleted! `
              );
              console.error("idArray.length:", idArray.length);
              console.error("deletedCount:", deletedCount);
              console.error(
                `make sure you passed in the correct type ${name} for the item you want to be deleting and that the item still exists! `
              );
            }
          })
          .catch(e => {
            if (showError) {
              window.toastr.error(`Error deleting ${recordType}`);
              console.error("withUpsert Error:", e);
            }
            throw e; //rethrow the error so it can be caught again if need be
          });
      }
    }),
    ...rest
  });
}
