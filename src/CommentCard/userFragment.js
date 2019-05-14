/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import gql from "graphql-tag";
export default gql`
  fragment userFragment on user {
    id
    avatarFile {
      id
      path
    }
    avatarFileId
    firstName
    lastName
    username
    email
    phoneNumber
    createdAt
  }
`;
