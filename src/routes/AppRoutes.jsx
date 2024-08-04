import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import { AuthContext } from '../contexts/AuthContext';
import LoginPage from "../views/Auth/LoginPage";
import RegisterPage from '../views/Auth/RegisterPage';
import Index from "../views/Dashboard/LandingPAge/Index";
import ProfileIndex from "../views/Dashboard/MyProfile/Index";
import Create from "../views/Post/Create";
import PostIndex from "../views/Post/Index";
import PostDetails from "../views/Post/Details";

import ForgetPassword from '../views/Auth/ForgetPassword';
import ResetPassword from '../views/Auth/ResetPassword';
import VerifyEmail from "../views/Auth/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    // const { auth } = useContext(AuthContext);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    return (
        <Routes>
            <Route
                path='/login'
                element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
                path='/register'
                element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
                path='/verify-email/:token'
                element={!isAuthenticated ? <VerifyEmail /> : <Navigate to="/" />}
            />
            <Route
                path='/profile'
                element={isAuthenticated ? <ProfileIndex /> : <Navigate to="/login" />}
            />

            <Route
                path='/forget-password'
                element={!isAuthenticated ? <ForgetPassword /> : <Navigate to="/" />}

            />
            <Route
                path='/reset-password/:token'
                element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />}
            />

            <Route
                path="/"
                element={<ProtectedRoute><Index /></ProtectedRoute>}
            />

            <Route 
                path="/post/create"
                element={isAuthenticated ? <Create /> : <Navigate to="/login" />}
            />
            <Route 
                path="/post"
                element={isAuthenticated ? <PostIndex /> : <Navigate to="/login" />}
            />
            <Route 
                path="/favorites"
                element={isAuthenticated ? <PostIndex /> : <Navigate to="/login" />}
            />
            <Route 
                path="/post/:postId"
                element={isAuthenticated ? <PostDetails /> : <Navigate to="/login" />}
            />
        </Routes>
    )
}

export default AppRoutes;
