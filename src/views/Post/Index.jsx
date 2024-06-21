import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../../components/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import PostEditModal from "../../components/Auth/Modal/PostEditModal";


const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [postsPerPage] = useState(5);

    const [showEditModal, setShowEditModal] = useState(false);
    const [postDetails, setPostDetails] = useState([]);


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    }

    const edit = async(postId) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/post/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const data = await response.json();
            if (response.ok) {
                setPostDetails(data.post);
            }else{
                toast.error(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                });
            }
        } catch (error) {
            
        }
        setShowEditModal(true);
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
    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/post?page=${currentPage}&limit=${postsPerPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts.post);
                setTotalPage(data.posts.totalPage);
            } else {
                toast.error(data.message || 'Failed to fetch posts');
            }
        } catch (error) {
            toast.error('An error occurred while fetching posts');
        }
    }

    useEffect(() => {
        stateMessage();
        fetchPosts();
    }, [location.state, location.pathname, navigate, currentPage, postsPerPage]);

    const handleClose = () => {
        setShowEditModal(false);
    }


    return (
        <div className="container mt-2">
            <ToastContainer />
            <div className="row ">
                <div className="d-flex justify-content-center">
                    <h2>All Posts</h2>
                </div>
            </div>
            <div className="row ">
                <div className="col-2">
                    <Link to={'/post/create'} className="btn btn-primary"> <FontAwesomeIcon icon={faPlus} /><span className="ms-2">Create</span></Link>
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
                        {posts.map((post, index) => (
                            <tr key={post._id}>
                                <td>{index + 1}</td>
                                <td>{post.title}</td>
                                <td>{post.description}</td>
                                <td><img src={post.image} alt="post_image" className="img-thumbnail" width={100} /></td>
                                <td>
                                    <button className="btn btn-primary me-2" onClick={() => edit(post._id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="btn btn-danger ml-2">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
            {/* Edit modal */}
            <PostEditModal show={showEditModal} handleClose={handleClose} postDetails={postDetails} />
        </div>
    )
}

export default Index;