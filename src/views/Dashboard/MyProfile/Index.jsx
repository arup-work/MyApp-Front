import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Index = () => {
    const { auth } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!currentPassword) {
            newErrors.currentPassword = 'This field is required';
        }

        if (!password) {
            newErrors.password = 'This field is required';
        }else if(password.length < 6  ){
            newErrors.password = 'Password must be 6 character long'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'This field is required';
        }else if(confirmPassword.length < 6  ){
            newErrors.confirmPassword = 'Confirm Password must be 6 character long'
        }

        if (password !== confirmPassword) {
            toast.error('Password & confirm password must be same!', {
                position: "top-right",
                className: 'foo-bar'
            })
            // Reset the form
            setPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setErrors({});
            return;
        }
        // Reset the form
        setPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
        setErrors({});


        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }
    const handleChangePassword = async(e) => {
        e.preventDefault();

        if (validateForm()) {
           try {
             const response = await fetch('http://127.0.0.1:3000/change-password',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword : password
                })
             });

             const data = await response.json();
             if (response.ok) {
                toast.success(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                })

                // Reset the form
                setPassword('');
                setConfirmPassword('');
                setCurrentPassword('');
                setErrors({});
             }else{
                toast.error(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                })
             }

           } catch (error) {
                toast.error('An error occurred. Please try again later.', {
                    position: "top-right",
                    className: 'foo-bar'
                })
                setErrors('An error occurred. Please try again later.');
           }
        }
    }
    return (
        <div className="container ">
            <ToastContainer/>
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-header">
                            My Profile
                        </div>
                        <div className="card-body">
                            <div>
                                <label htmlFor="current_password" className="form-label">Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-control" />
                                {errors.currentPassword && <p className="error">{errors.currentPassword}</p>}
                            </div>
                            <div className="mt-2">
                                <label htmlFor="password" className="form-label">New Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                                {errors.password && <p className="error">{errors.password}</p>}
                            </div>
                            <div className="mt-2">
                                <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" />
                                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary mt-3 float-end" onClick={handleChangePassword}>Change password</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Index;