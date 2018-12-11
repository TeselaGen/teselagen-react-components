import { chunk, get } from "lodash";
import modelNameToReadableName from "../utils/modelNameToReadableName";
import withQuery from "./withQuery";
import withDelete from "./withDelete";
import withUpsert from "./withUpsert";

export default function getApolloMethods(client) {
  const upsert = (fragment, options, valueOrValues) => {
    let optionsToUse = {};
    let valueOrValuesToUse = valueOrValues;
    if (!valueOrValues) {
      valueOrValuesToUse = options;
    } else {
      optionsToUse = options;
    }
    return withUpsert(fragment, {
      asFunction: true,
      client,
      ...optionsToUse
    })(valueOrValuesToUse);
  };

  /**
   * If `upsert` is called with an empty array for the values,
   * it will throw an error. This function factory can preclude
   * the need to make sure the values being upserted aren't empty.
   *
   * secondly, if trying to upsert more than 50 items it will split
   * them into groups and upsert 50 at a time.
   */
  async function safeUpsert(...args) {
    const values = args.pop();
    if (Array.isArray(values) && !values.length) return [];
    else {
      if (values.length > 50) {
        const groupedVals = chunk(values, 50);
        let toReturn = [];
        for (const valGroup of groupedVals) {
          toReturn = toReturn.concat(await upsert(...args, valGroup));
        }
        return toReturn;
      } else {
        return await upsert(...args, values);
      }
    }
  }

  const query = (fragment, options) => {
    return withQuery(fragment, { asFunction: true, client, ...options })();
  };

  /**
   * If `query` tries to query more than 50 items this function
   * will group them into queries of 50 at a time and then
   * return them together
   */
  async function safeQuery(fragment, passedOptions = {}) {
    const {
      nameOverride,
      pageSize = 50,
      showToast,
      ...maybeOptions
    } = passedOptions;
    // not plural
    if (
      get(maybeOptions, "variables.id") ||
      get(maybeOptions, "variables.code")
    ) {
      return await query(fragment, maybeOptions);
    }

    // if specifying page size we don't want to do the special paging
    if (get(maybeOptions, "variables.pageSize")) {
      return await query(fragment, {
        isPlural: true,
        ...maybeOptions
      });
    }

    const pageVariables = {
      pageSize
    };

    let options = {
      isPlural: true,
      variables: pageVariables
    };

    if (maybeOptions) {
      options = {
        isPlural: true,
        ...maybeOptions,
        variables: {
          ...pageVariables,
          ...maybeOptions.variables
        }
      };
    }

    let page = 1;
    let items = [];
    let totalResults = 1;
    let clearToast;

    while (items.length < totalResults) {
      options.variables.pageNumber = page++;
      const pageOfItems = await query(fragment, options);
      items = items.concat(pageOfItems);
      totalResults = pageOfItems.totalResults;
      if (showToast && totalResults > 100) {
        const readableName =
          nameOverride ||
          modelNameToReadableName(get(items, "[0].__typename"), {
            plural: true
          });
        const toastMessage = `Loading ${readableName}:`;
        clearToast = showToast(
          nameOverride ? `Loading ${nameOverride}` : toastMessage,
          items.length / totalResults,
          clearToast && clearToast.key
        );
      }
    }
    items.totalResults = totalResults;
    if (clearToast) {
      setTimeout(() => {
        clearToast();
      }, 1500);
    }
    return items;
  }

  function makeSafeQueryWithToast(showToast) {
    return (fragment, passedOptions = {}) => {
      return safeQuery(fragment, { ...passedOptions, showToast });
    };
  }

  const deleteFn = (fragment, options, idOrIdsToDelete) => {
    let optionsToUse = {};
    let idOrIdsToDeleteToUse = idOrIdsToDelete;
    if (!idOrIdsToDeleteToUse) {
      idOrIdsToDeleteToUse = options;
    } else {
      optionsToUse = options;
    }
    return withDelete(fragment, {
      asFunction: true,
      client,
      ...optionsToUse
    })(idOrIdsToDeleteToUse, optionsToUse);
  };

  async function safeDelete(...args) {
    const values = args[args.length - 1];
    if (Array.isArray(values) && !values.length) return [];
    else return await deleteFn(...args);
  }

  return {
    upsert,
    safeUpsert,
    query,
    safeQuery,
    makeSafeQueryWithToast,
    delete: deleteFn,
    safeDelete
  };
}
