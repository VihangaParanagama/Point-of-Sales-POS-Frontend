import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    
    return <Outlet />;
}

export default ProtectedRoutes;