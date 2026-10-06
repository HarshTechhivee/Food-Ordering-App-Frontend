import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function PublicRoute() {
    const { user, initialized } = useAppSelector((state) => state.auth);

    if (!initialized) {
        return null;
    }

    // Admin is not allowed on customer/public pages
    if (user?.role === "RESTAURANT_ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;