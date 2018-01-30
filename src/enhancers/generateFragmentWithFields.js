import { uniqueId } from "lodash";
import gql from "graphql-tag";

/* eslint graphql/template-strings:0 */
export default (model, fields) => gql`
  fragment __${model}FragmentGenerated${uniqueId()} on ${model} {
    ${Array.isArray(fields) ? fields.join("\n") : fields}
  }
`;
