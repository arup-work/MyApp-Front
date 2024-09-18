import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentService from "../../services/CommentService";
import { addComment } from "../../redux/thunks/commentsThunks";

const ReplyComment = ({ comment, onCancel, onAddReply }) => {
    const dispatch = useDispatch();
    const [replyText, setReplyText] = useState('');
    const [errors, setErrors] = useState({});
    const textRef = useRef(null);


    const { auth } = useSelector(state => state.auth);

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
                dispatch(addComment({
                    auth,
                    postId: comment.postId,
                    comment: replyText,
                    parentCommentId: comment._id

                }));
                onCancel();
                setReplyText('');
                onAddReply(comment._id);
            } catch (error) {
                setErrors('An error occurred. Please try again later.');
            }
        }
    }



    useEffect(() => {
        if (comment && comment.userId && comment.userId.name) {
            setReplyText(`@${comment.userId.name} `);
        }
    }, [comment]);


    const handleInput = (e) => {
        setReplyText(e.target.innerText);
    };

    useEffect(() => {
        if (textRef.current && comment.userId.name) {
            const userNameSpan = `<span style="color: blue;">@${comment.userId.name}</span>&nbsp;`;
            textRef.current.innerHTML = userNameSpan;  // Inject styled username
        }
    }, [textRef, comment]);

    return (
        <div className="comment-reply-box mt-2">
            <div className="comment-avatar">
                <img src="/assets/images/avatar.png" alt="Avatar" className="rounded-circle" />
            </div>
            <div className="reply-content">
                <div
                    ref={textRef}
                    contentEditable
                    className="reply-textarea"
                    onInput={handleInput}
                ></div>
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