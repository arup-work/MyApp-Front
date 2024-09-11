import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEdit,
  faThumbsDown,
  faThumbsUp,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import DateFormatter from "../DateFormatter";
import CommentService from "../../services/CommentService";
import ReplyComment from "./ReplyComment";
import { updateComment, deletedComment } from "../../redux/thunks/commentsThunks";
import { showConfirmationModal } from "../../helpers/utils/sweetAlertUtils";
import { useNavigate } from "react-router-dom";

/**
 * Comment component to display a comment and its replies
 * @param {Object} props - The properties passed to the component
 * @param {Object} props.comment - The comment object
 * @returns {JSX.Element} The Comment component
 */
const Comment = ({ comment, collapseDropdown }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [replies, setReplies] = useState([]);
  const [expandedReplies, setExpendedReplies] = useState(false);
  const [childrenCount, setChildrenCount] = useState(
    comment.childrenCount || 0
  ); // State variable to track the number of children comments

  const [activeCommentId, setActiveCommentId] = useState(null); // State variable to track the active comment to display the reply box

  const [editMode, setEditMode] = useState(false); // State variable to track the edit mode
  const [editText, setEditText] = useState(""); // State variable to track the edited text

  const { auth } = useSelector((state) => state.auth); // Auth object from the Redux store

  const [commentTittle, setCommentTitle] = useState(comment?.comment || '');

  // Track whether the user has liked the comment
  const [isLiked, setIsLiked] = useState(comment.likes.includes(auth.user.id)); // Initial like state
  const [likesCount, setLikesCount] = useState(comment.likes.length); // Initialize likes count

  /**
   * Handles the reply action for a comment
   * @param {string} commentId - The ID of the comment
   * @param {boolean} isNested - Flag indicating if the comment is nested
   */
  const handleReplies = async (commentId) => {
    // Toggle the visibility of the nested replies
    setExpendedReplies((prevState) => !prevState);

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
   * expands the replies, increments the children count and calls th function.
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
      const response = await dispatch(updateComment({ auth, commentId, comment: editText }));

      setCommentTitle(response.payload.comment.comment);
      const topMostParentCommentId = response.payload.topMostParentCommentId;
      setEditMode(null);
    }
  };

  const deleteComment = async (commentId, postId) => {
    const result = await showConfirmationModal('Delete Comment', 'Are you sure you want to delete this comment?');
    if (result.isConfirmed) {
      try {
        // Dispatch delete action
        const response = await dispatch(deletedComment({ auth, commentId }));
        const updatedComment = response.payload.comment;

        // If it's a reply, remove it from the replies list

        if (updatedComment.parentCommentId) {
          setExpendedReplies(false);
        } else {
          // Navigate to another route or modify the reduxComments in parent
          navigate(`/post/${postId}`, {
            state: {
              message: 'Comment deleted successfully',
              type: 'success'
            }
          });
        }
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
    if (collapseDropdown) {
      collapseDropdown();
    }
  };

  const collapseDropdownClick = () => {
    setExpendedReplies(false);
    setChildrenCount((prevCount) => prevCount - 1);
  }

  const handleLikeComment = async (commentId) => {
      await CommentService.likeComment(auth, commentId);
      if (isLiked) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
   
  }


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
          </div> : <>{commentTittle}</>}

          <div className="comment-actions">
            <a onClick={() => handleLikeComment(comment._id)}>
              {isLiked ? (
                <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
              ) : (
                <img src="/assets/images/like.svg" alt="like" />
              )}
            </a>
            <span>{likesCount > 0 && likesCount}</span>

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
                  <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditClick(comment._id, commentTittle)} role="button" />
                  <FontAwesomeIcon icon={faTrashAlt} className="ms-2 delete-icon" role="button" onClick={() => deleteComment(comment._id, comment.postId)} />
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
          {expandedReplies && (
            <div className="expender-contents mt-3">
              {replies.map((reply) => (
                <Comment key={reply._id} comment={reply} collapseDropdown={collapseDropdownClick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
