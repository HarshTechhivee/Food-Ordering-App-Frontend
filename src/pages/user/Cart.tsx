import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPaymentIntent } from "../../services/payment.api";
import { getMenuImageSrc } from "../../utils/menuImage";
import "./Cart.css";

function Cart() {
    const [loading, setLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const items = useAppSelector((state) => state.cart.items);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleProceedToPayment = async () => {
        try {
            setLoading(true);
            setCheckoutError(null);

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
            setCheckoutError(
                error instanceof Error
                    ? error.message
                    : "We couldn't prepare checkout. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="fh-cart-page">
                <div className="container fh-cart-empty-wrap">
                    <section className="fh-cart-empty">
                        <span className="fh-cart-empty-icon" aria-hidden="true">
                            <i className="bi bi-bag-x" />
                        </span>
                        <span className="fh-cart-eyebrow">YOUR FOODHUB CART</span>
                        <h1>Your cart is ready for something delicious.</h1>
                        <p>
                            You haven’t added anything yet. Explore the menu and
                            pick a dish that sounds good.
                        </p>
                        <Link to="/menu" className="foodhub-button-primary">
                            <i className="bi bi-arrow-left" aria-hidden="true" />
                            Browse the menu
                        </Link>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="fh-cart-page">
            <div className="container fh-cart-container">
            <header className="fh-cart-header fh-cart-hero">
                    <div>
                    <Link to="/menu" className="fh-cart-continue-link">
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                        Continue Shopping
                    </Link>
                    <span className="fh-cart-eyebrow">YOUR FOODHUB CART</span>
                    <div className="fh-cart-title-row">
                        <span className="fh-cart-title-icon" aria-hidden="true">
                            <i className="bi bi-cart3" />
                        </span>
                        <h1>Your Cart</h1>
                    </div>
                    <p>Take one last look at your delicious picks.</p>
                </div>
                <div className="fh-cart-hero-art" aria-hidden="true">
                    <span className="fh-cart-hero-spark fh-cart-hero-spark--one">✳</span>
                    <span className="fh-cart-hero-spark fh-cart-hero-spark--two">✦</span>
                    <span className="fh-cart-hero-bag"><i className="bi bi-bag-heart" /></span>
                    <span className="fh-cart-hero-food"><i className="bi bi-egg-fried" /></span>
                </div>
            </header>

                <div className="fh-cart-layout">
                    <section className="fh-cart-items" aria-label="Items in your cart">
                        <div className="fh-cart-items-heading">
                            <h2>Your picks</h2>
                            <span>
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                        </div>

                        {items.map((item) => {
                            const imageSrc = getMenuImageSrc(item.image);

                            return (
                                <article
                                    key={item.menuItemId}
                                    className="fh-cart-item"
                                >
                                    <div className="fh-cart-item-image-wrap">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={item.name}
                                                className="fh-cart-item-image"
                                            />
                                        ) : (
                                            <div
                                                className="fh-cart-item-placeholder"
                                                role="img"
                                                aria-label={`No image available for ${item.name}`}
                                            >
                                                <i
                                                    className="bi bi-egg-fried"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="fh-cart-item-info">
                                        <h3>{item.name}</h3>
                                        <span className="fh-cart-item-unit-price">
                                            ₹{item.price.toFixed(2)}{" "}
                                            <span>each</span>
                                        </span>
                                    </div>

                                    <div className="fh-cart-item-controls">
                                        <div
                                            className="fh-cart-quantity"
                                            aria-label={`Quantity for ${item.name}`}
                                        >
                                            <button
                                                type="button"
                                                aria-label={`Decrease quantity of ${item.name}`}
                                                onClick={() =>
                                                    dispatch(
                                                        decreaseQuantity(
                                                            item.menuItemId
                                                        )
                                                    )
                                                }
                                            >
                                                <i
                                                    className="bi bi-dash-lg"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            <span aria-live="polite">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label={`Increase quantity of ${item.name}`}
                                                onClick={() =>
                                                    dispatch(
                                                        increaseQuantity(
                                                            item.menuItemId
                                                        )
                                                    )
                                                }
                                            >
                                                <i
                                                    className="bi bi-plus-lg"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        <strong className="fh-cart-item-total">
                                            ₹
                                            {(item.price * item.quantity).toFixed(
                                                2
                                            )}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="fh-cart-remove"
                                        aria-label={`Remove ${item.name} from cart`}
                                        onClick={() =>
                                            dispatch(
                                                removeFromCart(item.menuItemId)
                                            )
                                        }
                                    >
                                        <i
                                            className="bi bi-trash3"
                                            aria-hidden="true"
                                        />
                                        <span>Remove</span>
                                    </button>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="fh-cart-summary" aria-labelledby="fh-cart-summary-title">
                        <div className="fh-cart-summary-heading">
                            <span className="fh-cart-summary-icon" aria-hidden="true">
                                <i className="bi bi-receipt" />
                            </span>
                            <div>
                                <h2 id="fh-cart-summary-title">Order summary</h2>
                                <p>Your order at a glance</p>
                            </div>
                        </div>

                        <div className="fh-cart-summary-line">
                            <span>Items</span>
                            <strong>{itemCount}</strong>
                        </div>
                        <div className="fh-cart-summary-line">
                            <span>Subtotal</span>
                            <strong>₹{total.toFixed(2)}</strong>
                        </div>

                        <div className="fh-cart-summary-total">
                            <span>Total</span>
                            <strong>₹{total.toFixed(2)}</strong>
                        </div>

                        {checkoutError && (
                            <div className="fh-cart-checkout-error" role="alert">
                                <i
                                    className="bi bi-exclamation-circle"
                                    aria-hidden="true"
                                />
                                <span>{checkoutError}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            className="foodhub-button-primary fh-cart-checkout"
                            onClick={handleProceedToPayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-label="Preparing payment"
                                    />
                                    Preparing checkout…
                                </>
                            ) : (
                                <>
                                    <i
                                        className="bi bi-lock"
                                        aria-hidden="true"
                                    />
                                    Proceed to Checkout
                                </>
                            )}
                        </button>
                        <p className="fh-cart-secure-note">
                            <i className="bi bi-shield-check" aria-hidden="true" />
                            Secure checkout
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Cart;
