import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logout } from "../store/slices/authSlice.js";
import NotificationBell from "../components/common/NotificationBell.js";
import PushNotificationPrompt from "../components/common/PushNotificationPrompt.js";

function PublicLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = useAppSelector((state) => state.auth.user);
    const cartItems = useAppSelector((state) => state.cart.items);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const closeMobileNavbar = () => setMobileMenuOpen(false);

    const handleLogout = async () => {
        closeMobileNavbar();
        await dispatch(logout());
        navigate("/home", { replace: true });
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link ${isActive ? "active fw-semibold" : ""}`;

    const handleCartClick = () => {
        closeMobileNavbar();
        navigate("/cart");
    };

    const handleLoginClick = () => {
        closeMobileNavbar();
        navigate("/login");
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {user && <PushNotificationPrompt userKey={user.email} />}

            <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top public-navbar">
                <div className="container public-navbar-inner">
                    {/* Brand */}
                    <NavLink
                        to="/home"
                        className="navbar-brand fw-bold fs-4 public-navbar-brand"
                        onClick={closeMobileNavbar}
                    >
                        Food<span className="text-primary">Hub</span>
                    </NavLink>

                    {/* Desktop navigation stays horizontal */}
                    <div className="navbar-nav mx-auto gap-lg-3 public-navbar-links">
                        <NavLink to="/home" end className={navLinkClass} onClick={closeMobileNavbar}>
                            Home
                        </NavLink>
                        <NavLink to="/menu" className={navLinkClass} onClick={closeMobileNavbar}>
                            Menu
                        </NavLink>
                        {user && (
                            <NavLink to="/orders" className={navLinkClass} onClick={closeMobileNavbar}>
                                Orders
                            </NavLink>
                        )}
                    </div>

                    {/* Header actions: desktop layout remains horizontal; mobile moves these beside the brand */}
                    <div className="d-flex align-items-center gap-2 gap-lg-3 public-navbar-actions">
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-light position-relative cart-button"
                                    onClick={handleCartClick}
                                    aria-label="Cart"
                                >
                                    <i className="bi bi-cart3 fs-5" />
                                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                                </button>

                                <NotificationBell />

                                <div className="d-flex align-items-center gap-2 public-navbar-user-info">
                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center foodhub-icon--38 public-navbar-avatar">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="fw-semibold d-none d-lg-inline public-navbar-user-name">
                                        {user.name}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm public-navbar-logout"
                                    onClick={handleLogout}
                                    aria-label="Logout"
                                    title="Logout"
                                >
                                    <i className="bi bi-box-arrow-right me-lg-1" />
                                    <span className="d-none d-lg-inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn btn-dark px-4" onClick={handleLoginClick}>
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        className="btn public-navbar-toggler d-lg-none"
                        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-controls="publicMobileNavbar"
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen((open) => !open)}
                    >
                        <i className={`bi ${mobileMenuOpen ? "bi-x-lg" : "bi-list"} fs-4`} />
                    </button>

                    {/* Mobile vertical navigation panel. It stays open while the page scrolls. */}
                    <div
                        id="publicMobileNavbar"
                        className={`public-mobile-menu d-lg-none ${mobileMenuOpen ? "is-open" : ""}`}
                        aria-hidden={!mobileMenuOpen}
                    >
                        <div className="public-mobile-menu-heading">NAVIGATION</div>
                        <nav className="nav flex-column gap-2">
                            <NavLink to="/home" end className={navLinkClass} onClick={closeMobileNavbar}>
                                <i className="bi bi-house-door me-3" />
                                <span>Home</span>
                            </NavLink>
                            <NavLink to="/menu" className={navLinkClass} onClick={closeMobileNavbar}>
                                <i className="bi bi-egg-fried me-3" />
                                <span>Menu</span>
                            </NavLink>
                            {user && (
                                <NavLink to="/orders" className={navLinkClass} onClick={closeMobileNavbar}>
                                    <i className="bi bi-receipt me-3" />
                                    <span>Orders</span>
                                </NavLink>
                            )}
                        </nav>
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <footer className="border-top bg-light">
                <div className="container py-2">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="fw-bold">Food<span className="text-primary">Hub</span></span>
                            <span className="text-secondary ms-2">Delicious food, made simple.</span>
                        </div>
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <span className="text-secondary small">© {new Date().getFullYear()} FoodHub</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;
