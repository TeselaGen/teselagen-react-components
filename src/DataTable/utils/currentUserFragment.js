import { gql } from "react-apollo";

export default gql`
  fragment userLoginFragment on userLogin {
    id
    user {
      id
    }
  }
`;
