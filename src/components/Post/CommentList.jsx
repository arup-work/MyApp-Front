import React, { useEffect } from "react";
import Comment from "./Comment";

const CommentList = ({ comments }) => {
    useEffect(() => {

    }, [comments]);
    return (
        <div>
            {comments.length == 0 && (
                <div>
                    No comment found
                </div>
            )}
            {comments.map((comment, index) => (
                <div key={comment._id} className="comment mt-2">
                    <Comment key={comment._id} comment={comment}/>
                    {comments.length !== index + 1 && <hr />}
                </div>
            ))}
        </div>
    )
};

export default CommentList;