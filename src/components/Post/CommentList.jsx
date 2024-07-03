import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import DateFormatter from "../DateFormatter";
import CommentEditModal from "../Modal/Post/Comment/CommentEditModal";




const CommentList = ({ comments }) => {
    const [comment, setComment] = useState('');
    const [showEditModal, setShowEditModal] = useState(false); 

    const edit = () => {
        setShowEditModal(true);
    }

    const handleClose = () => {
        setShowEditModal(false);
    }
    return (
        <div>
            {comments.map((comment, index) => (
                <div key={comment._id}>
                    <p>{comment.comment}</p>
                    <div className="d-flex justify-content-end mx-2">
                        <FontAwesomeIcon icon={faEdit} onClick={(e) => edit(comment._id)} />
                        <FontAwesomeIcon icon={faTrashAlt} className="ms-2"/>
                    </div>
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
                    { comments.length  !== index + 1 && <hr />}

                    { showEditModal && <CommentEditModal show={showEditModal} handleClose={handleClose} comment={comment}/> }
                </div>
                
            ))}
        </div>
    )
};

export default CommentList;