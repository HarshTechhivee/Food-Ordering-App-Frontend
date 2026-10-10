import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function AdminRoute() {
    const user = useAppSelector((state) => state.auth.user);

    // const initialized = useAppSelector((state) => state.auth.initialized);

    // if (!initialized) {
    //     return <div>Loading...</div>;
    // }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "RESTAURANT_ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;