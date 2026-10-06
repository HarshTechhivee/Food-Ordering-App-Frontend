import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function UserRoute() {
    const user = useAppSelector((state) => state.auth.user);
    
    const initialized = useAppSelector(
        (state) => state.auth.initialized
    );

    if (!initialized) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "USER") {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}

export default UserRoute;