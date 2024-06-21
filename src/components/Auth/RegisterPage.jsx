import React, { useContext, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

    const handleRegister = async (e) => {
        e.preventDefault();

       if (validateForm()) {
        console.log('Name: ', name);
        console.log('Email: ', email);
        console.log('Password: ', password);
        console.log('Confirm Password: ', password);

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // toast.success('Registration successful', {
                //     position: "top-right",
                //     className: 'foo-bar'
                // });

                // login(data.token, data.user);

                // Reset form
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setErrors({});
                setErrors('');

                navigate('/login', {
                    state : {
                        message :  data.message, type : 'success' 
                    }
                });
            }else{
                console.error('Registration failed:', data.message);
                toast.error(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrors('An error occurred. Please try again later.');
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
                    { errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    { errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    { errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    { errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
                <button type="submit">Register</button>
            </form>

        </div>
    );
}

export default RegisterPage;