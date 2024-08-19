import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faReply, faThumbsUp, faCartArrowDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import DateFormatter from "../DateFormatter";
import CommentEditModal from "../Modal/Post/Comment/CommentEditModal";
import CommentService from "../../services/CommentService";
import { AuthContext } from "../../contexts/AuthContext";
import { showConfirmationModal } from "../../helpers/utils/sweetAlertUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import Pagination from "../Pagination";

const CommentList = ({ comments, onReplyAdded }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [showEditModal, setShowEditModal] = useState(false);
    const [commentDetails, setCommentDetails] = useState([]);
    const [replyMode, setReplyMode] = useState(false);


    const { auth } = useSelector(state => state.auth);

    const edit = async (commentId, isReplyModeEnable = false) => {
        const response = await CommentService.fetchComment(auth, commentId);
        const comment = response.data.comment;
        if (comment) {
            setCommentDetails(comment);
        }
        setReplyMode(isReplyModeEnable);
        setShowEditModal(true);
    }

    const deleteComment = async (commentId, postId) => {
        const result = await showConfirmationModal('Delete Comment', 'Are you sure you want to delete this comment?');
        if (result.isConfirmed) {
            try {
                const response = await CommentService.deleteComment(auth, commentId);
                if (response.data) {
                    navigate(`/post/${postId}`, {
                        state: {
                            message: 'Comment deleted successfully',
                            type: 'success'
                        }
                    })
                }
            } catch (error) {

            }
        }

    }

    const handleClose = () => {
        setShowEditModal(false);
    }

    useEffect(() => {

    }, [comments]);
    return (
        <div>
            {comments.length == 0 && (
                <div>
                    No comment found
                </div>
            )}
            {comments.map((comment, index) => (
                <div key={comment._id} className="comment mt-2">
                    {/* <div className="row">
                        <div className="col-1">
                            <div className="author-thumbnail">
                                <img src="/assets/images/account.png" alt="profile" className="author-thumbnail" />
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="comment-body">
                                <div className="row">
                                    <div className="col-6">
                                        <span className="text-primary">{comment.userName}</span>
                                        <small> <DateFormatter date={comment.createdAt} /></small>
                                    </div>
                                </div>
                                <p>{comment.comment}</p>

                            </div>
                        </div>
                        <div className="col-3">
                            {auth.user.id == comment.userId._id && (
                                <div className="d-flex justify-content-end mx-2">
                                    <FontAwesomeIcon icon={faEdit} onClick={(e) => edit(comment._id)} role="button" />
                                    <FontAwesomeIcon icon={faTrashAlt} className="ms-2" onClick={(e) => deleteComment(comment._id, comment.postId)} role="button" />
                                </div>
                            )}
                        </div>
                        <div className="action-buttons">
                        <FontAwesomeIcon icon={faReply} onClick={(e) => edit(comment._id, true)} role="button" />
                        </div>
                    </div> */}


                    {/* <div className="comment-box">
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
                            {replyExpend &&  <div className="expender-contents">
                                dddd
                            </div>}

                        </div>

                    </div> */}
                    <Comment key={comment._id} comment={comment} onReplyAdded={onReplyAdded}/>
                    {comments.length !== index + 1 && <hr />}
                </div>
            ))}
            
            {showEditModal && <CommentEditModal show={showEditModal} handleClose={handleClose} commentDetails={commentDetails} replyMode={replyMode} />}
        </div>
    )
};

export default CommentList;