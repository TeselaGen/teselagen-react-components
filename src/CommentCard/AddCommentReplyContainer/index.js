/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import { compose } from "react-apollo";
import { reduxForm } from "redux-form";
import { withUpsert } from "@teselagen/apollo-methods";
import { AddComment } from "../AddComment";
import commentFragment from "../commentFragment";
import { validateRequiredFieldsGenerator } from "../utils";

export default compose(
  reduxForm({
    form: "addCommentReply",
    validate: validateRequiredFieldsGenerator(["message"])
  }),
  withUpsert(commentFragment)
)(AddComment);
