import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function ProtectedRoute() {

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    console.log(isAuthenticated, 'orders-authencate')

    const initialized = useAppSelector((state) => state.auth.initialized);

    if (!initialized) {
        return;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;

