import React, {useContext} from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../../contexts/AuthContext";

const Index = () => {
    // const { auth } = useContext(AuthContext);
    const auth = useSelector(state => state.auth.auth);

    return (
        <div className="container d-flex justify-content-center mt-2">
            <h1>Welcome back, <span className="text-primary">{auth.user.name}</span></h1>
        </div>
    )
}

export default Index;
