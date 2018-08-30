var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import withQuery from "./withQuery/withQuery";
import withDelete from "./withDelete";
import withUpsert from "./withUpsert";

export default function getApolloMethods(client) {
  return {
    upsert: function upsert(fragment, options, valueOrValues) {
      var optionsToUse = {};
      var valueOrValuesToUse = valueOrValues;
      if (!valueOrValues) {
        valueOrValuesToUse = options;
      } else {
        optionsToUse = options;
      }
      return withUpsert(fragment, _extends({
        asFunction: true,
        client: client
      }, optionsToUse))(valueOrValuesToUse);
    },
    query: function query(fragment, options) {
      return withQuery(fragment, _extends({ asFunction: true, client: client }, options))();
    },
    delete: function _delete(fragment, options, idOrIdsToDelete) {
      var optionsToUse = {};
      var idOrIdsToDeleteToUse = idOrIdsToDelete;
      if (!idOrIdsToDeleteToUse) {
        idOrIdsToDeleteToUse = options;
      } else {
        optionsToUse = options;
      }
      return withDelete(fragment, _extends({
        asFunction: true,
        client: client
      }, optionsToUse))(idOrIdsToDeleteToUse);
    }
  };
}