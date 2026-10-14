import { useEffect } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../services/socket.js";
import { useAppDispatch, useAppSelector, } from "../../store/hooks";

import { fetchOrders } from "../../store/slices/orderSlice";
import type { OrderStatus } from "../../types/order.types";
import { formatStatus, getStatusPaymentClass } from "../../utils/commonFunction.js";

function Orders() {

    const dispatch = useAppDispatch();

    const { orders, loading, error, } = useAppSelector((state) => state.orders);

    console.log(orders, 'order from order page')

    useEffect(() => {

        dispatch(fetchOrders());

    }, [dispatch]);

    useEffect(() => {

        const handleStatusUpdated = (data: { orderId: number; status: OrderStatus; }) => {

            console.log("Order status updated:", data);

            dispatch(fetchOrders())

        };

        const handleRejectOrder = (data: { orderId: number; status: OrderStatus; }) => {

            console.log("Order status updated:", data);

            dispatch(fetchOrders())

        };

        socket.on("order:rejected", handleRejectOrder)
        socket.on("order:statusUpdated", handleStatusUpdated);

        return () => {
            socket.off("order:statusUpdated", handleStatusUpdated);
            socket.off("order:rejected", handleStatusUpdated)
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
                            justify-content-center mx-auto mb-4 foodhub-icon--90"
                        >
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
                        <div key={order.id} className="col-12">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden order-card">
                                <div className="card-body p-3 p-md-4">
                                    <div className="order-card-grid">

                                        {/* Order Information */}
                                        <div className="order-card-info">
                                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center foodhub-icon--50 order-card-icon">
                                                <i className="bi bi-receipt fs-4" />
                                            </div>

                                            <div className="min-w-0">
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

                                        {/* Items */}
                                        <div className="order-card-field">
                                            <small className="text-secondary d-block mb-2">
                                                Items
                                            </small>

                                            <div className="d-flex align-items-center gap-2 order-card-value">
                                                <i className="bi bi-basket text-primary" />
                                                <strong>{order.itemCount}</strong>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="order-card-field">
                                            <small className="text-secondary d-block mb-2">
                                                Total Amount
                                            </small>

                                            <strong className="fs-5 text-nowrap">
                                                ₹{Number(order.totalAmount).toFixed(2)}
                                            </strong>
                                        </div>

                                        {/* Order and Payment Status */}
                                        <div className="order-card-statuses">
                                            <div className="order-card-field">
                                                <small className="text-secondary d-block mb-2">
                                                    Order Status
                                                </small>

                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${getStatusPaymentClass(order.status)}`}
                                                >
                                                    {formatStatus(order.status)}
                                                </span>
                                            </div>

                                            <div className="order-card-field">
                                                <small className="text-secondary d-block mb-2">
                                                    Payment Status
                                                </small>

                                                <span
                                                    className={`badge rounded-pill px-3 py-2 ${getStatusPaymentClass(order.PaymentStatus)}`}
                                                >
                                                    {formatStatus(order.PaymentStatus)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="order-card-action">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="btn btn-outline-primary order-view-button"
                                            >
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

export default Orders;