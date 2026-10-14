import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { fetchAdminOrders, rejectUserOrder, updateAdminOrder, } from "../../store/slices/adminOrderSlice.js";
import { socket } from "../../services/socket.js";
import { formatStatus, getStatusPaymentClass } from "../../utils/commonFunction.js";
import ConfirmModal from "../../components/common/ConfirmModal.js";

function OrdersManagement() {

    const [showRejectModal, setShowRejectModal] = useState(false);

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");

    const [customRejectionReason, setCustomRejectionReason] = useState("");

    const [rejecting, setRejecting] = useState(false);

    const dispatch = useAppDispatch();

    const { orders, loading, error } = useAppSelector((state) => state.adminOrders);

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

            <div className="row g-4">
                {orders.map((order) => (

                    <div className="col-12" key={order.id} >

                        <div className="card border-0 shadow-sm rounded-4 admin-order-card">

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
                                                Customer order
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