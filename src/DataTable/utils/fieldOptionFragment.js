import gql from "graphql-tag";

export default gql`
  fragment fieldOptionFragment on fieldOption {
    id
    isHidden
    path
  }
`;
