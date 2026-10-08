import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";

function PaymentSuccess() {

    const [searchParams] = useSearchParams();

    const dispatch = useAppDispatch();

    const paymentIntentId = searchParams.get("payment_intent");

    const redirectStatus = searchParams.get("redirect_status");

    const isSuccess = redirectStatus === "succeeded";

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearCart());
        }
    }, [isSuccess, dispatch]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body p-5">

                            {isSuccess ?
                                (<>
                                    <div className="mb-4">
                                        <i className="bi bi-check-circle-fill fs-1 text-success" />
                                    </div>

                                    <h2 className="mb-3">
                                        Payment Successful
                                    </h2>

                                    <p className="text-muted">
                                        Your payment has been completed
                                        successfully.
                                    </p>

                                    <p className="small text-muted">
                                        Payment ID: {paymentIntentId}
                                    </p>

                                    <Link to="/orders" className="btn btn-primary mt-3" >
                                        View Orders
                                    </Link>
                                </>)
                                :
                                (<>
                                    <div className="mb-4">
                                        <i className="bi bi-x-circle-fill fs-1 text-danger" />
                                    </div>

                                    <h2 className="mb-3">
                                        Payment Failed
                                    </h2>

                                    <p className="text-muted">
                                        Your payment could not be completed.
                                    </p>

                                    <Link to="/orders" className="btn btn-primary mt-3" >
                                        View Orders
                                    </Link>
                                </>)
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;