import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { fetchAdminOrders, updateAdminOrder, } from "../../store/slices/adminOrderSlice.js";
import { socket } from "../../services/socket.js";

function OrdersManagement() {

    const dispatch = useAppDispatch();

    const { orders, loading, error } = useAppSelector((state) => state.adminOrders);

    useEffect(() => {

        dispatch(fetchAdminOrders());

    }, [dispatch]);

    useEffect(() => {

        const handleNewOrder = (data: { orderId: number }) => {
            console.log("New order received:", data);

            dispatch(fetchAdminOrders());
        };

        socket.on("order:new", handleNewOrder);

        return () => { socket.off("order:new", handleNewOrder); };

    }, [dispatch]);

    useEffect(() => {

        const handleOrderChange = () => { dispatch(fetchAdminOrders()); };

        socket.on("order:new", handleOrderChange);

        socket.on("order:statusUpdated", handleOrderChange);

        return () => {

            socket.off("order:new", handleOrderChange);

            socket.off("order:statusUpdated", handleOrderChange);

        };

    }, [dispatch]);

    const handleStatusChange = async (orderId: number,

        status: | "APPROVED" | "REJECTED" | "OUT_FOR_DELIVERY" | "DELIVERED") => {

        dispatch(updateAdminOrder({ orderId, data: { status }, }));
    };

    return (
        <div>

            {/* Header */}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                <div>

                    <span className="badge text-bg-primary mb-3">
                        Restaurant Orders
                    </span>

                    <h1 className="display-5 fw-bold mb-2">
                        Orders Management
                    </h1>

                    <p className="text-secondary mb-0">
                        Review customer orders and manage their status.
                    </p>

                </div>

                <div className="d-flex align-items-center gap-2">

                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: "48px", height: "48px", }} >
                        <i className="bi bi-receipt fs-5" />
                    </div>

                    <div>
                        <small className="text-secondary d-block">
                            Total Orders
                        </small>

                        <strong className="fs-5">
                            {orders.length}
                        </strong>
                    </div>

                </div>
            </div>

            {loading && (
                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="text-secondary mb-0">
                        Loading orders...
                    </p>

                </div>
            )}

            {error && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">

                    <div className="card-body text-center py-5">

                        <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center 
                            justify-content-center mx-auto mb-3"
                            style={{ width: "70px", height: "70px", }} >
                            <i className="bi bi-exclamation-circle fs-3" />
                        </div>

                        <h5 className="fw-bold mb-2">
                            Unable to load orders
                        </h5>

                        <p className="text-secondary mb-0">
                            {error}
                        </p>

                    </div>

                </div>
            )}

            {!loading && orders.length === 0 && !error && (
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body text-center py-5">

                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center 
                            justify-content-center mx-auto mb-4"
                            style={{ width: "90px", height: "90px", }} >
                            <i className="bi bi-receipt fs-1" />
                        </div>

                        <h4 className="fw-bold mb-2">
                            No orders yet
                        </h4>

                        <p className="text-secondary mb-0">
                            Customer orders will appear here once they are placed.
                        </p>

                    </div>

                </div>
            )}

            <div className="row g-4">
                {orders.map((order) => (

                    <div className="col-12" key={order.id} >

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4">

                                {/* Order Header */}

                                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">

                                    <div className="d-flex align-items-center gap-3">

                                        <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center 
                                            justify-content-center"
                                            style={{ width: "50px", height: "50px", }} >
                                            <i className="bi bi-receipt fs-4" />
                                        </div>

                                        <div>

                                            <h5 className="fw-bold mb-1">
                                                Order #{order.id}
                                            </h5>

                                            <small className="text-secondary">
                                                Customer order
                                            </small>

                                        </div>

                                    </div>

                                    <span className={`badge rounded-pill align-self-start px-3 py-2 ${getStatusClass(order.status)}`} >
                                        {formatStatus(order.status)}
                                    </span>

                                </div>


                                {/* Order Information */}

                                <div className="row g-4 mb-4">

                                    {/* Customer */}

                                    <div className="col-md-4">

                                        <div className="d-flex align-items-start gap-3">

                                            <i className="bi bi-person text-primary fs-5" />

                                            <div>

                                                <small className="text-secondary d-block">
                                                    Customer
                                                </small>

                                                <strong>
                                                    {order.user.name}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Email */}

                                    <div className="col-md-4">

                                        <div className="d-flex align-items-start gap-3">

                                            <i className="bi bi-envelope text-primary fs-5" />

                                            <div>

                                                <small className="text-secondary d-block">
                                                    Email
                                                </small>

                                                <span className="text-break">
                                                    {order.user.email}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Items */}

                                    <div className="col-sm-6 col-md-2">

                                        <div className="d-flex align-items-start gap-3">

                                            <i className="bi bi-basket text-primary fs-5" />

                                            <div>

                                                <small className="text-secondary d-block">
                                                    Items
                                                </small>

                                                <strong>
                                                    {order.itemCount}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Total */}

                                    <div className="col-sm-6 col-md-2">

                                        <div className="d-flex align-items-start gap-3">

                                            <i className="bi bi-currency-rupee text-primary fs-5" />

                                            <div>

                                                <small className="text-secondary d-block">
                                                    Total
                                                </small>

                                                <strong>
                                                    ₹ {Number(order.totalAmount).toFixed(2)}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                <hr className="my-4" />


                                {/* Actions */}

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                                    <small className="text-secondary">
                                        {order.status === "PENDING"
                                            ? "This order is waiting for approval."
                                            : order.status === "APPROVED"
                                                ? "This order is ready for delivery."
                                                : order.status === "OUT_FOR_DELIVERY"
                                                    ? "This order is currently out for delivery."
                                                    : order.status === "DELIVERED"
                                                        ? "This order has been delivered."
                                                        : order.status === "REJECTED"
                                                            ? "This order was rejected."
                                                            : ""
                                        }
                                    </small>


                                    <div className="d-flex gap-2 flex-wrap">

                                        {order.status === "PENDING" && (
                                            <>
                                                <button type="button" className="btn btn-success"
                                                    onClick={() => handleStatusChange(order.id, "APPROVED")} >
                                                    <i className="bi bi-check-lg me-2" />
                                                    Approve
                                                </button>

                                                <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => handleStatusChange(order.id, "REJECTED")} >
                                                    <i className="bi bi-x-lg me-2" />
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {order.status === "APPROVED" && (
                                            <button type="button" className="btn btn-primary"
                                                onClick={() => handleStatusChange(order.id, "OUT_FOR_DELIVERY")} >
                                                <i className="bi bi-bicycle me-2" />
                                                Out for Delivery
                                            </button>
                                        )}

                                        {order.status === "OUT_FOR_DELIVERY" && (
                                            <button type="button" className="btn btn-success"
                                                onClick={() => handleStatusChange(order.id, "DELIVERED")} >
                                                <i className="bi bi-check-circle me-2" />
                                                Mark Delivered
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}
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

export default OrdersManagement;