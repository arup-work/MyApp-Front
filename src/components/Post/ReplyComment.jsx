import React, { useState } from "react";
import { useSelector } from "react-redux";
import CommentService from "../../services/CommentService";

const ReplyComment = ({ comment, onCancel, onAddReply }) => {
    const [replyText, setReplyText] = useState('');
    const [errors, setErrors] = useState({});

    const {auth} = useSelector(state => state.auth);

    // Clear the text area and close the section
    const handleClearReply = () => {
        setReplyText('');
        onCancel();
    }
    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!replyText) {
            newErrors.replyText = 'This field is required';
        } else if (replyText.length < 6) {
            newErrors.replyText = 'Comment should be 6 character long!';
        } else if (replyText.length > 255) {
            newErrors.replyText = 'Maximum character limit is 255';
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Handle reply comment
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await CommentService.store(auth, comment.postId, { comment: replyText, parentCommentId: comment._id });
                const data = response.data;
                // Pass the new reply data to the parent component
                onAddReply(data.comment);
                if (data) {
                    onCancel();
                    setReplyText('');
                }
            } catch (error) {
                setErrors('An error occurred. Please try again later.');
            }
        }
    }
    return (
        <div className="comment-reply-box mt-2">
            <div className="comment-avatar">
                <img src="/assets/images/avatar.png" alt="Avatar" className="rounded-circle" />
            </div>
            <div className="reply-content">
                <textarea rows="3" placeholder="Add a public comment..." onChange={e => setReplyText(e.target.value)} value={replyText}></textarea>
                {errors.replyText && <span className="text-danger m-2">{errors.replyText}</span>}
                <div className="reply-actions">
                    <button className="btn btn-light cancel-btn" onClick={handleClearReply}>
                        Cancel
                    </button>
                    <button className="btn btn-primary reply-btn" onClick={handleReplySubmit}>
                        Reply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReplyComment;