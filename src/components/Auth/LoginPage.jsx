import React, {useState, useContext, useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";


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
        }else if(!validateEmail(email)) {
            newErrors.email = 'Email is not valid'
        }


        if (!password) {
            newErrors.password = 'Password is required'
        } else if(password.length < 6){
            newErrors.password = 'Password must be 6 characters long!'
        }

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }


    const handleLogin = async(e) => {
        e.preventDefault();

       if (validateForm()) {
        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/auth/login',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ email, password})
            })

            const data = await response.json();
            
            if (response.ok) {
                toast.success('Login successful',{
                    position: "top-right",
                    className: 'foo-bar'
                });
                login(data.token, data.user);
                // Reset form
                setEmail('');
                setErrors({});
                setPassword('');
            }else{
                console.log(data.message);
                toast.error(data.message, {
                    position: "top-right",
                    className: 'foo-bar'
                });
            }
            
        } catch (error) {
            setErrors('An error occurred. Please try again later.');
        }
        
       }
      
    }

    useEffect(() => {
        if (location.state?.message) {
            if (location.state.type === 'success') {
                toast.success(location.state.message, {
                  position: 'top-right',
                  className: 'foo-bar'
                });
            } else if (location.state.type === 'error') {
                toast.error(location.state.message, {
                  position: 'top-right',
                  className: 'foo-bar'
                });
            }
        }
    }, [location.state])


    return (
        <div className="login-container">
            <ToastContainer />
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="error">{errors.password}</p>}

                </div>
                <div>
                    <Link to={"/forget-password"} className="d-block mt-3 text-decoration-none">Forget password?</Link>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
