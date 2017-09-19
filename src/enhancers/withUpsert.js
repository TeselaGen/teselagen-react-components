import { graphql } from "react-apollo";
import { connect } from "react-redux";
import compose from "lodash/fp/compose";
import { gql } from "react-apollo";
import pascalCase from "pascal-case";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";

/**
 * withUpsert 
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param options 
 *    @param mutationName {string} optional rename of the default upsert function withXXXX to whatever you want
 *    @param refetchQueries {[queryNameStrings]} 
 *    @param showError {boolean} default=true -- whether or not to show a default error message on failure
 *    @param extraMutateArgs {obj | function} obj or function that returns obj to get passed to the actual mutation call
 *    @param invalidate {[string]} array of model types to invalidate after the mutate
 *    @param asFunction {boolean} if true, this gives you back a function you can call directly instead of a HOC
 *    @param idAs {string} if not using a fragment, you get an id field back as default. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
 *    @param forceCreate {boolean} sometimes the thing you're creating won't have an id field (it might have a code or something else as its primary key). This lets you override the default behavior of updating if no id is found
 *    @param forceUpdate {boolean} sometimes the thing you're updating might have an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
 
 * @return upsertXXXX function that takes an object or array of objects to upsert. It returns a promise resolving to an array of created/updated outputs
 */

export default function withUpsert(nameOrFragment, options = {}) {
  const {
    mutationName,
    extraMutateArgs = {},
    invalidate,
    asFunction,
    idAs,
    forceCreate,
    forceUpdate,
    client,
    refetchQueries,
    showError = true,
    ...rest
  } = options;
  const fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  const name = fragment
    ? fragment.definitions[0].typeCondition.name.value
    : nameOrFragment;

  // const {fragment, extraMutateArgs} = options
  const fragName = fragment && fragment.definitions[0].name.value;
  const pascalCaseName = pascalCase(name);
  const createName = `create${pascalCaseName}`;
  /* eslint-disable */
  const createMutation = gql`
    mutation ${createName}($input: [${createName}Input]) {
      ${createName}(input: $input) {
        createdItemsCursor {
          results {
            ${fragName ? `...${fragName}` : idAs || "id"}
          }
        }
      }
    }
    ${fragment ? fragment : ``}
  `;
  /* eslint-enable */

  const updateName = `update${pascalCaseName}`;
  /* eslint-disable */
  const updateMutation = gql`
    mutation ${updateName}($input: [${updateName}Input]) {
      ${updateName}(input: $input) {
        updatedItemsCursor {
          results {
            ${fragName ? `...${fragName}` : idAs || "id"}
          }
        }
      }
    }
    ${fragment ? fragment : ``}
  `;
  /* eslint-enable */

  const getExtraMutateArgs = (...args) => {
    let extraArgs = {};
    if (invalidate) {
      if (!Array.isArray(invalidate))
        throw new Error(
          'The invalidate option should be an array of model name strings eg ["user", "workflowRun"]'
        );
      extraArgs = { options: invalidateQueriesOfTypes(invalidate) };
    }
    if (typeof extraMutateArgs === "function") {
      extraArgs = { ...extraArgs, ...extraMutateArgs(...args) };
    } else {
      extraArgs = { ...extraArgs, ...extraMutateArgs };
    }
    return extraArgs;
  };

  if (asFunction) {
    return function upsert(valueOrValues) {
      const values = Array.isArray(valueOrValues)
        ? valueOrValues
        : [valueOrValues];
      let isUpdate = !!(values[0].id || values[0].code);
      if (forceCreate) {
        isUpdate = false;
      }
      if (forceUpdate) {
        isUpdate = true;
      }
      return client
        .mutate({
          mutation: isUpdate ? updateMutation : createMutation,
          name: "createDataFile",
          variables: {
            input: values
          }
        })
        .then(function(res) {
          return Promise.resolve(
            res.data[isUpdate ? updateName : createName][
              isUpdate ? "updatedItemsCursor" : "createdItemsCursor"
            ].results
          );
        });
    };
  }

  return compose(
    graphql(createMutation, {
      name: "createItem",
      props: ({ createItem }) => {
        return {
          createItem: (...args) => {
            const input = args[0];
            return createItem({
              variables: {
                input
              },
              refetchQueries,
              ...getExtraMutateArgs(...args)
            });
          }
        };
      },
      ...rest
    }),
    graphql(updateMutation, {
      name: "updateItem",
      props: ({ updateItem }) => {
        return {
          updateItem: (...args) => {
            const input = args[0];
            return updateItem({
              variables: {
                input
              },
              refetchQueries,
              ...getExtraMutateArgs(...args)
            });
          }
        };
      },
      ...rest
    }),
    connect((state, ownProps) => {
      const { createItem, updateItem } = ownProps;
      return {
        createItem: undefined, //set these to undefined so people won't be tempted to use them
        updateItem: undefined,
        [mutationName || `upsert${pascalCaseName}`]: (
          valueOrValues,
          ...rest
        ) => {
          //the upsertXXX function is the only thing we should be calling
          const values = Array.isArray(valueOrValues)
            ? valueOrValues
            : [valueOrValues];
          if (!values[0])
            throw new Error(
              "You have to pass at least 1 thing to create or update!"
            );
          let isUpdate = !!(values[0].id || values[0].code);
          if (forceCreate) {
            isUpdate = false;
          }
          if (forceUpdate) {
            isUpdate = true;
          }
          return (isUpdate ? updateItem : createItem)(values, ...rest)
            .then(function(res) {
              return Promise.resolve(
                res.data[isUpdate ? updateName : createName][
                  isUpdate ? "updatedItemsCursor" : "createdItemsCursor"
                ].results
              );
            })
            .catch(e => {
              if (showError) {
                window.toastr.error(
                  `Error ${isUpdate
                    ? "updating"
                    : "creating"} ${pascalCaseName}`
                );
                console.error(`withUpsert ${pascalCaseName} Error:`, e);
              }
              throw e; //rethrow the error so it can be caught again if need be
            });
        }
      };
    })
  );
}
