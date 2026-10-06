import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

import { registerSchema, type RegisterFormData, } from "../../schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, register, } from "../../store/slices/authSlice";

function Register() {

    const [eyePassword, setEyePassword] = useState(false)

    const [eyeConfirmPassword, setEyeConfirmPassword] = useState(false)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

    const { register: registerField, handleSubmit, formState: { errors }, } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {

        if (!isAuthenticated) {
            return;
        }

        if (user?.role === "RESTAURANT_ADMIN") {
            navigate("/admin", { replace: true });
            return;
        }

        navigate("/home", { replace: true });

    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const onSubmit = async (data: RegisterFormData) => {
        const result = await dispatch(
            register({
                name: data.name,
                email: data.email,
                password: data.password,
            })
        );

        if (register.fulfilled.match(result)) {
            navigate("/login");
        }
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

                            <h2 className="fw-bold mb-1">
                                Join FoodHub
                            </h2>

                        </div>

                        {/* Register Card */}
                        <div className="card border-0 rounded-4 shadow-sm">
                            <div className="card-body p-4 p-md-5">

                                <div className="mb-4">

                                    <h3 className="fw-bold mb-1">
                                        Get started with FoodHub
                                    </h3>

                                    <p className="text-secondary  mb-0">
                                        Create your account to order your favorite
                                        meals.
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

                                    {/* Name */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold fs-5">
                                            Name
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="bi bi-person"></i>
                                            </span>

                                            <input type="text" placeholder="Enter your name"
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`} {...registerField("name")} />
                                        </div>

                                        {errors.name && (
                                            <div className="text-danger small mt-1">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>

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
                                                className={`form-control ${errors.email ? "is-invalid" : ""}`} {...registerField("email")} />
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

                                            <input type={eyePassword ? "text" : "password"} placeholder="Create a password"
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                {...registerField("password")} />

                                            <button type="button" className="btn btn-outline-secondary"
                                                onClick={() => setEyePassword(!eyePassword)}
                                                aria-label={eyePassword ? "Hide password" : "Show password"} >
                                                <i className={`bi ${eyePassword ? "bi-eye" : "bi-eye-slash"}`} ></i>
                                            </button>
                                        </div>

                                        {errors.password && (
                                            <div className="text-danger small mt-1">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold fs-5">
                                            Confirm Password
                                        </label>

                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="bi bi-shield-lock"></i>
                                            </span>

                                            <input type={eyeConfirmPassword ? "text" : "password"} placeholder="Confirm your password"
                                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                                {...registerField("confirmPassword")} />

                                            <button type="button" className="btn btn-outline-secondary"
                                                onClick={() => setEyeConfirmPassword(!eyeConfirmPassword)}
                                                aria-label={eyeConfirmPassword ? "Hide password" : "Show password"} >
                                                <i className={`bi ${eyeConfirmPassword ? "bi-eye" : "bi-eye-slash"}`} ></i>
                                            </button>
                                        </div>

                                        {errors.confirmPassword && (
                                            <div className="text-danger small mt-1">
                                                {errors.confirmPassword.message}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" className="btn btn-primary w-100 py-2 " disabled={loading} >
                                        {loading ?
                                            (<> <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" ></span>
                                                Creating account...  </>)
                                            :
                                            (<> <i className="bi bi-person-plus me-2"></i> Create Account  </>)
                                        }
                                    </button>
                                </form>

                                {/* Login */}
                                <div className="text-center mt-4 pt-4 border-top">
                                    <p className="text-secondary mb-0 fs-5">
                                        Already have an account?{" "}
                                        <Link to="/login" className="fw-semibold text-decoration-none"  >
                                            Login
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

export default Register;