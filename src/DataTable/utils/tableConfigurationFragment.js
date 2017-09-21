import { gql } from "react-apollo";
import fieldOptionFragment from "../../../lib/DataTable/utils/fieldOptionFragment";

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
