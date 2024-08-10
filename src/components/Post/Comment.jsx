import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import DateFormatter from "../DateFormatter";
import CommentService from "../../services/CommentService";


const Comment = ({ comment }) => {
    const [replies, setReplies] = useState([]);
    const [childReplies, setChildReplies] = useState([]);
    const [replyExpend, setRelyExpend] = useState(false);
    const { auth } = useSelector(state => state.auth);

    // Handle replies
    const handleReplies = async (commentId) => {
        setRelyExpend(prevState => !prevState);
        const response = await CommentService.fetchComment(auth, commentId);
        const { children } = response.data.comment;
        setChildReplies(children);
        setReplies(children);
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
                        <button className="btn btn-outline-secondary btn-sm ms-2" onClick={(e) => edit(comment._id, true)} role="button">Reply</button>
                    </div>
                    {comment.childrenCount > 0 && <>
                        <div className="comment-replies mt-3">
                            <span onClick={() => handleReplies(comment._id)}>
                                <FontAwesomeIcon icon={faChevronDown} role="button" className="ms-2 me-2" />
                                {comment.childrenCount} {comment.childrenCount == 1 ? 'reply' : 'replies'}
                            </span>
                        </div>
                    </>}
                    {replyExpend && <div className="expender-contents mt-3">
                        {replies.map(reply => (
                            <Comment key={reply._id} comment={reply} />
                        ))}
                    </div>}
                    {/* {childReplies.length > 0 && <>
                        <div className="comment-replies mt-3 m-5">
                            <span onClick={() => handleReplies(comment._id)}>
                                <FontAwesomeIcon icon={faChevronDown} role="button" className="ms-2 me-2" />
                                {comment.childrenCount} {comment.childrenCount == 1 ? 'reply' : 'replies'}
                            </span>
                        </div>
                    </>} */}

                </div>

            </div>
        </div>
    );
};

export default Comment;
