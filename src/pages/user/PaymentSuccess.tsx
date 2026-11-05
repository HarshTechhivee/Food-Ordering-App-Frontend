import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import "./Payment.css";

function PaymentSuccess() {

    const [searchParams] = useSearchParams();

    const dispatch = useAppDispatch();

    const paymentIntentId =
        searchParams.get("payment_intent");

    const redirectStatus =
        searchParams.get("redirect_status");

    const isSuccess =
        redirectStatus === "succeeded";

    useEffect(() => {

        if (isSuccess) {
            dispatch(clearCart());
        }

    }, [isSuccess, dispatch]);

    return (
        <main className="fh-payment-page">
            <div className="container fh-payment-invalid">
                <section
                    className={`fh-payment-result ${
                        isSuccess
                            ? "fh-payment-result--success"
                            : "fh-payment-result--error"
                    }`}
                    aria-labelledby="fh-payment-result-title"
                >
                    <span className="fh-payment-result-icon" aria-hidden="true">
                        <i
                            className={`bi ${
                                isSuccess
                                    ? "bi-check2-circle"
                                    : "bi-x-circle"
                            }`}
                        />
                    </span>
                    <span className="fh-payment-eyebrow">
                        {isSuccess ? "PAYMENT CONFIRMED" : "PAYMENT UPDATE"}
                    </span>
                    <h1 id="fh-payment-result-title">
                        {isSuccess ? "Payment successful." : "Payment failed."}
                    </h1>
                    <p>
                        {isSuccess
                            ? "Your payment was completed successfully and your order is being created."
                            : "Your payment could not be completed. Your cart has been kept so you can try again."}
                    </p>

                    {paymentIntentId && (
                        <div className="fh-payment-reference">
                            <span>Payment ID</span>
                            <code>{paymentIntentId}</code>
                        </div>
                    )}

                    {isSuccess ? (
                        <Link to="/orders" className="foodhub-button-primary">
                            View orders
                            <i className="bi bi-arrow-right" aria-hidden="true" />
                        </Link>
                    ) : (
                        <Link to="/cart" className="foodhub-button-primary">
                            <i className="bi bi-arrow-left" aria-hidden="true" />
                            Back to Cart
                        </Link>
                    )}
                    {isSuccess && (
                        <Link to="/menu" className="fh-payment-secondary-link">
                            Return to the menu
                        </Link>
                    )}
                </section>
            </div>
        </main>
    );
}

export default PaymentSuccess;