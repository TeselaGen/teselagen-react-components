import withQuery from "./withQuery/withQuery";
import withDelete from "./withDelete";
import withUpsert from "./withUpsert";

export default function getApolloMethods(client) {
  return {
    upsert: (fragment, options, valueOrValues) => {
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
    },
    query: (fragment, options) => {
      return withQuery(fragment, { asFunction: true, client, ...options })();
    },
    delete: (fragment, options, idOrIdsToDelete) => {
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
      })(idOrIdsToDeleteToUse);
    }
  };
}
