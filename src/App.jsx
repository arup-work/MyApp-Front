import { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AppRoutes from './routes/AppRoutes';
import { AuthContext } from './contexts/AuthContext'
import NavigationBar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar';
import './assets/styles/App.css';




function App() {
  // const { auth } = useContext(AuthContext);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar />}
        <div className="content-area">
          {isAuthenticated && <NavigationBar />}
          <div className="main-content">
            <AppRoutes />
          </div>
        </div>
      </div>
    </Router >
  )
}

export default App
