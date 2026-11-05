import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../../schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, login } from "../../store/slices/authSlice";
import "./Auth.css";

function Login() {
    const [eyeToggle, setEyeToggle] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from =
        typeof location.state?.from === "string" ? location.state.from : "/home";
    const { isAuthenticated, loading, error, user } = useAppSelector(
        (state) => state.auth
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

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
        <main className="fh-auth-page">
            <section className="fh-auth-visual">
                <Link to="/home" className="fh-auth-logo">
                    Food<span>Hub</span>
                </Link>
                <div className="fh-auth-visual-image" role="img" aria-label="Freshly prepared meal">
                    <div className="fh-auth-visual-copy">
                        <span className="fh-auth-eyebrow">WELCOME TO FOODHUB</span>
                        <h1>Make room for something delicious.</h1>
                        <p>Find the food that feels just right.</p>
                    </div>
                </div>
                <span className="fh-auth-visual-caption">
                    A little joy in every order.
                </span>
            </section>

            <section className="fh-auth-form-section">
                <div className="fh-auth-form-wrap">
                    <Link to="/home" className="fh-auth-mobile-logo">
                        Food<span>Hub</span>
                    </Link>
                    <header className="fh-auth-form-heading">
                        <span className="fh-auth-eyebrow">YOUR FOODHUB ACCOUNT</span>
                        <h2>Welcome back.</h2>
                        <p>Log in to continue to your account.</p>
                    </header>

                    {error && (
                        <div className="fh-auth-error" role="alert">
                            <i
                                className="bi bi-exclamation-circle-fill"
                                aria-hidden="true"
                            />
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="fh-auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="fh-auth-field">
                            <label htmlFor="login-email">Email</label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.email ? "has-error" : ""
                                }`}
                            >
                                <i className="bi bi-envelope" aria-hidden="true" />
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email ? "login-email-error" : undefined
                                    }
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <span
                                    className="fh-auth-field-error"
                                    id="login-email-error"
                                >
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="fh-auth-field">
                            <label htmlFor="login-password">Password</label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.password ? "has-error" : ""
                                }`}
                            >
                                <i className="bi bi-lock" aria-hidden="true" />
                                <input
                                    id="login-password"
                                    type={eyeToggle ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password
                                            ? "login-password-error"
                                            : undefined
                                    }
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className="fh-auth-password-toggle"
                                    onClick={() => setEyeToggle(!eyeToggle)}
                                    aria-label={
                                        eyeToggle ? "Hide password" : "Show password"
                                    }
                                >
                                    <i
                                        className={`bi ${
                                            eyeToggle ? "bi-eye" : "bi-eye-slash"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            {errors.password && (
                                <span
                                    className="fh-auth-field-error"
                                    id="login-password-error"
                                >
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="foodhub-button-primary fh-auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        aria-hidden="true"
                                    />
                                    Logging in…
                                </>
                            ) : (
                                <>
                                    <i
                                        className="bi bi-box-arrow-in-right"
                                        aria-hidden="true"
                                    />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <p className="fh-auth-switch">
                        Don’t have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>
                    <Link to="/home" className="fh-auth-back">
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Login;
