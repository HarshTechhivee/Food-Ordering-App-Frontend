import { useState } from "react";
import { PaymentElement, useElements, useStripe, } from "@stripe/react-stripe-js";

function CheckoutForm() {

    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await stripe.confirmPayment({
            elements,

            confirmParams: {
                return_url:
                    `${window.location.origin}/payment-success`,
            },
        });

        if (error) {
            setError(
                error.message ??
                "Payment failed. Please try again."
            );

            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <PaymentElement />

            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary w-100 mt-4"
                disabled={
                    !stripe ||
                    !elements ||
                    loading
                }
            >
                {loading ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                        />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <i className="bi bi-lock-fill me-2" />
                        Pay Securely
                    </>
                )}
            </button>

        </form>
    );
}

export default CheckoutForm;