import React, { useContext, useState } from "react";
// import { AuthContext } from "../../../contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from "../../../services/AuthService";
import { useSelector } from "react-redux";


const Index = () => {
    // const { auth } = useContext(AuthContext);
    const { auth } = useSelector(state => state.auth);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!currentPassword.trim()) {
            newErrors.currentPassword = 'This field is required';
        }

        if (!password.trim()) {
            newErrors.password = 'This field is required';
        }else if(password.length < 6  ){
            newErrors.password = 'Password must be 6 character long'
        }

        if (!confirmPassword.trim()) {
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
            resetForm();
            return;
        }
        // Reset the form
       resetForm();


        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Reset form
    const resetForm = () => {
         setPassword('');
         setConfirmPassword('');
         setCurrentPassword('');
         setErrors({});
    }
    
    const handleChangePassword = async(e) => {
        e.preventDefault();
        if (validateForm()) {
           try {
             const response = await  AuthService.changePassword(auth, { currentPassword, newPassword : password});
             const data = response.data;
             if (data) {
               resetForm();
             }
           } catch (error) {
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