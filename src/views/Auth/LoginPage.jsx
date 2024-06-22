import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from "react-router-dom";

import '../../assets/styles/AuthPage.css'
import { AuthContext } from "../../contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "../../helpers/utils/toastUtils";
import AuthService from "../../services/AuthService";



const LoginPage = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);

    // Validate the email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate the form
    const validateForm = () => {
        const newErrors = {};
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

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    // Reset form
    const resetForm = () => {
        setEmail('');
        setErrors({});
        setPassword('');
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await AuthService.login(email, password);
            if (response.data) {
                login(response.data.token, response.data.user);
                resetForm();
            } else {
                setPassword('');
            }
        }

    }

    useEffect(() => {
        if (location.state?.message) {
            if (location.state.type === 'success') {
                showSuccessToast(location.state.message);
            } else if (location.state.type === 'error') {
                showErrorToast(location.state.message);
            }
        }
    }, [location.state])


    return (
        <div className="login-container">
            <ToastContainer />
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email </label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password </label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span className="error">{errors.password}</span>}

                </div>
                <div>
                    <Link to={"/forget-password"} className="d-block mt-3 text-decoration-none">Forget password?</Link>
                </div>
                <button type="submit">Login</button>
                <div className="mt-2">
                    Don't have an account ? <Link to={"/register"} className="text-decoration-none">Signup</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
