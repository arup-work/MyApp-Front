import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import { AuthContext } from "../../../contexts/AuthContext";
import { authActions } from "../../../redux/auth";


const LogoutModal = ({ show, handleClose }) => {
    // const { logout } = useContext(AuthContext);
    const dispatch = useDispatch();

    const handleLogout = () => {
        // logout();
        dispatch(authActions.logout());
        handleClose();
    }

    return (
        <div>
            <div className={`modal fade ${show ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sign Out</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want sign out? </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleLogout}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </div>
    )
}

export default LogoutModal;