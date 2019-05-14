/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import gql from "graphql-tag";
import userFragment from "./userFragment";

export default gql`
  fragment commentFragment on comment {
    id
    message
    commentReplies {
      reply {
        id
        message
        createdAt
        updatedAt
        user {
          ...userFragment
        }
      }
    }
    user {
      ...userFragment
    }
    createdAt
    updatedAt
  }
  ${userFragment}
`;
