import React, { useContext, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});


    // Validate the form
    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        }
        else if (password.length < 6) {
            newErrors.password = "Password must be contain 6 character long";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        }
        else if (confirmPassword.length < 6) {
            newErrors.confirmPassword = "Confirm Password must be contain 6 character long";
        }

        if (password !== confirmPassword) {
            toast.error('Password & confirm password must be same',{
                position: "top-right",
                className: 'foo-bar'
            });
            return 
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const handleForgetPassword = async (e) => {

        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(`http://127.0.0.1:3000/reset-password/${token}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword : password })
                })

                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message, {
                        position: "top-right",
                        className: 'foo-bar'
                    })

                    // Reset form
                    setPassword('');
                    setConfirmPassword('');
                    setErrors({});

                    navigate('/login', {
                        state : {
                            message :  data.message, type : 'success' 
                        }
                    });
                } else {
                    toast.error(data.message, {
                        position: "top-right",
                        className: 'foo-bar'
                    })

                     // Reset form
                    setPassword('');
                    setConfirmPassword('');
                    setErrors({});
                    navigate('/login' , {
                        state : {
                            message :  data.message, type : 'error' 
                        }
                    });
                    
                }

            } catch (error) {
                toast.error(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                })
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
                            <form onSubmit={handleForgetPassword}>
                                <h5 className="card-title">Reset Password</h5>
                                <div className="mt-4">
                                    <input type="password" name="password" id="" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="form-control p-3" />
                                    {errors.password && <p className="error">{errors.password}</p>}
                                </div>
                                <div className="mt-3">
                                    <input type="password" name="confirm_password" id="" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} className="form-control p-3" />
                                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                                </div>
                                <div className="mt-4">
                                    <button type="submit" className="btn btn-primary btn-lg w-100">Reset Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;