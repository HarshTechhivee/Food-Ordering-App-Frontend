import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import {
    registerSchema,
    type RegisterFormData,
} from "../../schemas/auth.schema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, register } from "../../store/slices/authSlice";
import "./Auth.css";

function Register() {
    const [eyePassword, setEyePassword] = useState(false);
    const [eyeConfirmPassword, setEyeConfirmPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useAppSelector(
        (state) => state.auth
    );
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
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
        <main className="fh-auth-page fh-auth-page--register">
            <section className="fh-auth-visual">
                <Link to="/home" className="fh-auth-logo">
                    Food<span>Hub</span>
                </Link>
                <div className="fh-auth-visual-image" role="img" aria-label="Freshly prepared meal">
                    <div className="fh-auth-visual-copy">
                        <span className="fh-auth-eyebrow">A SEAT AT THE TABLE</span>
                        <h1>Good food starts with a good choice.</h1>
                        <p>Create your account and explore the FoodHub menu.</p>
                    </div>
                </div>
                <span className="fh-auth-visual-caption">
                    Delicious food, made simple.
                </span>
            </section>

            <section className="fh-auth-form-section">
                <div className="fh-auth-form-wrap">
                    <Link to="/home" className="fh-auth-mobile-logo">
                        Food<span>Hub</span>
                    </Link>
                    <header className="fh-auth-form-heading">
                        <span className="fh-auth-eyebrow">JOIN FOODHUB</span>
                        <h2>Create your account.</h2>
                        <p>Get started and find something delicious.</p>
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
                            <label htmlFor="register-name">Name</label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.name ? "has-error" : ""
                                }`}
                            >
                                <i className="bi bi-person" aria-hidden="true" />
                                <input
                                    id="register-name"
                                    type="text"
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name ? "register-name-error" : undefined
                                    }
                                    {...registerField("name")}
                                />
                            </div>
                            {errors.name && (
                                <span
                                    className="fh-auth-field-error"
                                    id="register-name-error"
                                >
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className="fh-auth-field">
                            <label htmlFor="register-email">Email</label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.email ? "has-error" : ""
                                }`}
                            >
                                <i className="bi bi-envelope" aria-hidden="true" />
                                <input
                                    id="register-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email
                                            ? "register-email-error"
                                            : undefined
                                    }
                                    {...registerField("email")}
                                />
                            </div>
                            {errors.email && (
                                <span
                                    className="fh-auth-field-error"
                                    id="register-email-error"
                                >
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="fh-auth-field">
                            <label htmlFor="register-password">Password</label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.password ? "has-error" : ""
                                }`}
                            >
                                <i className="bi bi-lock" aria-hidden="true" />
                                <input
                                    id="register-password"
                                    type={eyePassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password
                                            ? "register-password-error"
                                            : undefined
                                    }
                                    {...registerField("password")}
                                />
                                <button
                                    type="button"
                                    className="fh-auth-password-toggle"
                                    onClick={() =>
                                        setEyePassword(!eyePassword)
                                    }
                                    aria-label={
                                        eyePassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <i
                                        className={`bi ${
                                            eyePassword
                                                ? "bi-eye"
                                                : "bi-eye-slash"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            {errors.password && (
                                <span
                                    className="fh-auth-field-error"
                                    id="register-password-error"
                                >
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="fh-auth-field">
                            <label htmlFor="register-confirm-password">
                                Confirm password
                            </label>
                            <div
                                className={`fh-auth-input-wrap ${
                                    errors.confirmPassword ? "has-error" : ""
                                }`}
                            >
                                <i
                                    className="bi bi-shield-lock"
                                    aria-hidden="true"
                                />
                                <input
                                    id="register-confirm-password"
                                    type={
                                        eyeConfirmPassword ? "text" : "password"
                                    }
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(errors.confirmPassword)}
                                    aria-describedby={
                                        errors.confirmPassword
                                            ? "register-confirm-password-error"
                                            : undefined
                                    }
                                    {...registerField("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="fh-auth-password-toggle"
                                    onClick={() =>
                                        setEyeConfirmPassword(
                                            !eyeConfirmPassword
                                        )
                                    }
                                    aria-label={
                                        eyeConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <i
                                        className={`bi ${
                                            eyeConfirmPassword
                                                ? "bi-eye"
                                                : "bi-eye-slash"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span
                                    className="fh-auth-field-error"
                                    id="register-confirm-password-error"
                                >
                                    {errors.confirmPassword.message}
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
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    <i
                                        className="bi bi-person-plus"
                                        aria-hidden="true"
                                    />
                                    Create account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="fh-auth-switch">
                        Already have an account? <Link to="/login">Login</Link>
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

export default Register;
