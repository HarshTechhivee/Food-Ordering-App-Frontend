import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "../../components/payment/CheckoutForm";

const stripePromise = loadStripe(
    import.meta.env.STRIPE_PUBLISHABLE_KEY
);

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const clientSecret =
        location.state?.clientSecret ?? null;

    if (!clientSecret) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    Payment session is invalid or expired.
                </div>

                <button
                    type="button"
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
                                Complete your payment to place the order.
                            </p>

                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                }}
                            >
                                <CheckoutForm />
                            </Elements>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;