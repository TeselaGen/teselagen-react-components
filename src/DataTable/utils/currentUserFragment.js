import gql from "graphql-tag";

export default gql`
  fragment userLoginFragment on userLogin {
    id
    user {
      id
    }
  }
`;
