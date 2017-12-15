import pluralize from "pluralize";
import pascalCase from "pascal-case";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { camelCase } from "lodash";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";

/**
 * withUpsert 
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param {options} 
 * @typedef {object} options
 * @property {[queryNameStrings]} refetchQueries - 
 * @property {string} mutationName - optional rename of the default delete function deleteXXXX to whatever you want
 * @property {obj | function} extraMutateArgs - obj or function that returns obj to get passed to the actual mutation call
 * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
 * @property {boolean} asFunction {boolean} if true, this gives you back a function you can call directly instead of a HOC
 TODO *    @param invalidate {[string]} array of model types to invalidate after the mutate
 * @return deleteXXXX function that takes an id or an array of ids of records to delete. It returns a promise resolving to an array of created/updated outputs
 */

export default function(nameOrFragment, options = {}) {
  const {
    mutationName,
    extraMutateArgs,
    refetchQueries,
    showError = true,
    client,
    asFunction,
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
  /*eslint-enable*/

  const getExtraMutateArgs = (...args) => {
    let extraArgs = {};
    if (typeof extraMutateArgs === "function") {
      extraArgs = { ...extraArgs, ...extraMutateArgs(...args) };
    } else {
      extraArgs = { ...extraArgs, ...extraMutateArgs };
    }

    return extraArgs;
  };

  if (asFunction) {
    if (!client)
      return console.error(
        "You need to pass the apollo client to withDelete if using as a function"
      );
    return function deleteEntities(...args) {
      const { input, idArray } = prepareArgs(args);
      return client
        .mutate({
          mutation: deleteByIdsMutation,
          variables: {
            input
          }
        })
        .then(afterDeleteFunction({ idArray, recordType, name }));
    };
  }

  return graphql(deleteByIdsMutation, {
    props: ({ mutate }) => {
      function deleteMutation(...args) {
        const { input, idArray, update } = prepareArgs(args);

        return mutate({
          variables: {
            input
          },
          update: update || invalidateQueriesOfTypes([pluralRecordType]),
          refetchQueries,
          ...getExtraMutateArgs(...args)
        })
          .then(afterDeleteFunction({ idArray, recordType, name }))
          .catch(e => {
            if (showError) {
              window.toastr.error(`Error deleting ${recordType}`);
              console.error(`withDelete ${recordType} Error:`, e);
            }
            throw e; //rethrow the error so it can be caught again if need be
          });
      }
      const toReturn = {
        deleteEntities: deleteMutation,
        [camelCase("delete_" + recordType)]: deleteMutation
      };
      if (mutationName) {
        toReturn[mutationName] = deleteMutation;
      }
      return toReturn;
    },

    ...rest
  });
}

function prepareArgs(args) {
  const [maybeIdArray, { isCode, update } = {}] = args;
  const idArray = Array.isArray(maybeIdArray) ? maybeIdArray : [maybeIdArray];
  if (idArray.length < 1) {
    console.error(
      "Something went wrong, you need to pass at least one id when making a delete!"
    );
  }
  const input = idArray.map(id => {
    return {
      [isCode ? "code" : "id"]: id
    };
  });
  return {
    input,
    idArray,
    update
  };
}

const afterDeleteFunction = ({ idArray, recordType, name }) => ({ data }) => {
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
};
