import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import PostService from "../../../services/PostService";
import { AuthContext } from "../../../contexts/AuthContext";

const Index = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const { auth } = useContext(AuthContext);

    const fetchPostWithComments = async () => {
        const data = await PostService.fetchPostWithComments(auth, postId);
        console.log(data);
    }

    useEffect(() => {
       fetchPostWithComments();
    })

    return (
        <div>
            <h2> {postId}</h2>
        </div>
    )
}

export default Index;