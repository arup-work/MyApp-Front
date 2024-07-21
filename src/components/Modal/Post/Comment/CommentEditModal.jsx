import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import CommentService from "../../../../services/CommentService";
import { useSelector } from "react-redux";

const CommentEditModal = ({ show, handleClose, commentDetails }) => {
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // const { auth } = useContext(AuthContext);
    const { auth } = useSelector(state => state.auth);

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!comment) {
            newErrors.comment = 'This field is required';
        } else if (comment.length < 6) {
            newErrors.comment = 'Comment should be 6 character long!';
        } else if (comment.length > 255) {
            newErrors.comment = 'Maximum character limit is 255';
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Handle the form
    const handleUpdateComment = async (e) => {
        e.preventDefault();
        const postId = commentDetails.postId;
        if (validateForm()) {
            try {
                const response = await CommentService.updateComment(auth, comment, commentDetails._id);
                const data = response.data;
                if (data) {
                    navigate(`/post/${postId}`, {
                        state: {
                            message: data.message, type: 'success'
                        }
                    });
                    handleClose();
                    setComment('');
                }
            } catch (error) {
                setErrors('An error occurred. Please try again later.');
            }
        }
    }

    useEffect(() => {
        if (commentDetails) {
            setComment(commentDetails.comment);
        }
    }, [commentDetails]);
    return (
        <div>
            <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Comment</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {/* Example input fields */}
                                <div className="form-group">
                                    <label htmlFor="commentText">Comment</label>
                                    <textarea
                                        className="form-control"
                                        id="commentText"
                                        rows="3"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    ></textarea>
                                    {errors.comment && <span className="text-danger">{errors.comment}</span>}
                                </div>
                                <div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateComment}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}

export default CommentEditModal;
