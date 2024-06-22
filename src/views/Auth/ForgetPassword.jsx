import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthService from "../../services/AuthService";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    // Validate the email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate the form
    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        }
        else if (!validateEmail(email)) {
            newErrors.email = "Invalid email!";
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Reset form
    const resetForm = () => {
        setEmail('');
        setErrors({});
    }

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await AuthService.forgetPassword(email);
            if (response.data) {
                // Reset form
                resetForm();
            }
        }
    }


    return (
        <div className="container">
            <ToastContainer />
            <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h5 className="card-title">Forgot Password</h5>
                            <p className="card-text text-muted">  Enter your registered email address below to get your unique link to reset the password.</p>
                            <div>
                                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mt-4" />
                                {errors.email && <p className="error">{errors.email}</p>}
                            </div>
                            <div className="mt-4">
                                <button type="submit" className="btn btn-primary btn-lg w-100" onClick={handleForgetPassword}>Send Details</button>
                            </div>
                            <Link to={'/login'} className="d-block mt-3 text-decoration-none">Back to login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;