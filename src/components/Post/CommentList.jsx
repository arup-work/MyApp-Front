import React from "react";
import DateFormatter from "../DateFormatter";

const CommentList = ({ comments }) => {
    return (
        <div>
            {comments.map((comment, index) => (
                <div key={comment._id}>
                    <p>{comment.comment}</p>
                    <div className="d-flex justify-content-end">
                        <div>
                            <small>
                                <DateFormatter date={comment.createdAt} withMinutes={true} />
                            </small>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div>
                            <small className="text-primary">{comment.userName}</small>
                        </div>
                    </div>
                    { comments.length -1  !== index  && <hr />}
                </div>
            ))}
        </div>
    )
};

export default CommentList;