/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { Component } from "react";
import "./style.css";
import moment from "moment";
import {
  Menu,
  MenuItem,
  Popover,
  Position,
  Intent,
  Button,
  Classes
} from "@blueprintjs/core";
import { TextareaField } from "../../FormComponents";
import { reduxForm } from "redux-form";
import AvatarIcon from "../../AvatarIcon";
import AddCommentReplyContainer from "../AddCommentReplyContainer";
export const COMMENT_REPLY_MARGIN_LEFT = 42;

class Comment extends Component {
  state = {
    isEditing: false
  };

  toggleEditor = () => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  };

  onSubmitEdit = values => {
    const { comment, upsertComment } = this.props;
    let data = { ...values, id: comment.id };
    upsertComment(data)
      .then(this.toggleEditor)
      .catch(err => {
        window.toastr.error("Error updating comment.");
        console.error("err:", err);
      });
  };

  renderEditor() {
    const { handleSubmit, comment } = this.props;

    return (
      <form className="comment-edit-form">
        <TextareaField name="message" defaultValue={comment.message} />
        <div className="comment-button-container">
          <Button
            intent={Intent.DANGER}
            text="Cancel"
            className={Classes.SMALL + " " + Classes.MINIMAL}
            onClick={this.toggleEditor}
          />
          <Button
            intent={Intent.SUCCESS}
            text="Save"
            className={Classes.SMALL + " " + Classes.MINIMAL}
            onClick={handleSubmit(this.onSubmitEdit)}
          />
        </div>
      </form>
    );
  }

  handleDelete = () => {
    const {
      comment: { id },
      refetch,
      deleteEntities
    } = this.props;
    return deleteEntities(id).then(() => {
      refetch();
    });
  };

  render() {
    const { isEditing } = this.state;
    const {
      refetch,
      customerRequestId,
      currentUser,
      isReplying,
      startReply,
      cancelReply,
      isReply,
      parentId,
      comment: { id, message, createdAt, updatedAt, user }
    } = this.props;

    const commentMenu = (
      <Menu className="comment-edit-menu">
        <MenuItem text="Edit" onClick={this.toggleEditor} />
        <MenuItem text="Delete" onClick={this.handleDelete} />
      </Menu>
    );

    return (
      <React.Fragment>
        <div
          className={"comment-bubble-container" + (isReply ? " reply" : "")}
          style={{
            marginLeft: isReply ? COMMENT_REPLY_MARGIN_LEFT : 0
          }}
        >
          {user.id === currentUser.userId && !isEditing && (
            <div className="comment-edit-menu">
              <Popover content={commentMenu} position={Position.LEFT}>
                <Button className={Classes.MINIMAL} icon="more" />
              </Popover>
            </div>
          )}
          <div className="comment-avatar">
            <AvatarIcon
              size={isReply ? 28 : 36}
              style={{ border: "2px solid white" }}
              user={user}
            />
          </div>
          {isEditing ? (
            this.renderEditor()
          ) : (
            <div style={{ width: "90%" }}>
              <div className="comment-bubble-header">
                <div className="comment-bubble-username">{user.username}</div>
                <div className="comment-bubble-date">
                  {moment(createdAt).fromNow()}
                  {createdAt !== updatedAt && ` (edited)`}
                </div>
              </div>
              <div className="comment-bubble-message">{message}</div>
              <div className="comment-bubble-reply-button" onClick={startReply}>
                Reply
              </div>
            </div>
          )}
        </div>
        {isReplying && (
          <div
            className="comment-bubble-container reply"
            style={{ marginLeft: COMMENT_REPLY_MARGIN_LEFT }}
          >
            <AddCommentReplyContainer
              {...{
                refetch,
                cancelReply,
                currentUser,
                isReplyForm: true,
                customerRequestId,
                placeholder: "Enter reply...",
                commentId: parentId || id
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default reduxForm({
  form: "editCommentForm"
})(Comment);
