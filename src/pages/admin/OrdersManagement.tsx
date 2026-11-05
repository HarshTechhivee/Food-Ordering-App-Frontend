import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { fetchAdminOrders, rejectUserOrder, updateAdminOrder, } from "../../store/slices/adminOrderSlice.js";
import { socket } from "../../services/socket.js";
import { formatStatus, getStatusPaymentClass } from "../../utils/commonFunction.js";
import ConfirmModal from "../../components/common/ConfirmModal.js";
import type { OrderStatus } from "../../types/order.types.js";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPageItems(totalPages: number, activePage: number): PageItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (activePage <= 2) {
        return [1, 2, 3, "ellipsis-right", totalPages];
    }

    if (activePage >= totalPages - 1) {
        return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis-left", activePage - 1, activePage, activePage + 1, "ellipsis-right", totalPages];
}

function OrdersManagement() {

    const [showRejectModal, setShowRejectModal] = useState(false);

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");

    const [customRejectionReason, setCustomRejectionReason] = useState("");

    const [rejecting, setRejecting] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useAppDispatch();

    const { orders, loading, error } = useAppSelector((state) => state.adminOrders);
    const pageSize = 5;
    const filteredOrders = orders.filter((order) => {
        const query = search.trim().toLocaleLowerCase();
        const matchesSearch = !query || [
            String(order.id),
            order.user.name,
            order.user.email,
            formatStatus(order.status),
        ].some((value) => value.toLocaleLowerCase().includes(query));

        return matchesSearch && (statusFilter === "ALL" || order.status === statusFilter);
    });
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const activePage = Math.min(currentPage, Math.max(totalPages, 1));
    const visibleOrders = filteredOrders.slice((activePage - 1) * pageSize, activePage * pageSize);

    useEffect(() => {

        dispatch(fetchAdminOrders());

    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAdminOrders());

        const handleOrdersChanged = () => {
            dispatch(fetchAdminOrders());
        };

        socket.on("order:new", handleOrdersChanged);
        socket.on("order:cancelled", handleOrdersChanged);
        socket.on("order:statusUpdated", handleOrdersChanged);

        return () => {
            socket.off("order:new", handleOrdersChanged);
            socket.off("order:cancelled", handleOrdersChanged);
            socket.off("order:statusUpdated", handleOrdersChanged);
        };
    }, [dispatch]);

    const handleStatusChange = async (orderId: number,

        status: | "APPROVED" | "REJECTED" | "OUT_FOR_DELIVERY" | "DELIVERED") => {

        dispatch(updateAdminOrder({ orderId, data: { status }, }));
    };


    const openRejectModal = (orderId: number) => {

        setSelectedOrderId(orderId);
        setRejectionReason("");
        setCustomRejectionReason("");
        setShowRejectModal(true);

    };

    const handleRejectOrder = async () => {

        if (!selectedOrderId || rejecting) {
            return;
        }

        const reason = rejectionReason === "OTHER" ? customRejectionReason.trim() : rejectionReason.trim();

        if (reason.length < 3 || reason.length > 500) {
            return;
        }

        try {
            setRejecting(true);

            await dispatch(
                rejectUserOrder({
                    orderId: selectedOrderId,
                    rejectionReason: reason,
                })
            ).unwrap();

            setShowRejectModal(false);
            setSelectedOrderId(null);
            setRejectionReason("");
            setCustomRejectionReason("");

            await dispatch(fetchAdminOrders()).unwrap();
        } catch (error) {
            console.error("Failed to reject order:", error);
        } finally {
            setRejecting(false);
        }
    };


    return (
        <div className="admin-page admin-orders-page">

            {/* Header */}

            <div className="admin-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

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

                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center foodhub-icon--48">
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

            <section className="card admin-orders-toolbar" aria-label="Filter orders">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-7">
                            <label className="form-label" htmlFor="admin-order-search">
                                Search orders
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white" aria-hidden="true">
                                    <i className="bi bi-search" />
                                </span>
                                <input
                                    id="admin-order-search"
                                    type="search"
                                    className="form-control"
                                    placeholder="Order number, customer or email"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-sm-7 col-md-3">
                            <label className="form-label" htmlFor="admin-order-status">
                                Order status
                            </label>
                            <select
                                id="admin-order-status"
                                className="form-select"
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value as "ALL" | OrderStatus);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ALL">All statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-5 col-md-2 d-flex justify-content-md-end">
                            <span className="admin-orders-count" aria-live="polite">
                                <i className="bi bi-list-check" aria-hidden="true" />
                                {filteredOrders.length} shown
                            </span>
                        </div>
                    </div>
                </div>
            </section>

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
                            justify-content-center mx-auto mb-3 foodhub-icon--70">
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
                            justify-content-center mx-auto mb-4 foodhub-icon--90">
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

            {!loading && orders.length > 0 && filteredOrders.length === 0 && !error && (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 foodhub-icon--70">
                            <i className="bi bi-search fs-3" />
                        </div>
                        <h2 className="h5 fw-bold mb-2">No matching orders</h2>
                        <p className="text-secondary mb-3">Try a different search or status filter.</p>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("ALL");
                                setCurrentPage(1);
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            )}

            {!loading && filteredOrders.length > 0 && (
                <div className="admin-orders-table-wrap">
                    <table className="table admin-orders-table">
                        <caption className="visually-hidden">Customer orders and available status actions</caption>
                        <thead>
                            <tr>
                                <th scope="col">Order #</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Items</th>
                                <th scope="col">Total</th>
                                <th scope="col">Status</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleOrders.map((order) => (
                                <Fragment key={order.id}>
                                    <tr>
                                        <th scope="row">#{order.id}</th>
                                        <td>
                                            <span className="admin-order-customer">{order.user.name}</span>
                                            <small>{order.user.email}</small>
                                        </td>
                                        <td>{order.itemCount} {order.itemCount === 1 ? "item" : "items"}</td>
                                        <td className="admin-order-table-total">₹{Number(order.totalAmount).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge rounded-pill admin-order-status ${getStatusPaymentClass(order.status)}`}>
                                                {formatStatus(order.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-order-table-actions">
                                                {order.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="admin-order-icon-action is-approve"
                                                            onClick={() => handleStatusChange(order.id, "APPROVED")}
                                                            aria-label={`Approve order ${order.id}`}
                                                            title="Approve order"
                                                        >
                                                            <i className="bi bi-check-lg" aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-order-icon-action is-reject"
                                                            onClick={() => openRejectModal(order.id)}
                                                            aria-label={`Reject order ${order.id}`}
                                                            title="Reject order"
                                                        >
                                                            <i className="bi bi-x-lg" aria-hidden="true" />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === "APPROVED" && (
                                                    <button
                                                        type="button"
                                                        className="admin-order-icon-action is-advance"
                                                        onClick={() => handleStatusChange(order.id, "OUT_FOR_DELIVERY")}
                                                        aria-label={`Mark order ${order.id} out for delivery`}
                                                        title="Mark out for delivery"
                                                    >
                                                        <i className="bi bi-bicycle" aria-hidden="true" />
                                                    </button>
                                                )}
                                                {order.status === "OUT_FOR_DELIVERY" && (
                                                    <button
                                                        type="button"
                                                        className="admin-order-icon-action is-approve"
                                                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                                        aria-label={`Mark order ${order.id} delivered`}
                                                        title="Mark delivered"
                                                    >
                                                        <i className="bi bi-check-lg" aria-hidden="true" />
                                                    </button>
                                                )}
                                                {order.status !== "PENDING" &&
                                                    order.status !== "APPROVED" &&
                                                    order.status !== "OUT_FOR_DELIVERY" && (
                                                        <span className="admin-order-no-action" aria-label="No actions available">—</span>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                    {(order.status === "CANCELLED" && order.cancellationReason) ||
                                        (order.status === "REJECTED" && order.rejectionReason) ? (
                                        <tr className="admin-order-reason-row">
                                            <td colSpan={6}>
                                                <strong>
                                                    {order.status === "CANCELLED"
                                                        ? "Customer cancellation reason:"
                                                        : "Rejection reason:"}
                                                </strong>{" "}
                                                {order.status === "CANCELLED"
                                                    ? order.cancellationReason
                                                    : order.rejectionReason}
                                            </td>
                                        </tr>
                                    ) : null}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="row g-4 admin-orders-mobile-cards">
                {visibleOrders.map((order) => (

                    <div className="col-12" key={order.id} >

                        <div className="card border-0 shadow-sm rounded-4 admin-order-card" data-order-status={order.status}>

                            <div className="card-body p-3 p-md-4">

                                {/* Order Header */}

                                <div className="d-flex align-items-center justify-content-between gap-2 mb-3 admin-order-header">

                                    <div className="d-flex align-items-center gap-3">

                                        <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center 
                                            justify-content-center foodhub-icon--50 admin-order-icon">
                                            <i className="bi bi-receipt fs-4" />
                                        </div>

                                        <div>

                                            <h5 className="fw-bold mb-1">
                                                Order #{order.id}
                                            </h5>

                                            <small className="text-secondary">
                                                {new Date(order.createdAt).toLocaleString(undefined, {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </small>

                                        </div>

                                    </div>

                                    <span className={`badge rounded-pill px-3 py-2 admin-order-status ${getStatusPaymentClass(order.status)}`} >
                                        {formatStatus(order.status)}
                                    </span>

                                </div>


                                {/* Order Information */}

                                <div className="row g-3 mb-3 admin-order-info">

                                    {/* Customer */}

                                    <div className="col-12 col-md-6 col-lg-3">

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

                                    <div className="col-12 col-md-6 col-lg-3">

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

                                    <div className="col-6 col-md-6 col-lg-3">

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

                                    <div className="col-6 col-md-6 col-lg-3">

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

                                {(order.status === "CANCELLED" && order.cancellationReason) ||
                                    (order.status === "REJECTED" && order.rejectionReason) ? (
                                    <div className="alert alert-danger border rounded-3 mt-2 mb-0">
                                        <div className="fw-semibold mb-1">
                                            <i className="bi bi-info-circle me-2 text-primary" />
                                            {order.status === "CANCELLED"
                                                ? "Customer cancellation reason"
                                                : "Rejection reason"}
                                        </div>

                                        <p className="mb-0 text-secondary">
                                            {order.status === "CANCELLED"
                                                ? order.cancellationReason
                                                : order.rejectionReason}
                                        </p>
                                    </div>
                                ) : null}


                                <hr className="my-3" />


                                {/* Actions */}

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 admin-order-footer">

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


                                    <div className="d-flex gap-2 flex-wrap admin-order-actions">

                                        {order.status === "PENDING" && (
                                            <>
                                                <button type="button" className="btn btn-success"
                                                    onClick={() => handleStatusChange(order.id, "APPROVED")} >
                                                    <i className="bi bi-check-lg me-2" />
                                                    Approve
                                                </button>

                                                <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => openRejectModal(order.id)} >
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

            {totalPages > 1 && (
                <nav className="admin-orders-pagination" aria-label="Orders management pagination">
                    <span>Page {activePage} of {totalPages}</span>
                    <div className="admin-orders-pagination-controls">
                        <button
                            type="button"
                            aria-label="Previous page"
                            disabled={activePage === 1}
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        >
                            <i className="bi bi-chevron-left" aria-hidden="true" />
                        </button>
                        {getPageItems(totalPages, activePage).map((item) =>
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
                                <span key={item} className="admin-orders-pagination-ellipsis" aria-hidden="true">…</span>
                            )
                        )}
                        <button
                            type="button"
                            aria-label="Next page"
                            disabled={activePage === totalPages}
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        >
                            <i className="bi bi-chevron-right" aria-hidden="true" />
                        </button>
                    </div>
                </nav>
            )}


            <ConfirmModal
                show={showRejectModal}
                centered
                title={`Reject Order #${selectedOrderId}`}
                icon="bi-exclamation-triangle"
                confirmIcon="bi-x-circle"
                confirmText="Confirm Rejection"
                cancelText="Go Back"
                loadingText="Rejecting..."
                confirmButtonClassName="btn-danger rounded-3 py-2"
                onConfirm={handleRejectOrder}
                onCancel={() => setShowRejectModal(false)}
                loading={rejecting}
                confirmDisabled={
                    !rejectionReason ||
                    (
                        rejectionReason === "OTHER" &&
                        (
                            customRejectionReason.trim().length < 3 ||
                            customRejectionReason.trim().length > 500
                        )
                    )
                }
            >
                <div className="text-center mb-4">
                    <p className="text-secondary mb-0">
                        Please select a reason for rejecting this order.
                        The customer will be able to see it.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="rejectionReason"
                        className="form-label fw-semibold"
                    >
                        Reason for rejection
                    </label>

                    <select
                        id="rejectionReason"
                        className="form-select rounded-3 py-2"
                        value={rejectionReason}
                        onChange={(event) => {
                            setRejectionReason(event.target.value);
                            setCustomRejectionReason("");
                        }}
                        disabled={rejecting}
                    >
                        <option value="">Select a reason</option>
                        <option value="Some items are unavailable">
                            Some items are unavailable
                        </option>
                        <option value="The restaurant is too busy to process this order">
                            The restaurant is too busy
                        </option>
                        <option value="We cannot deliver to the customer's location">
                            We cannot deliver to this location
                        </option>
                        <option value="OTHER">Other reason</option>
                    </select>

                    {rejectionReason === "OTHER" && (
                        <div className="mt-3">
                            <label
                                htmlFor="customRejectionReason"
                                className="form-label fw-semibold"
                            >
                                Tell us the reason
                            </label>

                            <textarea
                                id="customRejectionReason"
                                className="form-control rounded-3"
                                rows={3}
                                maxLength={500}
                                placeholder="Enter the reason (3–500 characters)"
                                value={customRejectionReason}
                                onChange={(event) =>
                                    setCustomRejectionReason(event.target.value)
                                }
                                disabled={rejecting}
                            />

                            <div className="text-end small text-secondary mt-1">
                                {customRejectionReason.length}/500
                            </div>
                        </div>
                    )}
                </div>
            </ConfirmModal>

        </div>
    );
}

export default OrdersManagement;