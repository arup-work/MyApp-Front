import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './contexts/AuthContext.jsx'
import { Provider } from 'react-redux';
import reduxStore from './redux/index.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,

  // <AuthProvider>
  //   <App/>
  // </AuthProvider>,

  <Provider store={reduxStore}>
    <App/>
  </Provider>
  
)
