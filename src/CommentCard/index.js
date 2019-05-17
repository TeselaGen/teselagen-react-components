/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React, { Component } from "react";
import { compose } from "redux";
import CollapsibleCard from "../CollapsibleCard";
import withQuery from "../enhancers/withQuery";
import Loading from "../Loading";
import CommentWithReplies from "./CommentWithReplies";
import commentFragment from "./commentFragment";
import AddComment from "./AddComment";
import "./style.css";

class CommentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: null
    };
  }

  startReply = commentId => {
    this.setState({
      isReplying: commentId
    });
  };

  cancelReply = () => {
    this.setState({
      isReplying: null
    });
  };

  render() {
    const {
      comments = [],
      commentsLoading,
      refetch: maybeRefetch,
      refetchComments,
      currentUser,
      record,
      noCard
    } = this.props;

    const refetch = refetchComments || maybeRefetch;
    const inner = (
      <div>
        <div
          id="tg-comment-list"
          style={{
            maxHeight: 300,
            overflow: "auto",
            marginBottom: 15,
            padding: 10
          }}
        >
          <Loading inDialog loading={commentsLoading} withTimeout>
            {comments.length === 0 && "No comments yet. Add one!"}
            {comments.map(comment => (
              <div key={comment.id} className="comment-with-replies-container">
                <CommentWithReplies
                  key={comment.id}
                  {...{
                    comment,
                    currentUser,
                    startReply: this.startReply,
                    cancelReply: this.cancelReply,
                    isReplying: this.state.isReplying,
                    refetch,
                    record
                  }}
                />
              </div>
            ))}
          </Loading>
        </div>

        <AddComment
          {...this.props}
          record={record}
          currentUser={currentUser}
          label="Add a comment"
          placeholder="Add a comment..."
          refetch={() => {
            refetch().then(() => {
              const element = document.getElementById("tg-comment-list");
              if (element) {
                element.scrollTop = element.scrollHeight;
              }
            });
          }}
        />
      </div>
    );
    if (noCard) return inner;
    else
      return (
        <CollapsibleCard title="Comments" icon="comment">
          {inner}
        </CollapsibleCard>
      );
  }
}

export default compose(
  withQuery(commentFragment, {
    isPlural: true,
    skip: props => !props.joinTableName,
    options: props => {
      const { record, joinTableName } = props;
      return {
        variables: {
          filter: {
            [`${joinTableName}.${record.__typename + "Id"}`]: record.id
          }
        }
      };
    }
  })
)(CommentCard);
