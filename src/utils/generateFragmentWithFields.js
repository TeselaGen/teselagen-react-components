import { gql } from "react-apollo";
import uuid from "uuid/v4";

/* eslint graphql/template-strings:0 */
export default (model, fields, fragments = []) =>
  gql`
  fragment __${model}FragmentGenerated${uuid()} on ${model} {
    ${Array.isArray(fields) ? fields.join("\n") : fields}
  }
  ${
    Array.isArray(fragments)
      ? fragments.map(f => f.loc.source).join("\n")
      : fragments
  }
  `;
