import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { logout } from "../store/slices/authSlice.js";
import NotificationBell from "../components/common/NotificationBell.js";

function PublicLayout() {

    const navigate = useNavigate();

    const user = useAppSelector((state) => state.auth.user);

    const cartItems = useAppSelector((state) => state.cart.items);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const dispatch = useAppDispatch();

    const handleLogout = async () => {

        await dispatch(logout());
        navigate("/home", { replace: true });

    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
                <div className="container">

                    {/* Brand */}
                    <NavLink
                        to="/home"
                        className="navbar-brand fw-bold fs-4"
                    >
                        Food<span className="text-primary">Hub</span>
                    </NavLink>

                    {/* Mobile toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    {/* Navbar content */}
                    <div className="collapse navbar-collapse" id="mainNavbar">
                        <div className="navbar-nav mx-auto gap-lg-3">
                            <NavLink
                                to="/home"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active fw-semibold" : ""
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/menu"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active fw-semibold" : ""
                                    }`
                                }
                            >
                                Menu
                            </NavLink>

                            {user && (
                                <>
                                    <NavLink
                                        to="/orders"
                                        className={({ isActive }) =>
                                            `nav-link ${isActive
                                                ? "active fw-semibold"
                                                : ""
                                            }`
                                        }
                                    >
                                        Orders
                                    </NavLink>
                                </>
                            )}
                        </div>

                        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">

                            {/* Cart */}
                            {user && (
                                <button
                                    type="button"
                                    className="btn btn-light position-relative"
                                    onClick={() => navigate("/cart")}
                                    aria-label="Cart"
                                >
                                    <i className="bi bi-cart3 fs-5" />

                                    {cartCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {/* Notifications */}
                            {user && <NotificationBell />}

                            {/* User */}
                            {user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                            }}
                                        >
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="fw-semibold d-none d-md-inline">
                                            {user.name}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-dark px-4"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <main className="flex-grow-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-top bg-light">
                <div className="container py-4">
                    <div className="row align-items-center">

                        <div className="col-md-6">
                            <span className="fw-bold">
                                Food<span className="text-primary">
                                    Hub
                                </span>
                            </span>

                            <span className="text-secondary ms-2">
                                Delicious food, made simple.
                            </span>
                        </div>

                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <span className="text-secondary small">
                                © {new Date().getFullYear()} FoodHub
                            </span>
                        </div>

                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;