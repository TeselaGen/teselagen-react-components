/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { Component } from "react";
import { Icon } from "@blueprintjs/core";
import CommentBubble from "../CommentBubbleContainer";
import "./style.css";

export class CommentReply extends Component {
  startCommentReply = () => {
    const { reply, startReply } = this.props;

    return startReply(reply.id);
  };

  render() {
    const {
      comment,
      record,
      cancelReply,
      reply,
      isReplying,
      refetch,
      currentUser
    } = this.props;

    return (
      <CommentBubble
        isReply
        parentId={comment.id}
        record={record}
        startReply={this.startCommentReply}
        cancelReply={cancelReply}
        isReplying={reply.id === isReplying}
        refetch={refetch}
        key={reply.id}
        currentUser={currentUser}
        comment={reply}
      />
    );
  }
}

class CommentWithReplies extends Component {
  state = {
    showingMore: false
  };

  startReply = () => {
    this.props.startReply(this.props.comment.id);
  };

  toggleShowMore = () =>
    this.setState({ showingMore: !this.state.showingMore });

  render() {
    const { showingMore } = this.state;
    const {
      comment,
      refetch,
      currentUser,
      startReply,
      cancelReply,
      isReplying,
      record
    } = this.props;

    let repliesToShow = comment.commentReplies;
    if (!showingMore && comment.commentReplies.length > 2) {
      repliesToShow = comment.commentReplies.slice(
        comment.commentReplies.length - 3,
        comment.commentReplies.length
      );
    }
    return (
      <div>
        <CommentBubble
          record={record}
          refetch={refetch}
          key={comment.id}
          isReplying={comment.id === isReplying}
          startReply={this.startReply}
          cancelReply={cancelReply}
          currentUser={currentUser}
          comment={comment}
        />
        {comment.commentReplies.length > 3 && (
          <div className="show-more-comments-btn" onClick={this.toggleShowMore}>
            {showingMore
              ? "Hide Replies "
              : "View all " + comment.commentReplies.length + " replies "}
            <Icon icon={`chevron-${showingMore ? "up" : "down"}`} />
          </div>
        )}
        {repliesToShow.map(({ reply }: { reply: Object }) => {
          return (
            <CommentBubble
              isReply
              parentId={comment.id}
              record={record}
              startReply={() => startReply(reply.id)}
              cancelReply={cancelReply}
              isReplying={reply.id === isReplying}
              refetch={refetch}
              key={reply.id}
              currentUser={currentUser}
              comment={reply}
            />
          );
        })}
      </div>
    );
  }
}

export default CommentWithReplies;
