import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';

import Pagination from "../../components/Pagination";
import PostEditModal from "../../components/Modal/Post/PostModal";
import AuthService from "../../services/AuthService";
import PostService from "../../services/PostService";
import { showConfirmationModal, showSuccessModal } from "../../helpers/utils/sweetAlertUtils";
import { AuthContext } from "../../contexts/AuthContext";
import '../../assets/styles/PostPage.css';


const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [postsPerPage, setPostPerPage] = useState(5);
    const [message, setMessage] = useState('');
    const [searchedPost, setSearchPost] = useState('');
    const [selectedLimit, setSelectedLimit] = useState(5);

    const [showEditModal, setShowEditModal] = useState(false);
    const [postDetails, setPostDetails] = useState([]);
    const [viewMode, setViewMode] = useState(false);
    const [createMode, setCreateMode] = useState(false);

    // const { auth } = useContext(AuthContext);
    const { auth } = useSelector(state => state.auth);


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    }

    const edit = async (postId, isViewModeEnable = false, isCreateModeEnable = false) => {
        if (isCreateModeEnable) {
            setCreateMode(isCreateModeEnable);
            setViewMode(isViewModeEnable);
            setPostDetails([]);
        } else {
            const response = await PostService.show(postId);
            const data = response.data;
            if (data) {
                setPostDetails(data.post);
            }
            setViewMode(isViewModeEnable);
            setCreateMode(isCreateModeEnable);
        }
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
        console.log(postsPerPage);
        const response = await PostService.index(auth, currentPage, postsPerPage, searchKey);
        if (response.data) {
            const data = response.data;
            setPosts(data.posts.post || []);
            setTotalPage(data.posts.totalPage);
            setMessage(data.posts.message);
        }
    }

    const handleClose = () => {
        setShowEditModal(false);
    }

    // For searching
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

    // Limit change dropdown functionality
    const handleLimitChange = (event) => {
       const selectedValue = event.target.value;
       setSelectedLimit(selectedValue);
       setPostPerPage(selectedValue);
       fetchPosts();
    }

    useEffect(() => {
        stateMessage();
        fetchPosts();
    }, [location.state, location.pathname, auth, navigate, currentPage, postsPerPage]);




    return (
        <div>
            <ToastContainer />
            <div className="row mb-3">
                <div className="col-6">
                    <h3>Posts</h3>
                </div>
                <div className="col-6 d-flex justify-content-end post-create">
                    <a className="btn btn-sm btn-primary btn-round btn-icon" onClick={() => edit(null, null, true)}> <FontAwesomeIcon icon={faPlus} /><span className="ms-2">Create</span></a>
                </div>
            </div>
            <div className="row ">
                <div className="col-9">
                    <div className="row">
                        <div className="col-3">
                            <div className="d-flex align-items-center">
                                <span className="me-2">Show</span>
                                <select className="form-select" aria-label="Entries select" onChange={handleLimitChange} value={selectedLimit}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span className="ms-2">entries</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 head_search">
                    <div className="position-relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchedPost}
                            onChange={e => handleInputChange(e.target.value)}
                            className="head_search bg-sidebar_bg text-textColorBlack bg-gray-50 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2 me-2"
                        />
                        {searchedPost !== '' &&
                            <>
                                <button className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent" onClick={clearSearch} style={{ outline: 'none' }}>
                                    <img src="/assets/images/dark_cross.svg" alt="Clear" className="right-2.5 bottom-2.5 " />
                                </button>
                            </>
                        }
                    </div>

                </div>
            </div>
            <div className="mt-2">
                <div>
                    <table className="table table-bordered border-light shadow-sm justify-content-center">
                        <thead className="thead-light">
                            <tr>
                                <th className="px-3 py-2">Title</th>
                                <th className="px-3 py-2">Description</th>
                                <th className="px-3 py-2">Image</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!posts || (posts && posts.length == 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center">No data found</td>
                                </tr>
                            )}
                            {posts && posts.length > 0 && posts.map((post, index) => (
                                <tr key={post._id}>
                                    <td className="px-3 py-2">
                                        <Link to={`/post/${post._id}`} className="text-decoration-none">{post.title}</Link>
                                    </td>
                                    <td className="px-3 py-2">{post.description}</td>
                                    <td className="px-3 py-2"><img src={post.image} alt="post_image" className="img-thumbnail" width={70} /></td>
                                    <td className="px-3 py-2">
                                        {post.userId === auth.user.id ? (
                                            <>
                                                <button className="btn btn-sm btn-primary me-2" onClick={() => edit(post._id)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className="btn btn-sm btn-danger me-2" onClick={() => deletePost(post._id)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </>
                                        ) : null}
                                        <button className="btn btn-sm btn-primary" onClick={() => edit(post._id, true)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            {showEditModal && <PostEditModal show={showEditModal} handleClose={handleClose} postDetails={!createMode && postDetails} viewMode={viewMode} createMode={createMode} />}
        </div>
    )
}

export default Index;