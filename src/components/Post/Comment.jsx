import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import DateFormatter from "../DateFormatter";
import CommentService from "../../services/CommentService";
import ReplyComment from "./ReplyComment";


const Comment = ({ comment }) => {
    console.log(comment);
    const [replies, setReplies] = useState([]);
    const [expandedReplies, setExpendedReplies] = useState(false);
    const [expandedNestedReplies, setExpendedNestedReplies] = useState(false);

    const [activeCommentId, setActiveCommentId] = useState(null);

    const { auth } = useSelector(state => state.auth);

    // Handle replies
    const handleReplies = async (commentId, isNested = false) => {
        if (isNested) {
            setExpendedNestedReplies(prevState => !prevState);
        } else {
            setExpendedReplies(prevState => !prevState);
        }

        if (!expandedReplies) {
            const response = await CommentService.fetchComment(auth, commentId);
            if (response.data.comment.children) {
                const { children } = response.data.comment;
                setReplies(children);
            }
        }
    }

    // Handle reply click
    const handleReplyClick = (commentId) => {
        // Toggle the reply box for the specific comment
        setActiveCommentId(activeCommentId === commentId ? null : commentId)
    }

    const handleClose = (commentId) => {
        setActiveCommentId(commentId);
        // handleReplies(commentId,true);
    }
    return (
        <div style={{ marginLeft: comment.parentCommentId ? '20px' : '0px' }}>
            <div className="comment-box">
                <div className="comment-avatar">
                    <img src="/assets/images/avatar.png" alt="Avatar" className="rounded-circle" />
                </div>
                <div className="comment-content">
                    <div>
                        <strong>{comment.userName}</strong> <small className="text-muted"><DateFormatter date={comment.createdAt} /></small>
                    </div>
                    <div>
                        {comment.comment}
                    </div>
                    <div className="comment-actions">
                        <img src="/assets/images/like.svg" alt="like" />
                        <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => handleReplyClick(comment._id)} role="button">Reply</button>
                    </div>

                    {comment._id === activeCommentId && (
                        <ReplyComment comment={comment} onCancel={() => handleClose()} />
                    )}
                    {comment.childrenCount > 0 && <>
                        <div className="comment-replies mt-3">
                            <span onClick={() => handleReplies(comment._id)}>
                                <FontAwesomeIcon icon={faChevronDown} role="button" className="ms-2 me-2" />
                                {comment.childrenCount} {comment.childrenCount == 1 ? 'reply' : 'replies'}
                            </span>
                        </div>
                    </>}
                    {comment.children && comment.children.length > 0 && <>
                        <div className="comment-replies mt-3">
                            <span onClick={() => handleReplies(comment._id)}>
                                <FontAwesomeIcon icon={faChevronDown} role="button" className="ms-2 me-2" />
                                {comment.children.length} {comment.children.length == 1 ? 'reply' : 'replies'}
                            </span>
                        </div>
                    </>}
                    {expandedNestedReplies && comment.children && comment.children.length > 0 && (
                        <div className="expender-contents mt-3">
                            {comment.children.map(child => (
                                <Comment key={child._id} comment={child} />
                            ))}
                        </div>
                    )}
                    {expandedReplies && (
                        <div className="expender-contents mt-3">
                            {replies.map(reply => (
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
