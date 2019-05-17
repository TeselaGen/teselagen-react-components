/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import gql from "graphql-tag";

export default gql`
  fragment userFragment on user {
    id
    firstName
    lastName
    username
    email
    createdAt
  }
`;
