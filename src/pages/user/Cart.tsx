import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { decreaseQuantity, increaseQuantity, removeFromCart, } from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPaymentIntent } from "../../services/payment.api";

function Cart() {

    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handleProceedToPayment = async () => {

        try {
            setLoading(true)


            const result = await createPaymentIntent({
                items: items.map((item) => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                })),
            });

            navigate("/payment", {
                state: {
                    clientSecret: result.clientSecret,
                },
            });

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false)
        }
    };

    const items = useAppSelector((state) => state.cart.items);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">

                    <div
                        className="mx-auto mb-4 rounded-circle bg-light d-flex align-items-center justify-content-center foodhub-icon--100"
                    >
                        <i className="bi bi-cart-x display-6 text-secondary" />
                    </div>

                    <h2 className="fw-bold mb-2">
                        Your cart is empty
                    </h2>

                    <p className="text-secondary mb-4">
                        Looks like you haven't added anything yet.
                        Let's find something delicious.
                    </p>

                    <Link to="/menu" className="btn btn-dark btn-lg px-4" >
                        <i className="bi bi-arrow-left me-2" />
                        Browse Menu
                    </Link>

                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="mb-5">
                <span className="badge text-bg-primary mb-3">
                    Your Order
                </span>

                <h1 className="display-6 fw-bold mb-2">
                    Your Cart
                </h1>

                <p className="text-secondary mb-0">
                    Review your items before placing your order.
                </p>
            </div>

            <div className="row g-4">
                {/* Cart items */}

                <div className="col-lg-8">
                    {items.map((item) => (
                        <div key={item.menuItemId} className="card border-0 shadow-sm rounded-4 mb-3" >
                            <div className="card-body p-3 p-md-4">

                                <div className="row align-items-center g-3">

                                    {/* Image */}
                                    <div className="col-4 col-sm-3 col-md-2">

                                        {item.image ?
                                            (<img src={`${import.meta.env.SERVER_URL}${item.image}`} alt={item.name}
                                                className="img-fluid rounded-3 w-100 cart-item-image"
                                            />)
                                            :
                                            (<div className="bg-light rounded-3 d-flex align-items-center justify-content-center cart-item-placeholder">
                                                <i className="bi bi-image text-secondary fs-3" />
                                            </div>)
                                        }
                                    </div>

                                    {/* Information */}
                                    <div className="col-8 col-sm-9 col-md-4">
                                        <h5 className="fw-bold mb-1">
                                            {item.name}
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            ₹{item.price.toFixed(2)} each
                                        </p>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-6 col-md-3">
                                        <div className="d-inline-flex align-items-center border rounded-3 overflow-hidden">

                                            <button type="button" className="btn btn-light border-0 rounded-0"
                                                onClick={() => dispatch(decreaseQuantity(item.menuItemId))} >
                                                <i className="bi bi-dash-lg" />
                                            </button>

                                            <span className="px-3 fw-semibold">
                                                {item.quantity}
                                            </span>

                                            <button type="button" className="btn btn-light border-0 rounded-0"
                                                onClick={() => dispatch(increaseQuantity(item.menuItemId))} >
                                                <i className="bi bi-plus-lg" />
                                            </button>

                                        </div>
                                    </div>

                                    {/* Item total */}
                                    <div className="col-4 col-md-2">
                                        <span className="fw-bold">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Remove */}
                                    <div className="col-2 col-md-1 text-end">
                                        <button type="button" className="btn btn-outline-danger btn-sm"
                                            onClick={() => dispatch(removeFromCart(item.menuItemId))}
                                            title="Remove item" aria-label={`Remove ${item.name}`} >
                                            <i className="bi bi-trash" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">

                            <h4 className="fw-bold mb-4">
                                Order Summary
                            </h4>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-secondary">
                                    Items
                                </span>

                                <span className="fw-semibold">
                                    {items.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-secondary">
                                    Subtotal
                                </span>

                                <span className="fw-semibold">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-secondary">
                                    Delivery
                                </span>

                                <span className="text-success fw-semibold">
                                    Free
                                </span>
                            </div>

                            <hr className="my-4" />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fs-5 fw-bold">
                                    Total
                                </span>

                                <span className="fs-4 fw-bold">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <button type="button" className="btn btn-primary btn-lg w-100"
                                onClick={handleProceedToPayment} disabled={loading} >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />
                                        Preparing Payment...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-credit-card me-2" />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;