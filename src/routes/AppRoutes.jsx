import React, { useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LoginPage from "../views/Auth/LoginPage";
import RegisterPage from '../views/Auth/RegisterPage';
import Index from "../views/Dashboard/LandingPAge/Index";
import ProfileIndex from "../views/Dashboard/MyProfile/Index";
import Create from "../views/Post/Create";
import PostIndex from "../views/Post/Index";

import ForgetPassword from '../views/Auth/ForgetPassword';
import ResetPassword from '../views/Auth/ResetPassword';

const AppRoutes = () => {
    const { auth } = useContext(AuthContext);

    return (
        <Routes>
            <Route
                path='/login'
                element={!auth.token ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
                path='/register'
                element={!auth.token ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
                path='/profile'
                element={auth.token ? <ProfileIndex /> : <Navigate to="/login" />}
            />

            <Route
                path='/forget-password'
                element={!auth.token ? <ForgetPassword /> : <Navigate to="/" />}

            />
            <Route
                path='/reset-password/:token'
                element={!auth.token ? <ResetPassword /> : <Navigate to="/" />}
            />

            <Route
                path="/"
                element={auth.token ? <Index /> : <Navigate to="/login" />}
            />

            <Route 
                path="/post/create"
                element={auth.token ? <Create /> : <Navigate to="/login" />}
            />
            <Route 
                path="/post"
                element={auth.token ? <PostIndex /> : <Navigate to="/login" />}
            />
        </Routes>
    )
}

export default AppRoutes;
