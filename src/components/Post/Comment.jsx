import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import DateFormatter from "../DateFormatter";
import CommentService from "../../services/CommentService";
import ReplyComment from "./ReplyComment";
import { updateComment } from "../../redux/thunks/commentsThunks";

/**
 * Comment component to display a comment and its replies
 * @param {Object} props - The properties passed to the component
 * @param {Object} props.comment - The comment object
 * @param {Function} props.onReplyAdded - The function to call when a reply is added
 * @returns {JSX.Element} The Comment component
 */
const Comment = ({ comment, onReplyAdded }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [replies, setReplies] = useState([]);
  const [expandedReplies, setExpendedReplies] = useState(false);
  const [expandedNestedReplies, setExpendedNestedReplies] = useState(false);
  const [childrenCount, setChildrenCount] = useState(
    comment.childrenCount || 0
  ); // State variable to track the number of children comments

  const [activeCommentId, setActiveCommentId] = useState(null); // State variable to track the active comment to display the reply box

  const [editMode, setEditMode] = useState(false); // State variable to track the edit mode
  const [editText, setEditText] = useState(""); // State variable to track the edited text

  const { auth } = useSelector((state) => state.auth); // Auth object from the Redux store

  /**
   * Handles the reply action for a comment
   * @param {string} commentId - The ID of the comment
   * @param {boolean} isNested - Flag indicating if the comment is nested
   */
  const handleReplies = async (commentId, isNested = false) => {
    // Toggle the visibility of the nested replies
    if (isNested) {
      setExpendedNestedReplies((prevState) => !prevState);
    } else {
      setExpendedReplies((prevState) => !prevState);
    }

    // Fetch the children comments if the replies are not expanded
    if (!expandedReplies) {
      const response = await CommentService.fetchComment(auth, commentId);
      if (response.data.comment.children) {
        const { children } = response.data.comment;
        setReplies(children);

        // Directly handle updates using fetched children data
        handleUpdateComment(commentId, children); // Pass children to the update function
      }
    }
  };

  /**
   * Handles the reply click action for a comment
   * @param {string} commentId - The ID of the comment
   */
  const handleReplyClick = (commentId) => {
    // Toggle the active comment ID to display the reply box
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  /**
   * Handles the close action for a comment
   * @param {string} commentId - The ID of the comment
   */
  const handleClose = (commentId) => {
    setActiveCommentId(commentId);
  };

  /**
   * Handles the reply action for a comment. Fetches the children comments,
   * expands the replies, increments the children count and calls the onReplyAdded function.
   * @param {string} commentId - The ID of the comment
   * @returns {Promise<void>}
   */
  const handleAddReply = async (commentId) => {
    const response = await CommentService.fetchComment(auth, commentId);
    if (response.data.comment.children) {
      const { children } = response.data.comment;
      setReplies(children);
    }
    setExpendedReplies(true); // Ensure the replies are expanded to show the new reply
    setChildrenCount((prevCount) => prevCount + 1); // Increment the children count
    onReplyAdded();
  };

  const handleEditClick = (commentId, commentText) => {
    setEditMode(commentId);
    setEditText(commentText);
  }

  const handleCancelEdit = () => {
    setEditMode(null);
  }

  // Validate the form
  const validateForm = (comment) => {
    const newErrors = {};
    if (!comment) {
      newErrors.comment = 'This field is required';
    }
    else if (comment.length < 15) {
      newErrors.comment = 'Comment must be 15 character long';
    }
    else if (comment.length > 255) {
      newErrors.comment = 'Comment must be within 255 character';
    }
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }

  const handleUpdateComment = async (commentId) => {
    if (validateForm(editText)) {
      await dispatch(updateComment({ auth, commentId, comment: editText }));
      console.log("Replies before fetch or update:", replies);

      // Re-fetch the updated child comment after update if currently viewing replies
      const updatedResponse = await CommentService.fetchComment(auth, commentId);
      if (updatedResponse.data.comment) {
        const updatedComment = updatedResponse.data.comment;

        // Check if the comment is a child comment by checking if it has a parentCommentId
        if (updatedComment.parentCommentId) {
          // Update local replies state only if replies have been fetched and are not empty
          setReplies((prevReplies) => {
            // Ensure replies are not empty before trying to update them
            console.log(prevReplies);

            if (prevReplies.length > 0) {
              console.log("hii");

              return prevReplies.map((reply) =>
                reply._id === updatedComment._id ? updatedComment : reply
              );
            }
            // If replies are empty, fetch and set the replies
            return prevReplies;
          });
        }
      }

      setEditMode(null);
    }
  };

  return (
    <div style={{ marginLeft: comment.parentCommentId ? "20px" : "0px" }}>
      <div className="comment-box">
        <div className="comment-avatar">
          <img
            src="/assets/images/avatar.png"
            alt="Avatar"
            className="rounded-circle"
          />
        </div>
        <div className="comment-content">
          <div>
            <strong>{comment.userName}</strong>{" "}
            <small className="text-muted">
              <DateFormatter date={comment.createdAt} />
            </small>
          </div>
          {editMode === comment._id ? <div className="reply-content">
            <textarea rows="3" placeholder="Add a public comment..." onChange={e => setEditText(e.target.value)} value={editText}></textarea>
            {errors.comment && <span className="text-danger m-2">{errors.comment}</span>}
          </div> : <>{comment.comment}</>}

          <div className="comment-actions">
            <img src="/assets/images/like.svg" alt="like" />
            <button
              className="btn btn-outline-secondary btn-sm ms-2"
              onClick={() => handleReplyClick(comment._id)}
              role="button"
            >
              Reply
            </button>
            {editMode === comment._id ?
              <div className="action-buttons">
                <div className="reply-actions">
                  <button className="btn btn-light cancel-btn" onClick={() => handleCancelEdit(comment._id, comment.comment)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary reply-btn" onClick={() => handleUpdateComment(comment._id)}>
                    Update
                  </button>
                </div>
              </div>
              : <>{auth.user.id == comment.userId._id && (
                <div className="action-buttons">
                  <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditClick(comment._id, comment.comment)} role="button" />
                  <FontAwesomeIcon icon={faTrashAlt} className="ms-2 delete-icon" role="button" />
                </div>
              )}</>}
          </div>

          {comment._id === activeCommentId && (
            <ReplyComment
              comment={comment}
              onCancel={() => handleClose()}
              onAddReply={handleAddReply}
            />
          )}
          {childrenCount > 0 && (
            <>
              <div className="comment-replies mt-3">
                <span onClick={() => handleReplies(comment._id)}>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    role="button"
                    className="ms-2 me-2"
                  />
                  {childrenCount} {childrenCount == 1 ? "reply" : "replies"}
                </span>
              </div>
            </>
          )}
          {comment.children && comment.children.length > 0 && (
            <>
              <div className="comment-replies mt-3">
                <span onClick={() => handleReplies(comment._id)}>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    role="button"
                    className="ms-2 me-2"
                  />
                  {comment.children.length}{" "}
                  {comment.children.length == 1 ? "reply" : "replies"}
                </span>
              </div>
            </>
          )}
          {expandedNestedReplies &&
            comment.children &&
            comment.children.length > 0 && (
              <div className="expender-contents mt-3">
                {comment.children.map((child) => (
                  <Comment key={child._id} comment={child} />
                ))}
              </div>
            )}
          {expandedReplies && (
            <div className="expender-contents mt-3">
              {replies.map((reply) => (
                <Comment key={reply._id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
