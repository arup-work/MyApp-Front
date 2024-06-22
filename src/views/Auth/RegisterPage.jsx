import React, { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

import '../../assets/styles/AuthPage.css';
import { AuthContext } from "../../contexts/AuthContext";
import AuthService from "../../services/AuthService";


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();

    // Validate the email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
        if (!name) {
            newErrors.name = 'Name is required'
        }
        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email is not valid'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be 6 characters long!'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required'
        } else if (confirmPassword.length < 6) {
            newErrors.confirmPassword = 'Confirm Password must be 6 characters long!'
        }

        if (password !== confirmPassword) {
            newErrors.password = 'Password & Confirm password must be same!'
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Reset the form
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        setErrors('');
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const response = await AuthService.register(name, email, password, confirmPassword);
            if (response.data) {
                // Reset form
                resetForm();
                navigate('/login', {
                    state: {
                        message: response.data.message, type: 'success'
                    }
                });
            }
        }

    }

    return (
        <div className="login-container">
            <ToastContainer />
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div>
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className="mt-2">Register</button>
                <div className="mt-2">
                    Already have an account? <Link to={"/login"} className="text-decoration-none">Login</Link>
                </div>
            </form>

        </div>
    );
}

export default RegisterPage;