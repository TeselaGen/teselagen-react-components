import { gql } from "react-apollo";

export default gql`
  fragment fieldOptionFragment on fieldOption {
    id
    isHidden
    path
  }
`;
