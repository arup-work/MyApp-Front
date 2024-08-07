import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faReply, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import DateFormatter from "../DateFormatter";
import CommentEditModal from "../Modal/Post/Comment/CommentEditModal";
import CommentService from "../../services/CommentService";
import { AuthContext } from "../../contexts/AuthContext";
import { showConfirmationModal } from "../../helpers/utils/sweetAlertUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CommentList = ({ comments }) => {
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
                <div key={comment._id} className="comment">
                    <div className="comment-body">
                        <p>{comment.comment}</p>
                        <FontAwesomeIcon icon={faReply} onClick={(e) => edit(comment._id, true)} role="button" />
                        {auth.user.id == comment.userId._id && (
                            <div className="d-flex justify-content-end mx-2">
                                <FontAwesomeIcon icon={faEdit} onClick={(e) => edit(comment._id)} role="button" />
                                <FontAwesomeIcon icon={faTrashAlt} className="ms-2" onClick={(e) => deleteComment(comment._id, comment.postId)} role="button" />
                            </div>
                        )}

                        <div className="d-flex justify-content-end">
                            <div>
                                <small>
                                    <DateFormatter date={comment.createdAt} withMinutes={true} />
                                </small>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-2">
                            <div>
                                <small className="text-primary">{comment.userName}</small>
                            </div>
                        </div>
                    </div>
                    <div className="comment-children">
                        {comment.children && comment.children.length > 0 && (
                            <CommentList comments={comment.children} />
                        )}
                    </div>

                    {comments.length !== index + 1 && <hr />}
                </div>
            ))}
            {showEditModal && <CommentEditModal show={showEditModal} handleClose={handleClose} commentDetails={commentDetails} replyMode={replyMode} />}
        </div>
    )
};

export default CommentList;