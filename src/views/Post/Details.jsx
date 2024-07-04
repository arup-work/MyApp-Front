import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import { AuthContext } from "../../contexts/AuthContext";
import '../../assets/styles/PostPage.css';
import DateFormatter from "../../components/DateFormatter";
import CommentList from "../../components/Post/CommentList";
import { ToastContainer } from "react-toastify";
import CommentService from "../../services/CommentService";

const Details = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [viewCount, setViewCount] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

    const { auth } = useContext(AuthContext);

    const fetchPostWithComments = async () => {
        const response = await PostService.fetchPostWithComments(auth, postId);
        const data = response.data;
        setComments(data.comments);
        setPost(data.post.post);
    }

    const incrementViewCount = async () => {
        const response = await PostService.incrementViewCount(auth, postId);
        const data = response.data.viewCount;
        setViewCount(data);
    }

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!comment) {
            newErrors.comment = 'This field is required';
        }else if(comment.length < 15) {
            newErrors.comment = 'Comment must be 15 character long!'
        }else if(comment.length > 255){
            newErrors.comment = 'Maximum character limit is 255!'
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await CommentService.store(auth, postId, {comment});
            if (response.data) {
                setComment('');
            }
        }
    }

    const stateMessage = () => {
        if (location.state?.message) {
            if (location.state.type === 'success') {
                toast.success(location.state.message, {
                    position: 'top-right',
                    className: 'foo-bar'
                });
            } else if (location.state.type === 'error') {
                toast.error(location.state.message, {
                    position: 'top-right',
                    className: 'foo-bar'
                });
            }

            // Clear the message from the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }

    useEffect(() => {
        fetchPostWithComments();
        incrementViewCount();
        stateMessage();
    }, [location.state, postId, comment])

    useEffect(() => {

    }, [comments])

    return (
        <div className="container">
            <ToastContainer />
            <div className="row justify-content-center mt-5">
                <div className="col-8">
                    <div className="card post">
                        <div className="card-body">
                            <h1 className="post-title">{post.title} </h1>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-4">
                                            <span className="text-muted">Published: </span>
                                            <DateFormatter date={post.createdAt}></DateFormatter>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted">Modified: </span>
                                            <DateFormatter date={post.updatedAt}></DateFormatter>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted">Viewed: </span>
                                            {viewCount} times
                                        </div>
                                    </div>
                                </div>
                                <div className="post-mg mt-2">
                                    <img src={post.image} alt="image" className="full-width-height" />
                                </div>
                                <div className="post-description mb-2">
                                    {post.description}
                                </div>
                                <div className="comments-section mt-2">
                                    <h4 className="comments-count mb-4">Your Comments</h4>
                                    <form onSubmit={handleAddComment}>
                                        <div>
                                            <textarea name="comment" id="comment" cols={5} className="form-control" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                            { errors.comment && <span className="text-danger">{errors.comment}</span>}
                                        </div>
                                        <div className="float-end">
                                            <button type="submit" className="btn btn-primary mt-2">Add comment</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="comments-section mt-2">
                                    <h4 className="comments-count mb-4">{comments.length} Comments</h4>
                                    <CommentList comments={comments} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details;