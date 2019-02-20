import { graphql } from "react-apollo";
import compose from "lodash/fp/compose";
import { chunk } from "lodash";
import gql from "graphql-tag";
import pascalCase from "pascal-case";
import { withHandlers } from "recompose";
import invalidateQueriesOfTypes from "../utils/invalidateQueriesOfTypes";
import generateFragmentWithFields from "../utils/generateFragmentWithFields";
import { SAFE_UPSERT_PAGE_SIZE } from "../constants";

/**
 * withUpsert
 * @param {string | gql fragment} nameOrFragment supply either a name or a top-level fragment
 * @param {options} options
 * @typedef {object} options
 * @property {string} mutationName - optional rename of the default upsert function withXXXX to whatever you want
 * @property {[queryNameStrings]} refetchQueries -
 * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
 * @property {obj | function} extraMutateArgs - obj or function that returns obj to get passed to the actual mutation call
 * @property {[string]} invalidate - array of model types to invalidate after the mutate
 * @property {boolean} asFunction - if true, this gives you back a function you can call directly instead of a HOC
 * @property {string} idAs - if not using a fragment, you get an id field back as default. But, if the record doesn't have an id field, and instead has a 'code', you can set idAs: 'code'
 * @property {boolean} forceCreate - sometimes the thing you're creating won't have an id field (it might have a code or something else as its primary key). This lets you override the default behavior of updating if no id is found
 * @property {boolean} forceUpdate - sometimes the thing you're updating might have an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
 * @property {boolean} excludeResults - don't fetch back result entities after update or create
 * @return upsertXXXX function that takes an object or array of objects to upsert. It returns a promise resolving to an array of created/updated outputs
 */

export default function withUpsert(nameOrFragment, options = {}) {
  const {
    mutationName,
    extraMutateArgs = {},
    invalidate,
    asFunction,
    idAs,
    forceCreate: topLevelForceCreate,
    forceUpdate: topLevelForceUpdate,
    client,
    refetchQueries,
    showError = true,
    excludeResults = false,
    ...rest
  } = options;
  let fragment = typeof nameOrFragment === "string" ? null : nameOrFragment;
  if (Array.isArray(fragment)) {
    fragment = generateFragmentWithFields(...fragment);
  }
  const name = fragment
    ? fragment.definitions[0].typeCondition.name.value
    : nameOrFragment;

  // const {fragment, extraMutateArgs} = options
  const fragName = fragment && fragment.definitions[0].name.value;
  const pascalCaseName = pascalCase(name);
  const createName = `create${pascalCaseName}`;
  const resultString = `${
    !excludeResults
      ? `results {
    ${fragName ? `...${fragName}` : idAs || "id"}
  }`
      : ""
  }
  totalResults`;
  /* eslint-disable */
  const createMutation = gql`
    mutation ${createName}($input: [${createName}Input]) {
      ${createName}(input: $input) {
        createdItemsCursor {
          ${resultString}
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
          ${resultString}
        }
      }
    }
    ${fragment ? fragment : ``}
  `;
  /* eslint-enable */

  const getExtraMutateArgs = (...args) => {
    const runtimeOptions = args && args[1];
    const extraMutateArgsToUse =
      runtimeOptions && runtimeOptions.extraMutateArgs
        ? runtimeOptions.extraMutateArgs
        : extraMutateArgs;
    let extraArgs = {};
    if (invalidate) {
      if (!Array.isArray(invalidate))
        throw new Error(
          'The invalidate option should be an array of model name strings eg ["user", "workflowRun"]'
        );
      extraArgs = { options: invalidateQueriesOfTypes(invalidate) };
    }
    if (typeof extraMutateArgsToUse === "function") {
      extraArgs = { ...extraArgs, ...extraMutateArgsToUse(...args) };
    } else {
      extraArgs = { ...extraArgs, ...extraMutateArgsToUse };
    }
    return extraArgs;
  };

  if (asFunction) {
    if (!client)
      return console.error(
        "You need to pass the apollo client to withUpsert if using as a function"
      );
    return function upsert(valueOrValues, options) {
      const values = Array.isArray(valueOrValues)
        ? valueOrValues
        : [valueOrValues];
      let isUpdate = !!(values[0].id || values[0].code);
      if (topLevelForceCreate) {
        isUpdate = false;
      }
      if (topLevelForceUpdate) {
        isUpdate = true;
      }
      return client
        .mutate({
          mutation: isUpdate ? updateMutation : createMutation,
          name: "createDataFile",
          variables: {
            input: values
          },
          ...rest,
          ...options
        })
        .then(function(res) {
          const resultInfo =
            res.data[isUpdate ? updateName : createName][
              isUpdate ? "updatedItemsCursor" : "createdItemsCursor"
            ];
          return Promise.resolve(
            excludeResults ? resultInfo.totalResults : resultInfo.results
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
            const { update } = args[1] || {};
            return createItem({
              variables: {
                input
              },
              update,
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
            const { update } = args[1] || {};
            return updateItem({
              variables: {
                input
              },
              update,
              refetchQueries,
              ...getExtraMutateArgs(...args)
            });
          }
        };
      },
      ...rest
    }),
    withHandlers({
      createItem: undefined,
      updateItem: undefined,
      [mutationName || `upsert${pascalCaseName}`]: ownProps => async (
        valueOrValues,
        ...rest
      ) => {
        const { createItem, updateItem, apolloOptions = {} } = ownProps;
        const {
          forceCreate = topLevelForceCreate,
          forceUpdate = topLevelForceUpdate
        } = apolloOptions;
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
        const upsertFn = isUpdate ? updateItem : createItem;
        let results = [];
        const addToResults = res => {
          const returnInfo =
            res.data[isUpdate ? updateName : createName][
              isUpdate ? "updatedItemsCursor" : "createdItemsCursor"
            ];
          results = results.concat(returnInfo.results);
          results.totalResults = returnInfo.totalResults;
        };
        try {
          if (values.length > SAFE_UPSERT_PAGE_SIZE) {
            const groupedVals = chunk(values, SAFE_UPSERT_PAGE_SIZE);
            for (const valGroup of groupedVals) {
              addToResults(await upsertFn(valGroup, ...rest));
            }
          } else {
            addToResults(await upsertFn(values, ...rest));
          }
          return results;
        } catch (e) {
          if (showError) {
            window.toastr &&
              window.toastr.error(
                `Error ${isUpdate ? "updating" : "creating"} ${pascalCaseName}`
              );
            console.error(`withUpsert ${pascalCaseName} Error:`, e);
          }
          throw e; //rethrow the error so it can be caught again if need be
        }
        // DEPRECATED
        // return (isUpdate ? updateItem : createItem)(values, ...rest)
        //   .then(function(res) {
        //     const returnInfo =
        //       res.data[isUpdate ? updateName : createName][
        //         isUpdate ? "updatedItemsCursor" : "createdItemsCursor"
        //       ];
        //     let results = returnInfo.results;
        //     results = [...results];
        //     results.totalResults = returnInfo.totalResults;
        //     return Promise.resolve(results);
        //   })
        //   .catch(e => {
        //     if (showError) {
        //       window.toastr &&
        //         window.toastr.error(
        //           `Error ${
        //             isUpdate ? "updating" : "creating"
        //           } ${pascalCaseName}`
        //         );
        //       console.error(`withUpsert ${pascalCaseName} Error:`, e);
        //     }
        //     throw e; //rethrow the error so it can be caught again if need be
        //   });
      }
    })
  );
}
