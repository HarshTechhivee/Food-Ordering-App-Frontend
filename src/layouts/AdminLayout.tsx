import PushNotificationPrompt from "../components/common/PushNotificationPrompt.js";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logout } from "../store/slices/authSlice.js";
import NotificationBell from "../components/common/NotificationBell.js";

function AdminLayout() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const pageTitle = location.pathname.includes("/orders")
        ? "Orders"
        : location.pathname.includes("/menu/create")
            ? "Create menu item"
            : location.pathname.includes("/menu/edit")
                ? "Edit menu item"
                : location.pathname.includes("/menu")
                    ? "Menu management"
                    : "Dashboard";

    const handleLogout = async () => {
        setSidebarOpen(false);
        await dispatch(logout());
    };

    const closeSidebar = () => setSidebarOpen(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `admin-nav-link nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 ${isActive ? "active" : ""}`;

    return (
        <div className="admin-shell min-vh-100">
            {user && <PushNotificationPrompt userKey={user.email} />}

            {sidebarOpen && (
                <button
                    type="button"
                    className="admin-sidebar-backdrop d-md-none"
                    aria-label="Close navigation menu"
                    onClick={closeSidebar}
                />
            )}

                <aside
                    id="adminMobileSidebar"
                    aria-label="Admin navigation"
                    className={`admin-sidebar ${sidebarOpen ? "is-open" : "is-closed"}`}
                >
                    <div className="admin-sidebar-inner">
                        <NavLink
                            to="/admin"
                            className="admin-brand d-flex align-items-center gap-2 text-decoration-none"
                            onClick={closeSidebar}
                        >
                            <div className="admin-brand-icon">
                                <i className="bi bi-shop-window" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="admin-brand-name">FoodHub</div>
                                <div className="admin-brand-caption">RESTAURANT ADMIN</div>
                            </div>
                        </NavLink>

                        <nav className="nav flex-column admin-sidebar-nav" aria-label="Workspace">
                            <NavLink to="/admin" end className={navLinkClass} onClick={closeSidebar}>
                                <i className="bi bi-grid-1x2-fill" aria-hidden="true" />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/admin/orders" className={navLinkClass} onClick={closeSidebar}>
                                <i className="bi bi-receipt-cutoff" aria-hidden="true" />
                                <span>Orders</span>
                            </NavLink>
                            <NavLink to="/admin/menu" className={navLinkClass} onClick={closeSidebar}>
                                <i className="bi bi-menu-button-wide-fill" aria-hidden="true" />
                                <span>Menu Management</span>
                            </NavLink>
                        </nav>

                        <div className="admin-sidebar-profile">
                            <div className="d-flex align-items-center gap-2">
                                <div className="admin-profile-avatar">
                                    <i className="bi bi-person-fill" aria-hidden="true" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="admin-profile-name text-truncate">{user?.name || "Administrator"}</div>
                                    <div className="admin-profile-email text-truncate">{user?.email || ""}</div>
                                </div>
                            </div>
                            <button type="button" className="btn admin-logout-btn" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                <div className="admin-main">
                    <header className="admin-header sticky-top">
                        <div className="admin-header-inner">
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    className="btn admin-mobile-toggle d-md-none"
                                    aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                                    aria-expanded={sidebarOpen}
                                    aria-controls="adminMobileSidebar"
                                    onClick={() => setSidebarOpen((previous) => !previous)}
                                >
                                    <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
                                </button>
                                <div className="admin-header-context">
                                    <span className="admin-header-context-label">Restaurant Admin</span>
                                    <span className="admin-header-context-title">{pageTitle}</span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-2 gap-sm-3">
                                <div className="admin-notification">
                                    <NotificationBell />
                                </div>
                                <div className="admin-header-divider d-none d-sm-block" />
                                <div className="d-flex align-items-center gap-2">
                                    <div className="admin-avatar">
                                        <i className="bi bi-person-fill" aria-hidden="true" />
                                    </div>
                                    <div className="admin-header-user">
                                        <div className="admin-header-user-name">{user?.name || "Administrator"}</div>
                                        <div className="admin-header-user-role">Restaurant Admin</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="admin-content">
                        <Outlet />
                    </main>
                </div>
            </div>
    );
}

export default AdminLayout;
