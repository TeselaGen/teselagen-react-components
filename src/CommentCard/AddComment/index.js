/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { PureComponent } from "react";
import { reduxForm } from "redux-form";
import { Button, Intent, Classes } from "@blueprintjs/core";
import scrollIntoView from "dom-scroll-into-view";
import classNames from "classnames";
import { compose } from "redux";
import { withUpsert } from "@teselagen/apollo-methods";
import AvatarIcon from "../../AvatarIcon";
import { TextareaField } from "../../FormComponents";
import { validateRequiredFieldsGenerator } from "../utils";
import "./style.css";

export class AddComment extends PureComponent {
  componentDidMount() {
    if (this.props.isReplyForm) {
      // scroll so the form is showing fully
      const commentList = document.getElementById("tg-comment-list");
      const cancelButton = document.getElementById(
        "reply-to-comment-cancel-button"
      );
      if (commentList && cancelButton) {
        scrollIntoView(cancelButton, commentList, {
          onlyScrollIfNeeded: true
        });
      }
    }
  }

  onSubmit = async formData => {
    const {
      reset,
      refetch,
      record: { id, __typename } = {},
      commentId,
      cancelReply,
      upsertComment,
      currentUser
    } = this.props;

    const data = { ...formData };

    data.userId = currentUser.user ? currentUser.user.id : currentUser.id;

    if (commentId) {
      data.commentReply = {
        commentId
      };
    } else {
      data[__typename + "Comment"] = {
        [__typename + "Id"]: id
      };
    }

    try {
      await upsertComment(data);
      await refetch();
      reset();
      cancelReply && cancelReply();
    } catch (error) {
      console.error(error);
      window.toastr.error("Error creating comment");
    }
  };

  cancelReply = () => {
    this.props.cancelReply();
  };

  render() {
    const {
      currentUser,
      handleSubmit,
      label,
      placeholder,
      isReplyForm,
      submitting
    } = this.props;

    return (
      <form
        className={classNames("add-comment-form", { reply: isReplyForm })}
        onSubmit={handleSubmit(this.onSubmit)}
      >
        <div className="tg-flex width100">
          {isReplyForm && (
            <div className="comment-avatar">
              <AvatarIcon
                size={isReplyForm ? 28 : 36}
                style={{ border: "2px solid white" }}
                user={currentUser}
              />
            </div>
          )}
          <TextareaField
            data-test={`tg-${isReplyForm ? "reply" : "comment"}-message`}
            name="message"
            label={label}
            placeholder={placeholder}
          />
        </div>
        <div className="tg-flex justify-flex-end">
          {isReplyForm && (
            <Button
              style={{ marginRight: 10 }}
              id="reply-to-comment-cancel-button"
              className={Classes.SMALL + " " + Classes.MINIMAL}
              onClick={this.cancelReply}
              intent={Intent.DANGER}
              text="Cancel"
            />
          )}
          <Button
            data-test={`tg-submit-${isReplyForm ? "reply" : "comment"}`}
            style={{ marginRight: isReplyForm ? 15 : 0 }}
            className={Classes.SMALL + " " + Classes.MINIMAL}
            intent={Intent.SUCCESS}
            loading={submitting}
            text="Submit"
            type="submit"
          />
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: "AddCommentForm",
    validate: validateRequiredFieldsGenerator(["message"])
  }),
  withUpsert("comment")
)(AddComment);
