const gql = require("graphql-tag");
const uniqid = require("uniqid");

/* eslint graphql/template-strings:0 */

export default function generateFragmentWithFields(model, fields, fragments = []){
  return gql`
  fragment __${model}FragmentGenerated${uniqid()} on ${model} {
    ${Array.isArray(fields) ? fields.join("\n") : fields}
  }
  ${
    Array.isArray(fragments)
      ? fragments.map(f => f.loc.source.body).join("\n")
      : fragments
  }
  `;
}