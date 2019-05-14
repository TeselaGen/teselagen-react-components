/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import { withDelete, withUpsert } from "@teselagen/apollo-methods";

import { compose } from "react-apollo";
import CommentBubble from "../CommentBubble";
import commentFragment from "../commentFragment";

export default compose(
  withDelete("comment"),
  withUpsert(commentFragment)
)(CommentBubble);
