import { useEffect, useState } from "react";
import { Navigate} from "react-router-dom";
import axios from "axios";


function Protected({ children, pageToReturn}){

    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    useEffect(() => {
        axios.get("http://localhost:3000/protected", {withCredentials: true})
        .then(() => {
            setIsAuthenticated(true);
        })
        .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to={pageToReturn} />;
}


export default Protected;