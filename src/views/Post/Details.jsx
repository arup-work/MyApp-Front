import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { addFavoritePost, removeFavoritePost } from "../../redux/thunks/favoriteThunks";
import PostService from "../../services/PostService";
import '../../assets/styles/PostPage.css';
import DateFormatter from "../../components/DateFormatter";
import CommentList from "../../components/Post/CommentList.jsx";
import CommentService from "../../services/CommentService";
import Pagination from "../../components/Pagination";
import { addComment, fetchComments } from "../../redux/thunks/commentsThunks.js";
import { setCurrentPage } from "../../redux/slices/commentSlice.js";


const Details = () => {
    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();

    const { postId } = useParams();

    const [viewCount, setViewCount] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

    const [postsPerPage] = useState(5);
    const [searchedComment, setSearchComment] = useState('');

    // const { auth } = useContext(AuthContext);
    const { auth } = useSelector(state => state.auth);

    // From redux
    const {reduxPost, 
        reduxComments, 
        reduxCurrentPage, 
        reduxTotalComments , 
        reduxTotalPages
    } = useSelector(state => state.comments);

    const favoritePosts = useSelector((state) => state.favorites.favoritePosts) || [];
    const isFavorite = favoritePosts.some((favPost) => favPost === reduxPost._id);


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
        } else if (comment.length < 15) {
            newErrors.comment = 'Comment must be 15 character long!'
        } else if (comment.length > 255) {
            newErrors.comment = 'Maximum character limit is 255!'
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(addComment({ auth, postId, comment }))
            setComment('');
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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= reduxTotalPages) {
            dispatch(setCurrentPage(page));
        }
    }

    // For searching
    const handleInputChange = (value) => {
        setSearchComment(value);
        handleSearch(value);
    }
    const handleSearch = (searchKey) => {
        dispatch(fetchComments({auth, postId, reduxCurrentPage, postsPerPage, searchKey}))
    }

    const clearSearch = () => {
        setSearchComment('');
        handleSearch('');
    }

    // Handle favorite post
    const handleFavoritePost = async () => {
        // const response = await UserService.addFavoritePost(auth, postId);
        if (!isFavorite) {
            dispatch(addFavoritePost({ auth, postId }));
        } else {
            dispatch(removeFavoritePost({ auth, postId }))
        }
    }

    // Handle reply comment count
    const handleReplyAdded = () => {
        setTotalComments(prevCount => prevCount + 1);
    };

    useEffect(() => {
        incrementViewCount();
        stateMessage();
    }, [location.state, location.pathname, navigate, postId, reduxCurrentPage, postsPerPage])

    useEffect((searchKey = '') => {
        dispatch(fetchComments({auth, postId, reduxCurrentPage, postsPerPage, searchKey}))
    },[reduxCurrentPage])

    useEffect(() => {

    }, [reduxComments,reduxTotalPages])

    return (
        <div>
            <ToastContainer />
            <div className="row justify-content-start ms-4">
                <div className="col-9">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link as={Link} to="/post" className="text-decoration-none">Posts</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{reduxPost.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row justify-content-start mt-2 ms-4">
                <div className="col-9">
                    <div className="card post">
                        <div className="card-body">
                            <h1 className="post-title">
                                <span>{isFavorite ? <img src="/assets/images/star.svg" alt="" onClick={handleFavoritePost} className="favorite-img" /> : <img src="/assets/images/black_star.svg" alt="" onClick={handleFavoritePost} className="favorite-img" />}</span>
                                <span>{reduxPost.title}</span>
                            </h1>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-4">
                                            <span className="text-muted">Published: </span>
                                            <DateFormatter date={reduxPost.createdAt}></DateFormatter>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted">Modified: </span>
                                            <DateFormatter date={reduxPost.modifiedAt}></DateFormatter>
                                        </div>
                                        <div className="col-4">
                                            <span className="text-muted">Viewed: </span>
                                            {viewCount} times
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-2" />
                                <div className="post-mg mt-2">
                                    <div className="image-container">
                                        <img src={reduxPost.image} alt="image" className="post-img" />
                                    </div>
                                </div>

                                <div className="post-description mx-2 my-3">
                                    <b className="text-muted">Description </b><br />
                                    {reduxPost.description}
                                </div>
                                <div className="comments-section mt-2">
                                    <h4 className="comments-count mb-4">Your Comments</h4>
                                    <form onSubmit={handleAddComment}>
                                        <div>
                                            <textarea name="comment" id="comment" cols={5} className="form-control" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                            {errors.comment && <span className="text-danger">{errors.comment}</span>}
                                        </div>
                                        <div className="float-end">
                                            <button type="submit" className="btn btn-primary mt-2">Add comment</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="comments-section mt-2">
                                    <div className="row">
                                        <div className="col-8">
                                            <h4 className="comments-count mb-4">{reduxTotalComments} Comments</h4>
                                        </div>
                                        <div className="col-4 head_search">

                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchedComment}
                                                    onChange={e => handleInputChange(e.target.value)}
                                                    className="head_search bg-sidebar_bg text-textColorBlack bg-gray-50 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2 me-2"
                                                />
                                                {searchedComment !== '' &&
                                                    <>
                                                        <button className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent" onClick={clearSearch} style={{ outline: 'none' }}>
                                                            <img src="/assets/images/dark_cross.svg" alt="Clear" className="right-2.5 bottom-2.5 " />
                                                        </button>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <CommentList
                                        comments={reduxComments}
                                        onReplyAdded={handleReplyAdded}
                                    />
                                </div>
                                <Pagination
                                    currentPage={reduxCurrentPage}
                                    totalPage={reduxTotalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details;