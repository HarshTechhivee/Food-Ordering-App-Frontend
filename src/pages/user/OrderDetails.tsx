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
                        Loading your order...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">

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
            <div className="container py-5">

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

    return (
        <div className="container py-5">

            {/* Header */}

            <div className="mb-5">

                <Link to="/orders" className="text-decoration-none text-secondary" >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Orders
                </Link>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mt-3">

                    <div>

                        <span className="badge text-bg-primary mb-3">
                            Order Details
                        </span>

                        <h1 className="display-5 fw-bold mb-2">
                            Order #{order.id}
                        </h1>

                        <p className="text-secondary mb-0">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleString()}
                        </p>

                    </div>

                    <span className={`badge rounded-pill fs-6 px-3 py-2 ${getStatusPaymentClass(order.status)}`} >
                        {formatStatus(order.status)}
                    </span>

                </div>

            </div>

            <div className="row g-4">

                {/* Left side */}

                <div className="col-lg-8">

                    {/* Status Timeline */}

                    <div className="card shadow-sm mb-4">

                        <div className="card-body">

                            <h5 className="mb-4">
                                Order Status
                            </h5>

                            <OrderStatusTimeline status={order.status} rejectionReason={order.rejectionReason} />


                            {(order.status === "CANCELLED" || order.status === "REJECTED") && (
                                <div
                                    className={`alert ${order.status === "CANCELLED"
                                        ? "alert-secondary"
                                        : "alert-danger"
                                        } mt-4 mb-0`}
                                >
                                    <div className="d-flex align-items-start gap-2">
                                        <i
                                            className={`bi ${order.status === "CANCELLED"
                                                ? "bi-x-circle"
                                                : "bi-x-circle"
                                                }`}
                                        />

                                        <div className="flex-grow-1">
                                            <strong>
                                                {order.status === "CANCELLED"
                                                    ? "Order Cancelled"
                                                    : "Order Rejected"}
                                            </strong>

                                            <div className="mt-1">
                                                {order.paymentStatus === "REFUNDED" ? (
                                                    <>
                                                        Your order has been{" "}
                                                        {order.status === "CANCELLED"
                                                            ? "cancelled"
                                                            : "rejected"}{" "}
                                                        successfully. Your payment has been refunded.
                                                    </>
                                                ) : order.paymentStatus === "PAID" ? (
                                                    <>
                                                        Your order has been{" "}
                                                        {order.status === "CANCELLED"
                                                            ? "cancelled"
                                                            : "rejected"}{" "}
                                                        successfully. Your payment refund is being processed.
                                                    </>
                                                ) : (
                                                    <>
                                                        Your order has been{" "}
                                                        {order.status === "CANCELLED"
                                                            ? "cancelled"
                                                            : "rejected"}{" "}
                                                        successfully.
                                                    </>
                                                )}
                                            </div>

                                            {(order.status === "CANCELLED"
                                                ? order.cancellationReason
                                                : order.rejectionReason) && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <strong>
                                                            {order.status === "CANCELLED"
                                                                ? "Cancellation reason"
                                                                : "Rejection reason"}
                                                        </strong>

                                                        <p className="mb-0 mt-1">
                                                            {order.status === "CANCELLED"
                                                                ? order.cancellationReason
                                                                : order.rejectionReason}
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>

                    </div>

                    {/* Items */}

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div>
                                    <h5 className="fw-bold mb-1">
                                        Ordered Items
                                    </h5>

                                    <p className="text-secondary small mb-0">
                                        {order.items.reduce((total, item) => total + item.quantity, 0)}
                                        {" "} items in this order
                                    </p>
                                </div>

                                <i className="bi bi-basket3 fs-4 text-primary" />

                            </div>

                            <div className="d-flex flex-column gap-3 order-details-items">

                                {order.items.map((item) => (

                                    <div key={item.id} className="d-flex align-items-center p-3 bg-light rounded-4 order-item-row" >

                                        {/* Food Image */}

                                        <div className="me-3 flex-shrink-0 foodhub-icon--80 order-item-thumbnail">

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

                                        <div className="flex-grow-1">

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

                </div>

                {/* Right side */}

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body p-4">

                            <div className="d-flex align-items-center gap-3 mb-4">

                                <div className="bg-primary bg-opacity-10 text-primary rounded-3 
                                    d-flex align-items-center justify-content-center foodhub-icon--46">
                                    <i className="bi bi-receipt fs-5" />
                                </div>

                                <div>
                                    <h5 className="fw-bold mb-0">
                                        Order Summary
                                    </h5>

                                    <small className="text-secondary">
                                        Order #{order.id}
                                    </small>
                                </div>

                            </div>

                            {/* Items */}

                            <div className="d-flex justify-content-between mb-3">

                                <span className="text-secondary">
                                    Items
                                </span>

                                <strong>
                                    {order.items.reduce((total, item) => total + item.quantity, 0)}
                                </strong>

                            </div>

                            {/* Subtotal */}

                            <div className="d-flex justify-content-between mb-3">

                                <span className="text-secondary">
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{Number(order.totalAmount).toFixed(2)}
                                </strong>

                            </div>

                            {/* Delivery */}

                            <div className="d-flex justify-content-between mb-3">

                                <span className="text-secondary">
                                    Delivery
                                </span>

                                <span className="text-success fw-semibold">
                                    Free
                                </span>

                            </div>

                            <hr className="my-4" />

                            {/* Total */}

                            <div className="d-flex justify-content-between align-items-center">

                                <span className="fw-bold fs-5">
                                    Total
                                </span>

                                <span className="fw-bold fs-4 text-primary">
                                    ₹{Number(order.totalAmount).toFixed(2)}
                                </span>

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


        </div>
    );
}

function OrderStatusTimeline({ status, }: { status: string; rejectionReason?: string | null; }) {

    const statuses = [
        {
            value: "PENDING",
            label: "Order Placed",
            icon: "bi-receipt",
        },
        {
            value: "APPROVED",
            label: "Order Approved",
            icon: "bi-check-circle",
        },
        {
            value: "OUT_FOR_DELIVERY",
            label: "Out for Delivery",
            icon: "bi-bicycle",
        },
        {
            value: "DELIVERED",
            label: "Delivered",
            icon: "bi-house-check",
        },
    ];

    const currentIndex = statuses.findIndex((item) => item.value === status);

    if (status === "REJECTED") {
        return
    }

    if (status === "CANCELLED") {
        return null;
    }

    return (
        <div className="d-flex flex-column">

            {statuses.map((item, index) => {

                const completed = index <= currentIndex;

                const isCurrent = index === currentIndex;

                return (
                    <div key={item.value} className="d-flex" >

                        {/* Timeline indicator */}
                        <div className="d-flex flex-column align-items-center">

                            <div className={`rounded-circle d-flex align-items-center justify-content-center 
                                ${completed ? "bg-primary text-white" : "bg-light text-secondary"} foodhub-icon--46 flex-shrink-0`}>
                                <i className={`bi ${item.icon} fs-5`} />
                            </div>

                            {index < statuses.length - 1 && (
                                <div className={`${completed ? "bg-primary" : "bg-light"} order-status-indicator`} />
                            )}

                        </div>

                        {/* Timeline content */}
                        <div className="ms-3 pb-4">

                            <div className="d-flex align-items-center gap-2">

                                <strong>
                                    {item.label}
                                </strong>

                                {isCurrent && (
                                    <span className="badge text-bg-primary rounded-pill">
                                        Current
                                    </span>
                                )}

                            </div>

                            {completed ?
                                (<div className="small text-secondary mt-1">
                                    Completed
                                </div>)
                                :
                                (<div className="small text-secondary mt-1">
                                    Waiting
                                </div>)
                            }

                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default OrderDetails;