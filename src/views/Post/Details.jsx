import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import { AuthContext } from "../../contexts/AuthContext";
import '../../assets/styles/PostPage.css';
import DateFormatter from "../../components/DateFormatter";
import CommentList from "../../components/Post/CommentList";

const Details = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [viewCount, setViewCount] = useState(0);
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

    useEffect(() => {
        fetchPostWithComments();
        incrementViewCount();
    }, [postId])

    useEffect(() => {
    }, [comments]);

    return (
        <div className="container">
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