import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "../../components/payment/CheckoutForm";
import apiClient from "../../services/api";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function Payment() {
    const { orderId } = useParams<{ orderId: string }>();

    const location = useLocation();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState<string | null>(
        location.state?.clientSecret ?? null
    );

    const [loading, setLoading] = useState(
        !location.state?.clientSecret
    );

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Invalid order ID.");
            setLoading(false);
            return;
        }

        // We already have the client secret from Cart.
        if (clientSecret) {
            setLoading(false);
            return;
        }

        const fetchPaymentSession = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.get(`/payments/orders/${orderId}`);

                setClientSecret(response.data.data.clientSecret);
            } catch (error) {
                console.error(
                    "Failed to load payment session:",
                    error
                );

                setError(
                    "Unable to load the payment session."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentSession();
    }, [orderId, clientSecret]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="text-muted mt-3">
                        Loading payment...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !orderId || !clientSecret) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error ??
                        "Payment session is invalid or expired."}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/cart")}
                >
                    Back to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">

                            <h2 className="mb-2">
                                Complete Payment
                            </h2>

                            <p className="text-muted mb-4">
                                Order #{orderId}
                            </p>

                            <Elements stripe={stripePromise} options={{ clientSecret, }} >
                                <CheckoutForm orderId={orderId} />
                            </Elements>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;