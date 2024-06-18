import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { AuthContext } from './contexts/AuthContext'
import NavigationBar from './components/Layout/Navbar'
import AppRoutes from './routes/AppRoutes';


function App() {
  const { auth } = useContext(AuthContext);


  return (
    <Router>
      <div>
        {auth.token ? <NavigationBar /> : null}
        
        <AppRoutes />
      </div>
    </Router >
  )
}

export default App
