import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../../services/socket.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOrders } from "../../store/slices/orderSlice";
import type { OrderStatus } from "../../types/order.types";
import {
    formatStatus,
    getStatusPaymentClass,
} from "../../utils/commonFunction.js";
import "./Orders.css";

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

function getPaginationItems(totalPages: number, activePage: number): PaginationItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (activePage <= 2) {
        return [1, 2, 3, "ellipsis-right", totalPages];
    }

    if (activePage >= totalPages - 1) {
        return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        1,
        "ellipsis-left",
        activePage - 1,
        activePage,
        activePage + 1,
        "ellipsis-right",
        totalPages,
    ];
}

function Orders() {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.orders);
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter((order) => order.status === statusFilter);
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const activePage = Math.min(currentPage, Math.max(totalPages, 1));
    const visibleOrders = filteredOrders.slice(
        (activePage - 1) * pageSize,
        activePage * pageSize
    );

    useEffect(() => {
        const handleStatusUpdated = (data: {
            orderId: number;
            status: OrderStatus;
        }) => {
            console.log("Order status updated:", data);
            dispatch(fetchOrders());
        };

        const handleRejectOrder = (data: {
            orderId: number;
            status: OrderStatus;
        }) => {
            console.log("Order status updated:", data);
            dispatch(fetchOrders());
        };

        socket.on("order:rejected", handleRejectOrder);
        socket.on("order:statusUpdated", handleStatusUpdated);

        return () => {
            socket.off("order:statusUpdated", handleStatusUpdated);
            socket.off("order:rejected", handleRejectOrder);
        };
    }, [dispatch]);

    if (loading) {
        return (
            <main className="fh-orders-page">
                <div className="container fh-orders-state-wrap">
                    <div className="fh-orders-state" role="status" aria-live="polite">
                        <span className="fh-orders-spinner" aria-hidden="true" />
                        <h1>Loading your orders</h1>
                        <p>Your FoodHub order history will be right here.</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="fh-orders-page">
                <div className="container fh-orders-state-wrap">
                    <div className="fh-orders-state fh-orders-state--error" role="alert">
                        <span className="fh-orders-state-icon" aria-hidden="true">
                            <i className="bi bi-exclamation-circle" />
                        </span>
                        <h1>We couldn’t load your orders.</h1>
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="fh-orders-page">
            <div className="container fh-orders-container">
                <header className="fh-orders-header">
                    <div className="fh-orders-title">
                        <span className="fh-orders-title-icon" aria-hidden="true">
                            <i className="bi bi-box-seam" />
                        </span>
                        <div>
                        <span className="fh-orders-eyebrow">YOUR FOODHUB JOURNEY</span>
                        <h1>My Orders</h1>
                        <p>All your past and current orders, together in one place.</p>
                        </div>
                    </div>
                    <Link to="/menu" className="foodhub-button-primary">
                        <i className="bi bi-plus-lg" aria-hidden="true" />
                        Order food
                    </Link>
                </header>

                {orders.length === 0 ? (
                    <section className="fh-orders-empty">
                        <span className="fh-orders-state-icon" aria-hidden="true">
                            <i className="bi bi-receipt" />
                        </span>
                        <span className="fh-orders-eyebrow">ORDER HISTORY</span>
                        <h2>No orders just yet.</h2>
                        <p>
                            When you place an order, its details and status will
                            appear here.
                        </p>
                        <Link to="/menu" className="foodhub-button-primary">
                            <i className="bi bi-shop" aria-hidden="true" />
                            Browse the menu
                        </Link>
                    </section>
                ) : (
                    <section className="fh-orders-list" aria-label="Your orders">
                        <nav className="fh-order-filters" aria-label="Filter orders by status">
                            {([
                                ["ALL", "All Orders"],
                                ["PENDING", "Pending"],
                                ["APPROVED", "Approved"],
                                ["OUT_FOR_DELIVERY", "Out for Delivery"],
                                ["DELIVERED", "Delivered"],
                                ["CANCELLED", "Cancelled"],
                                ["REJECTED", "Rejected"],
                            ] as const).map(([status, label]) => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`fh-order-filter ${statusFilter === status ? "is-active" : ""}`}
                                    aria-pressed={statusFilter === status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>

                        <div className="fh-orders-list-heading">
                            <h2>{statusFilter === "ALL" ? "Order history" : `${formatStatus(statusFilter)} orders`}</h2>
                            <span>
                                {filteredOrders.length}{" "}
                                {filteredOrders.length === 1 ? "order" : "orders"}
                            </span>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="fh-orders-filter-empty">
                                <i className="bi bi-inbox" aria-hidden="true" />
                                <strong>No {formatStatus(statusFilter).toLowerCase()} orders</strong>
                                <span>Orders with this status will appear here.</span>
                            </div>
                        ) : visibleOrders.map((order) => (
                            <article className="fh-order-card" key={order.id}>
                                <div className="fh-order-main">
                                    <span className="fh-order-icon" aria-hidden="true">
                                        <i className="bi bi-receipt-cutoff" />
                                    </span>
                                    <div className="fh-order-reference">
                                        <h3>#{order.id}</h3>
                                        <time dateTime={order.createdAt}>
                                            {new Date(order.createdAt).toLocaleString(
                                                undefined,
                                                {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                }
                                            )}
                                        </time>
                                    </div>
                                </div>

                                <div className="fh-order-facts">
                                    <div className="fh-order-fact">
                                        <span>Items</span>
                                        <strong>
                                            <i className="bi bi-basket" aria-hidden="true" />
                                            {order.itemCount}
                                        </strong>
                                    </div>

                                    <div className="fh-order-fact">
                                        <span>Total amount</span>
                                        <strong className="fh-order-total">
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="fh-order-statuses">
                                    <span
                                        className={`badge rounded-pill px-3 py-2 ${getStatusPaymentClass(order.status)}`}
                                    >
                                        {formatStatus(order.status)}
                                    </span>
                                </div>

                                <Link
                                    to={`/orders/${order.id}`}
                                    className="fh-order-view"
                                >
                                    View Details
                                    <i className="bi bi-arrow-right" aria-hidden="true" />
                                </Link>
                            </article>
                        ))}

                        {totalPages > 1 && (
                            <nav className="fh-orders-pagination" aria-label="Order history pagination">
                                <span className="fh-orders-pagination-page-info">
                                    Page {activePage} of {totalPages}
                                </span>
                                <div className="fh-orders-pagination-controls">
                                    <button
                                        type="button"
                                        aria-label="Previous page"
                                        disabled={activePage === 1}
                                        onClick={() => setCurrentPage((page) => Math.max(1, Math.min(totalPages, page) - 1))}
                                    >
                                        <i className="bi bi-chevron-left" aria-hidden="true" />
                                        <span className="fh-orders-pagination-button-label">Previous</span>
                                    </button>
                                    <div className="fh-orders-pagination-pages">
                                        {getPaginationItems(totalPages, activePage).map((item) =>
                                            typeof item === "number" ? (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    aria-label={`Page ${item}`}
                                                    aria-current={item === activePage ? "page" : undefined}
                                                    className={item === activePage ? "is-active" : ""}
                                                    onClick={() => setCurrentPage(item)}
                                                >
                                                    {item}
                                                </button>
                                            ) : (
                                                <span key={item} className="fh-orders-pagination-ellipsis" aria-hidden="true">
                                                    …
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Next page"
                                        disabled={activePage === totalPages}
                                        onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(totalPages, page) + 1))}
                                    >
                                        <span className="fh-orders-pagination-button-label">Next</span>
                                        <i className="bi bi-chevron-right" aria-hidden="true" />
                                    </button>
                                </div>
                                <span className="fh-orders-pagination-mobile-info">
                                    Page {activePage} of {totalPages}
                                </span>
                            </nav>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}

export default Orders;
