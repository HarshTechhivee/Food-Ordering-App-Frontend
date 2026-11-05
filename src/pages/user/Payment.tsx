import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "../../components/payment/CheckoutForm";
import { useAppSelector } from "../../store/hooks";
import "./Payment.css";

const stripePromise = loadStripe(
    process.env.STRIPE_PUBLISHABLE_KEY!
);

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const clientSecret =
        location.state?.clientSecret ?? null;
    const items = useAppSelector((state) => state.cart.items);
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (!clientSecret) {
        return (
            <main className="fh-payment-page">
                <div className="container fh-payment-invalid">
                    <div className="fh-payment-result fh-payment-result--error">
                        <span className="fh-payment-result-icon" aria-hidden="true">
                            <i className="bi bi-exclamation-circle" />
                        </span>
                        <span className="fh-payment-eyebrow">CHECKOUT</span>
                        <h1>Payment session unavailable</h1>
                        <p>
                            This payment session is invalid or has expired.
                            Return to your cart to try again.
                        </p>
                        <button
                            type="button"
                            className="foodhub-button-primary"
                            onClick={() => navigate("/cart")}
                        >
                            <i className="bi bi-arrow-left" aria-hidden="true" />
                            Back to Cart
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="fh-payment-page">
            <div className="container fh-payment-container">
                <header className="fh-payment-header">
                    <span className="fh-payment-eyebrow">SECURE CHECKOUT</span>
                    <h1>Complete your order.</h1>
                    <p>Review your picks and securely complete your payment.</p>
                </header>

                <div className="fh-payment-layout">
                    <section className="fh-payment-form-card">
                        <div className="fh-payment-card-heading">
                            <span className="fh-payment-summary-icon" aria-hidden="true">
                                <i className="bi bi-shield-lock" />
                            </span>
                            <div>
                                <h2>Payment details</h2>
                                <p>Your payment is processed securely.</p>
                            </div>
                        </div>

                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                            }}
                        >
                            <CheckoutForm />
                        </Elements>
                    </section>

                    <aside className="fh-payment-summary">
                        <div className="fh-payment-card-heading">
                            <span className="fh-payment-summary-icon" aria-hidden="true">
                                <i className="bi bi-bag" />
                            </span>
                            <div>
                                <h2>Order summary</h2>
                                <p>{items.length} {items.length === 1 ? "dish" : "dishes"}</p>
                            </div>
                        </div>

                        {items.length > 0 ? (
                            <div className="fh-payment-summary-items">
                                {items.map((item) => (
                                    <div
                                        className="fh-payment-summary-item"
                                        key={item.menuItemId}
                                    >
                                        <span className="fh-payment-summary-item-name">
                                            {item.name}
                                            <small>Qty {item.quantity}</small>
                                        </span>
                                        <strong>
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </strong>
                                    </div>
                                ))}
                                <div className="fh-payment-summary-total">
                                    <span>Subtotal</span>
                                    <strong>₹{total.toFixed(2)}</strong>
                                </div>
                            </div>
                        ) : (
                            <p className="fh-payment-summary-empty">
                                Your items are associated with this secure
                                payment session.
                            </p>
                        )}

                        <p className="fh-payment-trust-note">
                            <i className="bi bi-lock-fill" aria-hidden="true" />
                            Payment details are handled by Stripe.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Payment;