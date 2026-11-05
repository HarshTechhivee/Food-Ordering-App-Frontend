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
        <form className="fh-checkout-form" onSubmit={handleSubmit}>

            <div className="fh-payment-element">
                <PaymentElement />
            </div>

            {error && (
                <div className="fh-payment-form-error" role="alert">
                    <i className="bi bi-exclamation-circle" aria-hidden="true" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="foodhub-button-primary fh-payment-submit"
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
                            role="status"
                            aria-label="Processing payment"
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