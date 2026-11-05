import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { socket } from "../../services/socket.js";
import { useAppDispatch, useAppSelector, } from "../../store/hooks";
import { cancelOrder } from "../../services/order.api";
import { fetchOrderById, clearSelectedOrder, clearOrderError, } from "../../store/slices/orderSlice";
import type { OrderStatus } from "../../types/order.types.js";
import { formatStatus, getStatusPaymentClass } from "../../utils/commonFunction.js";
import ConfirmModal from "../../components/common/ConfirmModal.js";
import { getMenuImageSrc } from "../../utils/menuImage";
import OrderReviewSection from "../../components/common/OrderReviewSection.js";
import "./OrderDetails.css";

function OrderDetails() {

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [cancelling, setCancelling] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cancellationReason, setCancellationReason] = useState("");

    const [customCancellationReason, setCustomCancellationReason] = useState("");

    const { selectedOrder, loading, error, } = useAppSelector((state) => state.orders);

    const handleCancelOrder = async () => {
        if (!id || cancelling) {
            return;
        }

        const reason = cancellationReason === "OTHER" ? customCancellationReason.trim() : cancellationReason.trim();

        if (reason.length < 3 || reason.length > 500) {
            return;
        }

        try {
            setCancelling(true);

            await cancelOrder(Number(id), reason);

            await dispatch(fetchOrderById(Number(id))).unwrap();

            setShowCancelModal(false);
            setCancellationReason("");
            setCustomCancellationReason("");

        } catch (error) {

            console.error("Failed to cancel order:", error);
            alert("Unable to cancel the order. Please try again.");

        } finally {
            setCancelling(false);
        }
    };



    useEffect(() => {

        if (!id) {
            navigate("/orders");
            return;
        }

        const orderId = Number(id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            navigate("/orders");
            return;
        }

        dispatch(fetchOrderById(orderId));

        return () => {
            dispatch(clearSelectedOrder());
            dispatch(clearOrderError());
        };

    }, [id, dispatch, navigate]);


    useEffect(() => {

        const handleStatusUpdated = (data: { orderId: number; status: OrderStatus; }) => {

            if (data.orderId !== Number(id)) {
                return;
            }

            console.log("Current order status updated:", data);

            dispatch(fetchOrderById(Number(id)));
        };

        socket.on("order:statusUpdated", handleStatusUpdated);

        return () => {
            socket.off("order:statusUpdated", handleStatusUpdated);
        };
    }, [dispatch, id]);

    useEffect(() => {

        if (
            !selectedOrder ||
            selectedOrder.status !== "CANCELLED" ||
            selectedOrder.paymentStatus !== "PAID"
        ) {
            return;
        }

        const interval = window.setInterval(() => {
            dispatch(fetchOrderById(Number(id)));
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };

    }, [
        selectedOrder,
        id,
        dispatch,
    ]);

    if (loading) {
        return (
            <div className="container py-5 fh-order-details">

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
                        Loading your order...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 fh-order-details">

                <div className="text-center py-5">

                    <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center 
                        justify-content-center mx-auto mb-4 foodhub-icon--90">
                        <i className="bi bi-exclamation-circle fs-1" />
                    </div>

                    <h3 className="fw-bold mb-2">
                        Unable to load order
                    </h3>

                    <p className="text-secondary mb-4">
                        {error}
                    </p>

                    <Link to="/orders" className="btn btn-outline-primary" >
                        <i className="bi bi-arrow-left me-2" />
                        Back to Orders
                    </Link>

                </div>

            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="container py-5 fh-order-details">

                <div className="text-center py-5">

                    <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center 
                        justify-content-center mx-auto mb-4 foodhub-icon--90">
                        <i className="bi bi-receipt fs-1" />
                    </div>

                    <h3 className="fw-bold mb-2">
                        Order not found
                    </h3>

                    <p className="text-secondary mb-4">
                        We couldn't find the order you're looking for.
                    </p>

                    <Link to="/orders" className="btn btn-primary" >
                        <i className="bi bi-arrow-left me-2" />
                        Back to Orders
                    </Link>

                </div>

            </div>
        );
    }

    const order = selectedOrder;
    const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
    const itemsSubtotal = order.items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    return (
        <main className="container py-5 fh-order-details">

            {/* Header */}

            <header className="fh-order-details-header mb-4">

                <Link to="/orders" className="text-decoration-none text-secondary" >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Orders
                </Link>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mt-3">

                    <div className="fh-order-details-heading">

                        <span className="fh-order-details-eyebrow mb-3">
                            <i className="bi bi-receipt-cutoff" aria-hidden="true" />
                            Order Details
                        </span>

                        <h1 className="display-5 fw-bold mb-2">
                            Order #{order.id}
                        </h1>

                        <time className="text-secondary mb-0" dateTime={order.createdAt}>
                            Placed on {new Date(order.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </time>

                    </div>

                    <span className={`badge rounded-pill fs-6 px-3 py-2 ${getStatusPaymentClass(order.status)}`} >
                        {formatStatus(order.status)}
                    </span>

                </div>

            </header>

            <section className="card fh-order-details-panel fh-order-timeline-panel mb-4" aria-labelledby="fh-order-progress-title">
                <div className="card-body">
                    <div className="fh-order-section-heading">
                        <span className="fh-order-section-icon" aria-hidden="true">
                            <i className="bi bi-signpost-split" />
                        </span>
                        <div>
                            <h2 id="fh-order-progress-title">Order Progress</h2>
                            <p>Follow the current status of this order.</p>
                        </div>
                    </div>
                    <OrderStatusTimeline
                        status={order.status}
                        createdAt={order.createdAt}
                        rejectionReason={order.rejectionReason}
                    />

                    {(order.status === "CANCELLED" || order.status === "REJECTED") && (
                        <div
                            className={`alert ${order.status === "CANCELLED" ? "alert-secondary" : "alert-danger"} mt-4 mb-0`}
                        >
                            <div className="d-flex align-items-start gap-2">
                                <i className="bi bi-info-circle mt-1" aria-hidden="true" />
                                <div>
                                    <strong>{order.status === "CANCELLED" ? "Order Cancelled" : "Order Rejected"}</strong>
                                    <div className="mt-1">
                                        {order.paymentStatus === "REFUNDED"
                                            ? "Your payment has been refunded."
                                            : order.paymentStatus === "PAID"
                                                ? "Your payment refund is being processed."
                                                : "This order is no longer being processed."}
                                    </div>
                                    {(order.status === "CANCELLED" ? order.cancellationReason : order.rejectionReason) && (
                                        <div className="mt-3 pt-3 border-top">
                                            <strong>{order.status === "CANCELLED" ? "Cancellation reason" : "Rejection reason"}</strong>
                                            <p className="mb-0 mt-1">
                                                {order.status === "CANCELLED" ? order.cancellationReason : order.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <div className="row g-4 fh-order-details-grid">

                <div className="col-lg-8">
                    {/* Items */}

                    <div className="card fh-order-details-panel fh-order-items-panel">

                        <div className="card-body p-4">

                            <div className="fh-order-section-heading">
                                <span className="fh-order-section-icon" aria-hidden="true">
                                    <i className="bi bi-basket3" />
                                </span>
                                <div>
                                    <h2>Ordered Items</h2>
                                    <p>{itemCount} {itemCount === 1 ? "item" : "items"} in this order</p>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3 order-details-items">

                                {order.items.map((item) => (

                                    <div key={item.id} className="d-flex align-items-center p-3 bg-light rounded-4 order-item-row" >

                                        {/* Food Image */}

                                        <div className="me-3 shrink-0 foodhub-icon--80 order-item-thumbnail">

                                            {getMenuImageSrc(item.menuItem.image) ? (
                                                <img
                                                    src={getMenuImageSrc(item.menuItem.image)!}
                                                    alt={item.menuItem.name}
                                                    className="w-100 h-100 rounded-3 order-item-image"
                                                />
                                            ) : (
                                                <div className="bg-white rounded-3 d-flex align-items-center justify-content-center w-100 h-100">
                                                    <i className="bi bi-image text-secondary fs-4" />
                                                </div>
                                            )}

                                        </div>

                                        {/* Food Details */}

                                        <div className="grow">

                                            <h6 className="fw-bold mb-1 order-item-name">
                                                {item.menuItem.name}
                                            </h6>

                                            <div className="text-secondary small">
                                                ₹{Number(item.price).toFixed(2)} {" × "} {item.quantity}
                                            </div>

                                        </div>

                                        {/* Item Total */}

                                        <div className="text-end ms-3 order-item-total">

                                            <small className="text-secondary d-block">
                                                Total
                                            </small>

                                            <strong className="order-item-total-amount">
                                                ₹ {(Number(item.price) * item.quantity).toFixed(2)}
                                            </strong>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                    <section className="card fh-order-details-panel fh-order-payment-panel" aria-labelledby="fh-payment-information">
                        <div className="card-body">
                            <div className="fh-order-section-heading">
                                <span className="fh-order-section-icon" aria-hidden="true">
                                    <i className="bi bi-credit-card" />
                                </span>
                                <div>
                                    <h2 id="fh-payment-information">Payment Information</h2>
                                    <p>Payment status recorded for this order.</p>
                                </div>
                            </div>
                            <div className="fh-order-payment-status">
                                <span>Payment status</span>
                                <span className={`badge rounded-pill px-3 py-2 ${getStatusPaymentClass(order.paymentStatus)}`}>
                                    {formatStatus(order.paymentStatus)}
                                </span>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right side */}

                <div className="col-lg-4">

                    <div className="card fh-order-details-panel fh-order-summary-panel">

                        <div className="card-body p-4">

                            <div className="fh-order-section-heading">
                                <span className="fh-order-section-icon" aria-hidden="true">
                                    <i className="bi bi-receipt" />
                                </span>
                                <div>
                                    <h2>Order Summary</h2>
                                    <p>Order #{order.id}</p>
                                </div>
                            </div>

                            <div className="fh-order-summary-line">
                                <span>Items ({itemCount})</span>
                                <strong>₹{itemsSubtotal.toFixed(2)}</strong>
                            </div>

                            <hr className="my-4" />

                            <div className="fh-order-summary-total">
                                <span>Order Total</span>
                                <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                            </div>

                            {order.status === "PENDING" && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 mt-4"
                                    onClick={() => { setShowCancelModal(true) }}
                                    disabled={cancelling}
                                >
                                    {cancelling ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />
                                            Cancelling...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-x-circle me-2" />
                                            Cancel Order
                                        </>
                                    )}
                                </button>
                            )}

                        </div>

                    </div>

                    {order.status === "DELIVERED" && (
                        <div className="fh-order-review-panel">
                            <OrderReviewSection
                                key={`${order.id}-${order.review?.id ?? "none"}-${order.review?.updatedAt ?? "new"}`}
                                orderId={order.id}
                                initialReview={order.review ?? null}
                            />
                        </div>
                    )}

                </div>

            </div>

            <ConfirmModal
                show={showCancelModal}
                centered
                title="Cancel this order?"
                icon="bi-exclamation-triangle"
                confirmIcon="bi-x-circle"
                confirmText="Yes, Cancel Order"
                cancelText="Keep Order"
                loadingText="Cancelling..."
                confirmButtonClassName="btn-danger rounded-3 py-2"
                onConfirm={handleCancelOrder}
                onCancel={() => setShowCancelModal(false)}
                loading={cancelling}
                confirmDisabled={
                    !cancellationReason ||
                    (
                        cancellationReason === "OTHER" &&
                        (
                            customCancellationReason.trim().length < 3 ||
                            customCancellationReason.trim().length > 500
                        )
                    )
                }
            >
                <div className="text-center">
                    <p className="text-secondary mb-2">
                        Are you sure you want to cancel order{" "}
                        <strong>#{selectedOrder?.id}</strong>?
                    </p>

                    <p className="text-secondary small mb-4">
                        This action cannot be undone. Your order will be
                        cancelled if the request succeeds.
                    </p>
                </div>

                <div className="text-start">
                    <label
                        htmlFor="cancellationReason"
                        className="form-label fw-semibold"
                    >
                        Why are you cancelling?
                    </label>

                    <select
                        id="cancellationReason"
                        className="form-select rounded-3 py-2"
                        value={cancellationReason}
                        onChange={(event) => {
                            setCancellationReason(event.target.value);
                            setCustomCancellationReason("");
                        }}
                        disabled={cancelling}
                    >
                        <option value="">Select a reason</option>
                        <option value="I ordered the wrong items">
                            I ordered the wrong items
                        </option>
                        <option value="I placed the order by mistake">
                            I placed the order by mistake
                        </option>
                        <option value="I no longer need this order">
                            I no longer need this order
                        </option>
                        <option value="OTHER">Other reason</option>
                    </select>

                    {cancellationReason === "OTHER" && (
                        <div className="mt-3">
                            <label
                                htmlFor="customCancellationReason"
                                className="form-label fw-semibold"
                            >
                                Tell us the reason
                            </label>

                            <textarea
                                id="customCancellationReason"
                                className="form-control rounded-3"
                                rows={3}
                                maxLength={500}
                                placeholder="Enter your reason (3–500 characters)"
                                value={customCancellationReason}
                                onChange={(event) =>
                                    setCustomCancellationReason(event.target.value)
                                }
                                disabled={cancelling}
                            />

                            <div className="text-end small text-secondary mt-1">
                                {customCancellationReason.length}/500
                            </div>
                        </div>
                    )}
                </div>
            </ConfirmModal>


        </main>
    );
}

function OrderStatusTimeline({
    status,
    createdAt,
}: {
    status: OrderStatus;
    createdAt: string;
    rejectionReason?: string | null;
}) {
    const lifecycle = [
        { value: "PENDING", label: "Order Placed", icon: "bi-receipt" },
        { value: "APPROVED", label: "Approved", icon: "bi-check2-circle" },
        { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "bi-bicycle" },
        { value: "DELIVERED", label: "Delivered", icon: "bi-house-check" },
    ];
    const terminal = status === "CANCELLED" || status === "REJECTED";
    const steps = terminal
        ? [
            lifecycle[0],
            {
                value: status,
                label: status === "CANCELLED" ? "Order Cancelled" : "Order Rejected",
                icon: "bi-x-circle",
            },
        ]
        : lifecycle;
    const currentIndex = terminal
        ? steps.length - 1
        : steps.findIndex((step) => step.value === status);

    return (
        <ol className={`fh-order-timeline ${terminal ? "is-terminal" : ""}`}>
            {steps.map((step, index) => {
                const isCurrent = index === currentIndex;
                const isComplete = index < currentIndex ||
                    (status === "DELIVERED" && index === currentIndex);
                const stepClass = isCurrent
                    ? `is-current${isComplete ? " is-complete" : ""}`
                    : isComplete
                        ? "is-complete"
                        : "is-upcoming";

                return (
                    <li key={step.value} className={`fh-order-timeline-step ${stepClass}`}>
                        <span className="fh-order-timeline-marker" aria-hidden="true">
                            <i className={`bi ${isComplete && !isCurrent ? "bi-check-lg" : step.icon}`} />
                        </span>
                        <span className="fh-order-timeline-copy">
                            <strong>{step.label}</strong>
                            <span className="fh-order-timeline-state">
                                {isCurrent ? "Current status" : isComplete ? "Completed" : "Upcoming"}
                            </span>
                            {index === 0 && (
                                <time dateTime={createdAt}>
                                    {new Date(createdAt).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </time>
                            )}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default OrderDetails;