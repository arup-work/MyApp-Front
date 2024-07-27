import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../../components/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';

import PostEditModal from "../../components/Modal/Post/PostEditModal";
import AuthService from "../../services/AuthService";
import PostService from "../../services/PostService";
import { showConfirmationModal, showSuccessModal } from "../../helpers/utils/sweetAlertUtils";
import { AuthContext } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";


const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [message, setMessage] = useState('');
    const [searchedPost, setSearchPost] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [postDetails, setPostDetails] = useState([]);
    const [viewMode, setViewMode] = useState(false);

    // const { auth } = useContext(AuthContext);
    const { auth } = useSelector(state => state.auth);


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    }

    const edit = async (postId, isViewModeEnable = false) => {
        const response = await PostService.show(postId);
        const data = response.data;
        if (data) {
            setPostDetails(data.post);
        }
        setViewMode(isViewModeEnable);
        setShowEditModal(true);
    }

    const deletePost = async (postId) => {
        const result = await showConfirmationModal('Delete Post', 'Are you sure you want to delete this post?');
        if (result.isConfirmed) {
            try {
                const response = await PostService.deletePost(postId);
                if (response.data) {
                    navigate('/post', {
                        state: {
                            message: 'Post deleted successfully',
                            type: 'success'
                        }
                    })
                }
            } catch (error) {

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
    // Fetch posts 
    const fetchPosts = async (searchKey = '') => {
        const response = await PostService.index(auth, currentPage, postsPerPage, searchKey);
        if (response.data) {
            const data = response.data;
            setPosts(data.posts.post);
            setTotalPage(data.posts.totalPage);
            setMessage(data.posts.message);
        }
    }

    const handleClose = () => {
        setShowEditModal(false);
    }

    const handleInputChange = (value) => {
        setSearchPost(value);
        handleSearch(value);
    }
    const handleSearch = (searchKey) => {
        fetchPosts(searchKey);
    }

    const clearSearch = () => {
        setSearchPost('');
        handleSearch('');
    }

    useEffect(() => {
        stateMessage();
        fetchPosts();
    }, [location.state, location.pathname, auth, navigate, currentPage, postsPerPage]);




    return (
        <div className="container mt-2">
            <ToastContainer />
            <div className="row ">
                <div className="d-flex justify-content-center">
                    <h2>Al Posts</h2>
                </div>
            </div>
            <div className="row ">
                <div className="col-9">
                    <Link to={'/post/create'} className="btn btn-primary"> <FontAwesomeIcon icon={faPlus} /><span className="ms-2">Create</span></Link>

                </div>
                <div className="col-3">
                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchedPost}
                            onChange={e => handleInputChange(e.target.value)}
                        />
                        {searchedPost !== '' &&
                            <>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary">
                                        <img src="/assets/images/dark_cross.svg" alt="Clear" style={{ width: '10px' }} onClick={clearSearch} />
                                    </button>
                                </div>
                            </>
                        }
                    </div>

                </div>
            </div>
            <div className="mt-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length == 0 && (
                            <tr>
                                <td colSpan={5} className="text-center">No data found</td>
                            </tr>
                        )}
                        {posts.length > 0 && posts.map((post, index) => (
                            <tr key={post._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/post/${post._id}`} className="text-decoration-none">{post.title}</Link>
                                </td>
                                <td>{post.description}</td>
                                <td><img src={post.image} alt="post_image" className="img-thumbnail" width={100} /></td>
                                <td>
                                    {post.userId === auth.user.id ? (
                                        <>
                                            <button className="btn btn-primary me-2" onClick={() => edit(post._id)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="btn btn-danger ml-2" onClick={() => deletePost(post._id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </>
                                    ) : null}
                                    <button className="btn btn-primary mx-2" onClick={() => edit(post._id, true)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-8">
                        {(
                            <span>
                                {message}
                            </span>
                        )}
                    </div>
                    <div className="col-4 float-end justify-content-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

            </div>
            {showEditModal && <PostEditModal show={showEditModal} handleClose={handleClose} postDetails={postDetails} viewMode={viewMode} />}
        </div>
    )
}

export default Index;