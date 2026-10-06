import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logout } from "../store/slices/authSlice.js";

function AdminLayout() {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = async () => {
        await dispatch(logout());
    };

    return (
        <div className="min-vh-100 bg-light">

            {/* Top Header */}
            <header className="bg-dark text-white border-bottom">
                <div className="container-fluid px-3 px-md-4">
                    <div className="d-flex align-items-center justify-content-between py-3">

                        {/* Brand */}
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="bg-primary rounded-3 d-flex align-items-center justify-content-center"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                }}
                            >
                                <i className="bi bi-shop fs-5"></i>
                            </div>

                            <div>
                                <div className="fw-bold">
                                    FoodHub
                                </div>

                                <small className="text-secondary">
                                    Restaurant Admin
                                </small>
                            </div>
                        </div>

                        {/* User */}
                        <div className="d-flex align-items-center gap-4">

                            <div className="text-end d-none d-sm-block">
                                <div className="fw-semibold small">
                                    {user?.name}
                                </div>

                                <small className="text-secondary">
                                    Administrator
                                </small>
                            </div>

                            <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                }}
                            >
                                <i className="bi bi-person-fill"></i>
                            </div>

                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                <span className="d-none d-sm-inline">
                                    Logout
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Area */}
            <div className="container-fluid">
                <div className="row">

                    {/* Sidebar */}
                    <aside className="col-md-3 col-lg-2 bg-white border-end min-vh-100 p-3">

                        {/* Navigation heading */}
                        <div className="mb-3">
                            <small className="text-uppercase text-secondary fw-semibold">
                                Management
                            </small>
                        </div>

                        <nav className="nav flex-column gap-2">

                            {/* Dashboard */}
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) =>
                                    `nav-link rounded-3 px-3 py-2 d-flex align-items-center ${
                                        isActive
                                            ? "active bg-primary text-white"
                                            : "text-dark"
                                    }`
                                }
                            >
                                <i className="bi bi-grid-1x2-fill me-3"></i>
                                Dashboard
                            </NavLink>

                            {/* Orders */}
                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) =>
                                    `nav-link rounded-3 px-3 py-2 d-flex align-items-center ${
                                        isActive
                                            ? "active bg-primary text-white"
                                            : "text-dark"
                                    }`
                                }
                            >
                                <i className="bi bi-receipt-cutoff me-3"></i>
                                Orders
                            </NavLink>

                            {/* Menu */}
                            <NavLink
                                to="/admin/menu"
                                className={({ isActive }) =>
                                    `nav-link rounded-3 px-3 py-2 d-flex align-items-center ${
                                        isActive
                                            ? "active bg-primary text-white"
                                            : "text-dark"
                                    }`
                                }
                            >
                                <i className="bi bi-menu-button-wide-fill me-3"></i>
                                Menu Management
                            </NavLink>

                        </nav>

                        {/* Admin Information */}
                        <div className="border-top mt-4 pt-4">

                            <div className="d-flex align-items-center gap-3">

                                <div
                                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                    }}
                                >
                                    <i className="bi bi-person-fill"></i>
                                </div>

                                <div className="overflow-hidden">
                                    <div className="fw-semibold text-truncate">
                                        {user?.name}
                                    </div>

                                    <small className="text-secondary text-truncate d-block">
                                        {user?.email}
                                    </small>
                                </div>

                            </div>

                        </div>

                    </aside>

                    {/* Main Content */}
                    <main className="col-md-9 col-lg-10 p-3 p-md-4 p-lg-5">
                        <Outlet />
                    </main>

                </div>
            </div>
        </div>
    );
}

export default AdminLayout;