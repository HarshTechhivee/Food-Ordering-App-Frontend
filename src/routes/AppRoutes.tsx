import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/user/Home.js";
import { Menu } from "../pages/user/Menu";
import Cart from "../pages/user/Cart";
import Orders from "../pages/user/Orders";
import OrderDetails from "../pages/user/OrderDetails";

import AdminDashboard from "../pages/admin/Dashboard";
import OrdersManagement from "../pages/admin/OrdersManagement";
import MenuManagement from "../pages/admin/MenuManagement";
import CreateMenuItem from "../pages/admin/CreateMenuItem";
import { EditMenuItem } from "../pages/admin/EditMenuItem";

import PublicLayout from "../layouts/PublicLayout.js";
import AdminLayout from "../layouts/AdminLayout.js";

import ProtectedRoute from "./ProtectedRoute";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoutes";

import { useAppSelector } from "../store/hooks.js";

function RootRedirect() {
    const { user, initialized } = useAppSelector((state) => state.auth);

    if (!initialized) {
        return null;
    }

    if (user?.role === "RESTAURANT_ADMIN") {
        return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/home" replace />;
}

export default function AppRoutes() {
    return (
        <Routes>


            {/* Customer-facing application */}
            <Route element={<PublicRoute/>}>
                <Route element={<PublicLayout />}>

                    <Route path="/home" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<UserRoute />}>

                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/orders/:id" element={<OrderDetails />} />

                        </Route>
                    </Route>
                </Route>
            </Route>


            {/* Authentication */}
            <Route element={<PublicRoute />}>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

            </Route>


            {/* Admin application */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>

                        <Route index element={<AdminDashboard />} />

                        <Route path="orders" element={<OrdersManagement />} />

                        <Route path="menu" element={<MenuManagement />} />

                        <Route path="menu/create" element={<CreateMenuItem />} />

                        <Route path="menu/edit/:id" element={<EditMenuItem />} />

                    </Route>
                </Route>
            </Route>

            {/* Default */}
            <Route path="/" element={<RootRedirect />} />

            <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
    );
}