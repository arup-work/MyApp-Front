import React, {createContext, useState, useEffect} from "react";

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ( { children }) => {
    const [auth, setAuth] = useState({ token : null, user: null});
    const [loading, setLoading] = useState(true); //Add a loading state 

    // Function to login
    const login = (token, user) => { 
            setAuth({ token, user });
            localStorage.setItem('token' , token); //Store token into local storage
            localStorage.setItem('user', JSON.stringify(user)); //Store user details into local storage
    }

    // Function to logout
    const logout = () => {
        setAuth({ token : null, user : null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Check localStorage for a token on initialization
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            setAuth({ token, user });
        }
        setLoading(false); // Set loading to false once the check is complete
    }, []) 


    if (loading) {
        return <div>Loading...</div>; // Render a loading indicator or placeholder
    }

    return(
        <AuthContext.Provider value={{ auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}; 

