import { useEffect } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../services/socket.js";
import { useAppDispatch, useAppSelector, } from "../../store/hooks";

import { fetchOrders } from "../../store/slices/orderSlice";
import type { OrderStatus } from "../../types/order.types";

function Orders() {

    const dispatch = useAppDispatch();

    const { orders, loading, error, } = useAppSelector((state) => state.orders);

    useEffect(() => {

        dispatch(fetchOrders());

    }, [dispatch]);

    useEffect(() => {

        const handleStatusUpdated = (data: { orderId: number; status: OrderStatus; }) => {

            console.log("Order status updated:", data);

            dispatch(fetchOrders())

        };

        socket.on("order:statusUpdated", handleStatusUpdated);

        return () => {
            socket.off("order:statusUpdated", handleStatusUpdated);
        };

    }, [dispatch]);

    if (loading) {
        return (
            <div className="container py-5">
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
                        Loading your orders...
                    </p>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">

                <div className="text-center py-5">

                    <i className="bi bi-exclamation-circle display-3 text-danger" />

                    <h3 className="mt-3 fw-bold">
                        Something went wrong
                    </h3>

                    <p className="text-secondary mb-0">
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>
                    <span className="badge text-bg-primary mb-3">
                        Your Orders
                    </span>

                    <h1 className="display-5 fw-bold mb-2">
                        My Orders
                    </h1>

                    <p className="text-secondary mb-0">
                        Track your current orders and view your order history.
                    </p>
                </div>

                <Link to="/menu" className="btn btn-primary" >
                    <i className="bi bi-plus-lg me-2" />
                    Order Food
                </Link>

            </div>

            {orders.length === 0 ?
                (<div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body text-center py-5 px-4">

                        <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center 
                            justify-content-center mx-auto mb-4"
                            style={{ width: "90px", height: "90px", }} >
                            <i className="bi bi-receipt fs-1" />
                        </div>

                        <h3 className="fw-bold mb-2">
                            No orders yet
                        </h3>

                        <p className="text-secondary mb-4">
                            You haven't placed any orders yet.
                            <br />
                            Browse our menu and order something delicious.
                        </p>

                        <Link
                            to="/menu"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-shop me-2" />
                            Browse Menu
                        </Link>

                    </div>

                </div>)
                :
                (<div className="row g-4">

                    {orders.map((order) => (
                        <div key={order.id} className="col-12" >
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                                <div className="card-body p-4">

                                    <div className="row align-items-center g-4">

                                        {/* Order Info */}
                                        <div className="col-md-3">

                                            <div className="d-flex align-items-center gap-3">

                                                <div className="bg-primary bg-opacity-10 text-primary rounded-3 
                                                    d-flex align-items-center justify-content-center"
                                                    style={{ width: "50px", height: "50px", }}                                                >
                                                    <i className="bi bi-receipt fs-4" />
                                                </div>

                                                <div>
                                                    <small className="text-secondary d-block">
                                                        Order
                                                    </small>

                                                    <h5 className="fw-bold mb-1">
                                                        #{order.id}
                                                    </h5>

                                                    <small className="text-secondary">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>

                                            </div>

                                        </div>

                                        {/* Items */}
                                        <div className="col-md-2 mt-4 mt-md-0">

                                            <small className="text-secondary d-block mb-1">
                                                Items
                                            </small>

                                            <div className="d-flex align-items-center gap-2">

                                                <i className="bi bi-basket text-primary" />

                                                <strong>
                                                    {order.itemCount}
                                                </strong>

                                            </div>

                                        </div>

                                        {/* Total */}
                                        <div className="col-md-2 mt-4 mt-md-0">

                                            <small className="text-secondary d-block mb-1">
                                                Total
                                            </small>

                                            <strong className="fs-5">
                                                ₹{Number(order.totalAmount).toFixed(2)}
                                            </strong>

                                        </div>

                                        {/* Status */}
                                        <div className="col-md-2 mt-4 mt-md-0">

                                            <small className="text-secondary d-block mb-2">
                                                Status
                                            </small>

                                            <span className={`badge rounded-pill px-3 py-2 ${getStatusClass(order.status)}`} >
                                                {formatStatus(order.status)}
                                            </span>

                                        </div>

                                        {/* Action */}
                                        <div className="col-md-3 mt-4 mt-md-0 text-md-end">

                                            <Link to={`/orders/${order.id}`} className="btn btn-outline-primary w-50 " >
                                                View Order
                                                <i className="bi bi-arrow-right ms-2" />
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>)
            }
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

export default Orders;