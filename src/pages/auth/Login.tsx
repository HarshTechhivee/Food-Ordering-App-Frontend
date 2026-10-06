import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { loginSchema, type LoginFormData, } from "../../schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, login, } from "../../store/slices/authSlice";

function Login() {

    const [eyeToggle, seteyeToggle] = useState(false)

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const location = useLocation()

    const from = typeof location.state?.from === "string" ? location.state.from : "/home";

    const { isAuthenticated, loading, error, user } = useAppSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, } =

        useForm<LoginFormData>({ resolver: zodResolver(loginSchema), });

    useEffect(() => {

        if (!isAuthenticated || !user) {
            return;
        }

        if (user.role === "RESTAURANT_ADMIN") {
            navigate("/admin", { replace: true });
            return;
        }

        navigate(from, { replace: true });

    }, [isAuthenticated, user, navigate, from]);

    useEffect(() => {

        return () => {
            dispatch(clearAuthError());
        };

    }, [dispatch]);

    const onSubmit = async (data: LoginFormData) => {
        await dispatch(login(data));
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-7 col-lg-5">

                        {/* Brand */}
                        <div className="text-center mb-4">
                            <div
                                className="bg-primary text-white rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                }}
                            >
                                <i className="bi bi-shop fs-3"></i>
                            </div>

                            <h2 className="fw-bold">
                                Welcome to FoodHub
                            </h2>
                        </div>

                        {/* Login Card */}
                        <div className="card border-0 rounded-4 shadow-sm">
                            <div className="card-body p-4 p-md-5">

                                <div className="mb-4">

                                    <h3 className="fw-bold mb-2">
                                        Login to your account
                                    </h3>

                                    <p className="text-secondary mb-0 ">
                                        Enter your credentials to continue.
                                    </p>
                                </div>

                                {/* API Error */}
                                {error && (
                                    <div
                                        className="alert alert-danger rounded-3 d-flex align-items-center gap-2"
                                        role="alert"
                                    >
                                        <i className="bi bi-exclamation-circle-fill"></i>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold fs-5">
                                            Email
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="bi bi-envelope"></i>
                                            </span>

                                            <input type="email" placeholder="Enter your email"
                                                className={`form-control ${errors.email ? "is-invalid" : ""}`} {...register("email")} />
                                        </div>

                                        {errors.email && (
                                            <div className="text-danger small mt-1">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold fs-5">
                                            Password
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="bi bi-lock"></i>
                                            </span>

                                            <input type={eyeToggle ? "text" : "password"} placeholder="Enter your password"
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`} {...register("password")} />

                                            <button type="button" className="btn btn-outline-secondary"
                                                onClick={() => seteyeToggle(!eyeToggle)}
                                                aria-label={eyeToggle ? "Hide password" : "Show password"} >
                                                <i className={`bi ${eyeToggle ? "bi-eye" : "bi-eye-slash"}`}></i>
                                            </button>

                                        </div>

                                        {errors.password && (
                                            <div className="text-danger small mt-1">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" className="btn btn-primary w-100 py-2 " disabled={loading}>
                                        {loading ? (<> <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Logging in... </>)
                                            :
                                            (<> <i className="bi bi-box-arrow-in-right me-2"></i> Login </>)}
                                    </button>
                                </form>

                                {/* Register */}
                                <div className="text-center mt-4 pt-4 border-top">
                                    <p className="text-secondary mb-0 fs-5">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="fw-semibold text-decoration-none" >
                                            Create an account
                                        </Link>
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center mt-4">
                            <Link
                                to="/home"
                                className="text-secondary text-decoration-none small fs-5"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Home
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;