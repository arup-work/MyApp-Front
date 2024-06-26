import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { showErrorToast } from "../../helpers/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await AuthService.verifyEmail(token);
                if (response.data) {
                    const data = response.data;
                    setMessage(data.message);
                    setName(data.user.name);
                } else {
                    console.log("called");
                    setMessage('');
                    setName('');
                    navigate('/login', {
                        state: {
                            message : response.error,
                            type: 'error'
                        }
                    })
                }
            } catch (error) {
                setMessage("Email verification failed. Please try again.");
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-body text-center">
                            <h2 className="card-title mb-4">Congratulations {name}!</h2>
                            {message != '' && (
                                <>
                                    <p className="text-success"><span><FontAwesomeIcon icon={faCircleCheck} className="mx-2" /></span>Your email has been verified successfully!
                                        <br /> <span className="ms-4">Now you can login with your credential.</span></p>
                                </>
                            )}

                            <Link to="/login" className="text-decoration-none btn btn-primary btn-lg">Back to login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;