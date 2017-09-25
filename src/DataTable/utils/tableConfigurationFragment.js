import { gql } from "react-apollo";
import fieldOptionFragment from "./fieldOptionFragment";

export default gql`
  fragment tableConfigurationFragment on tableConfiguration {
    id
    formName
    fieldOptions {
      ...fieldOptionFragment
    }
  }
  ${fieldOptionFragment}
`;
