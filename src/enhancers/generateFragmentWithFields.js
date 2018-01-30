import { uniqueId } from "lodash";
import { gql } from "react-apollo";

/* eslint graphql/template-strings:0 */
export default (model, fields, fragments = []) =>
  gql`
  fragment __${model}FragmentGenerated${uniqueId()} on ${model} {
    ${Array.isArray(fields) ? fields.join("\n") : fields}
  }
  ${Array.isArray(fragments)
    ? fragments.map(f => f.loc.source.body).join("\n")
    : fragments}
  `;
