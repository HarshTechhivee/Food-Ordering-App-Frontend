
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logout } from "../store/slices/authSlice.js";
import NotificationBell from "../components/common/NotificationBell.js";

function AdminLayout() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logout());
    };

    const closeSidebar = () => setSidebarOpen(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `admin-nav-link nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 ${isActive ? "active" : ""
        }`;

    return (
        <div className="admin-shell min-vh-100">
            {/* Top Navbar */}
            <header className="admin-header sticky-top">
                <div className="container-fluid px-3 px-lg-4">
                    <div className="d-flex align-items-center justify-content-between gap-3 py-3">

                        {/* Brand and mobile menu toggle */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                type="button"
                                className="btn admin-mobile-toggle d-md-none"
                                aria-label={
                                    sidebarOpen
                                        ? "Close navigation menu"
                                        : "Open navigation menu"
                                }
                                aria-expanded={sidebarOpen}
                                onClick={() =>
                                    setSidebarOpen((previous) => !previous)
                                }
                            >
                                <i
                                    className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"
                                        } fs-4`}
                                />
                            </button>

                            <NavLink
                                to="/admin"
                                className="admin-brand d-flex align-items-center gap-2 text-decoration-none"
                                onClick={closeSidebar}
                            >
                                <div className="admin-brand-icon">
                                    <i className="bi bi-shop-window fs-4" />
                                </div>

                                <div>
                                    <div className="admin-brand-name">
                                        FoodHub
                                    </div>
                                    <div className="admin-brand-caption">
                                        RESTAURANT ADMIN
                                    </div>
                                </div>
                            </NavLink>
                        </div>

                        {/* Header actions */}
                        <div className="d-flex align-items-center gap-2 gap-sm-3">
                            <div className="admin-notification">
                                <NotificationBell />
                            </div>

                            <div className="admin-header-divider d-none d-sm-block" />

                            <div className="d-none d-sm-flex align-items-center gap-2">
                                <div className="admin-avatar">
                                    <i className="bi bi-person-fill fs-5" />
                                </div>

                                <div className="admin-header-user">
                                    <div className="admin-header-user-name">
                                        {user?.name || "Administrator"}
                                    </div>
                                    <div className="admin-header-user-role">
                                        Restaurant Admin
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn admin-logout-btn"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <i className="bi bi-box-arrow-right" />
                                <span className="d-none d-sm-inline">
                                    Logout
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Layout */}
            <div className="container-fluid">
                <div className="row g-0">

                    {/* Sidebar */}
                    <aside
                        className={`col-md-3 col-lg-2 admin-sidebar ${sidebarOpen ? "d-block" : "d-none"
                            } d-md-block`}
                    >
                        <div className="admin-sidebar-inner">
                            <div className="admin-sidebar-heading">
                                WORKSPACE
                            </div>

                            <nav className="nav flex-column gap-2">
                                <NavLink
                                    to="/admin"
                                    end
                                    className={navLinkClass}
                                    onClick={closeSidebar}
                                >
                                    <i className="bi bi-grid-1x2-fill" />
                                    <span>Dashboard</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/orders"
                                    className={navLinkClass}
                                    onClick={closeSidebar}
                                >
                                    <i className="bi bi-receipt-cutoff" />
                                    <span>Orders</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/menu"
                                    className={navLinkClass}
                                    onClick={closeSidebar}
                                >
                                    <i className="bi bi-menu-button-wide-fill" />
                                    <span>Menu Management</span>
                                </NavLink>
                            </nav>

                            {/* Admin profile */}
                            <div className="admin-sidebar-profile">
                                <div className="admin-sidebar-heading mb-3">
                                    SIGNED IN AS
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="admin-profile-avatar">
                                        <i className="bi bi-person-fill fs-5" />
                                    </div>

                                    <div className="overflow-hidden">
                                        <div className="admin-profile-name text-truncate">
                                            {user?.name || "Administrator"}
                                        </div>
                                        <div className="admin-profile-email text-truncate">
                                            {user?.email || ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="col-md-9 col-lg-10 admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
