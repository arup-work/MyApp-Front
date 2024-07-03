import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import PostService from "../../../../services/PostService";

const CommentEditModal = ({ show, handleClose, postDetails }) => {
    return (
        <div>
            <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Comment</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {/* Example input fields */}
                                <div className="form-group">
                                    <label htmlFor="commentText">Comment</label>
                                    <textarea
                                        className="form-control"
                                        id="commentText"
                                        rows="3"
                                    ></textarea>
                                </div>
                                {/* Add more form fields as needed */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="fade show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>}
        </div>
    )
}

export default CommentEditModal;
