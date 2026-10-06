import { useEffect } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../../components/common/NotificationBell";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminDashboard } from "../../store/slices/adminDashboardSlice";
import { socket } from "../../services/socket.js";

function AdminDashboard() {

    const dispatch = useAppDispatch();

    const { stats, loading, error, } = useAppSelector((state) => state.adminDashboard);

    useEffect(() => {

        dispatch(fetchAdminDashboard());

    }, [dispatch]);

    useEffect(() => {

        const handleOrderChange = () => {

            dispatch(fetchAdminDashboard());

        };

        socket.on("order:new", handleOrderChange);

        socket.on("order:statusUpdated", handleOrderChange);

        return () => {

            socket.off("order:new", handleOrderChange);

            socket.off("order:statusUpdated", handleOrderChange);

        };

    }, [dispatch]);

    return (
        <div>

            {/* Header */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                <div>
                    <span className="badge text-bg-primary mb-2">
                        Admin Panel
                    </span>

                    <h2 className="display-6 fw-bold mb-1">
                        Dashboard
                    </h2>

                    <p className="text-secondary mb-0">
                        Overview of your restaurant activity.
                    </p>
                </div>

                <NotificationBell />

            </div>

            {error && (
                <div className="alert alert-danger rounded-4 mb-4">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                </div>
            )}


            {/* Statistics */}

            <div className="row g-4">

                {/* Total Orders */}

                <div className="col-sm-6 col-xl-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-secondary mb-2">
                                        Total Orders
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {loading ? "..." : stats?.totalOrders ?? 0}
                                    </h2>
                                </div>

                                <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center 
                                    justify-content-center"
                                    style={{ width: "48px", height: "48px", }} >
                                    <i className="bi bi-receipt fs-5" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Pending Orders */}

                <div className="col-sm-6 col-xl-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-secondary mb-2">
                                        Pending Orders
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {loading ? "..." : stats?.pendingOrders ?? 0}
                                    </h2>
                                </div>

                                <div className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center 
                                    justify-content-center"
                                    style={{ width: "48px", height: "48px", }} >
                                    <i className="bi bi-clock-history fs-5" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Menu Items */}

                <div className="col-sm-6 col-xl-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-secondary mb-2">
                                        Menu Items
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {loading ? "..." : stats?.menuItems ?? 0}
                                    </h2>
                                </div>

                                <div className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center 
                                    justify-content-center"
                                    style={{ width: "48px", height: "48px", }} >
                                    <i className="bi bi-menu-button-wide fs-5" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Revenue */}

                <div className="col-sm-6 col-xl-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start">

                                <div>
                                    <p className="text-secondary mb-2">
                                        Total Revenue
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {loading ? "..." : `₹ ${Number(stats?.totalOrderValue ?? 0).toFixed(2)}`}
                                    </h2>
                                </div>

                                <div className="bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center 
                                    justify-content-center"
                                    style={{ width: "48px", height: "48px", }} >
                                    <i className="bi bi-currency-rupee fs-5" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row g-4 mt-1">

                {/* Order Overview */}

                <div className="col-lg-5">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="mb-4">
                                <h5 className="fw-bold mb-1">
                                    Order Overview
                                </h5>

                                <p className="text-secondary small mb-0">
                                    Current order status breakdown
                                </p>
                            </div>

                            <div className="d-flex flex-column gap-4">

                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <span className="badge text-bg-warning me-2">
                                            {stats?.orderStatus.PENDING ?? 0}
                                        </span>
                                        Pending
                                    </span>

                                    <i className="bi bi-clock-history text-warning" />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <span className="badge text-bg-primary me-2">
                                            {stats?.orderStatus.APPROVED ?? 0}
                                        </span>
                                        Approved
                                    </span>

                                    <i className="bi bi-check-circle text-primary" />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <span className="badge text-bg-info me-2">
                                            {stats?.orderStatus.OUT_FOR_DELIVERY ?? 0}
                                        </span>
                                        Out for Delivery
                                    </span>

                                    <i className="bi bi-bicycle text-info" />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <span className="badge text-bg-success me-2">
                                            {stats?.orderStatus.DELIVERED ?? 0}
                                        </span>
                                        Delivered
                                    </span>

                                    <i className="bi bi-house-check text-success" />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <span className="badge text-bg-danger me-2">
                                            {stats?.orderStatus.REJECTED ?? 0}
                                        </span>
                                        Rejected
                                    </span>

                                    <i className="bi bi-x-circle text-danger" />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Recent Orders */}

                <div className="col-lg-7">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div>
                                    <h5 className="fw-bold mb-1">
                                        Recent Orders
                                    </h5>

                                    <p className="text-secondary small mb-0">
                                        Latest orders placed by customers
                                    </p>
                                </div>

                                <Link
                                    to="/admin/orders"
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    View All
                                    <i className="bi bi-arrow-right ms-2" />
                                </Link>

                            </div>

                            <div className="d-flex flex-column gap-3">

                                {stats?.recentOrders.map((order) => (

                                    <div key={order.id} className="d-flex align-items-center justify-content-between p-3 bg-light 
                                        rounded-3" >
                                        <div>

                                            <div className="fw-semibold">
                                                Order #{order.id}
                                            </div>

                                            <small className="text-secondary">
                                                {order.user.name}
                                                {" • "}
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </small>

                                        </div>

                                        <div className="text-end">

                                            <div className="fw-semibold mb-1">
                                                ₹ {Number(order.totalAmount).toFixed(2)}
                                            </div>

                                            <span className={`badge rounded-pill ${getStatusClass(order.status)}`} >
                                                {formatStatus(order.status)}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                                {stats?.recentOrders.length === 0 && (
                                    <div className="text-center py-4 text-secondary">
                                        No orders yet.
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


function formatStatus(status: string): string {

    return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClass(status: string): string {

    switch (status) {
        case "PENDING":
            return "text-bg-warning";

        case "APPROVED":
            return "text-bg-primary";

        case "OUT_FOR_DELIVERY":
            return "text-bg-info";

        case "DELIVERED":
            return "text-bg-success";

        case "REJECTED":
            return "text-bg-danger";

        default:
            return "text-bg-secondary";
    }
}

export default AdminDashboard;