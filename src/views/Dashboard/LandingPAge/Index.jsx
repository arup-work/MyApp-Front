import React, {useContext} from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const Index = () => {
    const { auth } = useContext(AuthContext);


    return (
        <div className="container d-flex justify-content-center mt-2">
            <h1>Welcome, <span className="text-primary">{auth.user.name}</span></h1>
        </div>
    )
}

export default Index;
