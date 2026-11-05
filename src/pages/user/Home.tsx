import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../../services/menu.api";
import type { MenuItem } from "../../types/menu.types";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { getMenuImageSrc } from "../../utils/menuImage";
import "./Home.css";

const heroImages = [
    {
        src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
        alt: "A freshly prepared burger",
        className: "fh-home-hero-image--burger",
    },
    {
        src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
        alt: "A freshly prepared pizza",
        className: "fh-home-hero-image--pizza",
    },
    {
        src: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1200&q=85",
        alt: "A cold drink served over ice",
        className: "fh-home-hero-image--drink",
    },
];

function Home() {
    const navigate = useNavigate();
    const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCurrent = true;

        getMenu({ page: 1, limit: 3, sort: "newest" })
            .then((response) => {
                if (isCurrent) {
                    setFeaturedItems(response.items.slice(0, 3));
                }
            })
            .catch((requestError: unknown) => {
                if (isCurrent) {
                    setError(
                        getApiErrorMessage(requestError, "Failed to load menu")
                    );
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return (
        <div className="fh-home">
            <section
                id="heroFoodCarousel"
                className="carousel slide carousel-fade fh-home-hero"
                data-bs-ride="carousel"
                data-bs-interval="5000"
                data-bs-touch="true"
                aria-label="FoodHub introduction"
            >
                <div className="carousel-indicators fh-home-indicators">
                    {heroImages.map((image, index) => (
                        <button
                            key={image.className}
                            type="button"
                            data-bs-target="#heroFoodCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-label={`Show food image ${index + 1}`}
                            aria-current={index === 0 ? "true" : undefined}
                        />
                    ))}
                </div>

                <div className="carousel-inner">
                    {heroImages.map((image, index) => (
                        <div
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            key={image.className}
                        >
                            <div className="fh-home-hero-panel">
                                <div className="container fh-home-hero-container">
                                    <div className="fh-home-hero-copy">
                                        <span className="fh-home-eyebrow">
                                            <span aria-hidden="true" />
                                            GOOD FOOD, YOUR WAY
                                        </span>
                                        <h1>
                                            Make room for
                                            <br />
                                            <span>something delicious.</span>
                                        </h1>
                                        <p>
                                            Find the dish that sounds just right.
                                            Your next favorite is waiting in the
                                            FoodHub menu.
                                        </p>
                                        <button
                                            type="button"
                                            className="foodhub-button-primary fh-home-hero-cta"
                                            onClick={() => navigate("/menu")}
                                        >
                                            Explore the menu
                                            <i
                                                className="bi bi-arrow-up-right"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <div className="fh-home-hero-note">
                                            <i
                                                className="bi bi-heart"
                                                aria-hidden="true"
                                            />
                                            <span>A little joy in every order</span>
                                        </div>
                                    </div>

                                    <div className="fh-home-hero-visual">
                                        <div className="fh-home-hero-image-wrap">
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className={`fh-home-hero-image ${image.className}`}
                                            />
                                        </div>
                                        <div
                                            className="fh-home-hero-sticker"
                                            aria-hidden="true"
                                        >
                                            <i className="bi bi-egg-fried" />
                                            <span>Made for<br />your cravings</span>
                                        </div>
                                        <span
                                            className="fh-home-hero-sparkle fh-home-hero-sparkle--one"
                                            aria-hidden="true"
                                        >
                                            ✳
                                        </span>
                                        <span
                                            className="fh-home-hero-sparkle fh-home-hero-sparkle--two"
                                            aria-hidden="true"
                                        >
                                            ✦
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-control-prev fh-home-carousel-control"
                    type="button"
                    data-bs-target="#heroFoodCarousel"
                    data-bs-slide="prev"
                    aria-label="Previous featured image"
                >
                    <span className="fh-home-control-icon" aria-hidden="true">
                        <i className="bi bi-arrow-left" />
                    </span>
                </button>
                <button
                    className="carousel-control-next fh-home-carousel-control"
                    type="button"
                    data-bs-target="#heroFoodCarousel"
                    data-bs-slide="next"
                    aria-label="Next featured image"
                >
                    <span className="fh-home-control-icon" aria-hidden="true">
                        <i className="bi bi-arrow-right" />
                    </span>
                </button>
            </section>

            <section className="fh-home-featured" aria-labelledby="fh-home-featured-title">
                <div className="container">
                    <div className="fh-home-section-heading">
                        <div>
                            <span className="fh-home-eyebrow">FROM OUR MENU</span>
                            <h2 id="fh-home-featured-title">
                                Made for your <span>cravings.</span>
                            </h2>
                            <p>
                                Take a look at a few of the dishes on the menu.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="foodhub-button-secondary fh-home-view-menu"
                            onClick={() => navigate("/menu")}
                        >
                            View full menu
                            <i className="bi bi-arrow-up-right" aria-hidden="true" />
                        </button>
                    </div>

                    {loading && (
                        <div
                            className="fh-home-featured-state"
                            role="status"
                            aria-live="polite"
                        >
                            <span className="spinner-border" aria-hidden="true" />
                            <span>Loading the menu…</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="fh-home-featured-state fh-home-featured-error" role="alert">
                            <i className="bi bi-exclamation-circle" aria-hidden="true" />
                            <span>{error}</span>
                            <button
                                type="button"
                                className="foodhub-button-secondary"
                                onClick={() => navigate("/menu")}
                            >
                                Open menu
                            </button>
                        </div>
                    )}

                    {!loading && !error && featuredItems.length > 0 && (
                        <div className="fh-home-dish-grid">
                            {featuredItems.map((item) => {
                                const imageSrc = getMenuImageSrc(item.image);

                                return (
                                    <article className="fh-home-dish-card" key={item.id}>
                                        <div className="fh-home-dish-image-wrap">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={item.name}
                                                    className="fh-home-dish-image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div
                                                    className="fh-home-dish-image-placeholder"
                                                    aria-label="No image available"
                                                    role="img"
                                                >
                                                    <i className="bi bi-egg-fried" aria-hidden="true" />
                                                </div>
                                            )}
                                            <span className="fh-home-dish-category">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="fh-home-dish-content">
                                            <div className="fh-home-dish-title-row">
                                                <h3>{item.name}</h3>
                                                <span className="fh-home-dish-price">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <p>{item.description}</p>
                                            <div className="fh-home-dish-meta">
                                                {typeof item.averageRating === "number" &&
                                                    typeof item.totalReviews === "number" &&
                                                    item.totalReviews > 0 && (
                                                        <span>
                                                            <i className="bi bi-star-fill" aria-hidden="true" />
                                                            {item.averageRating.toFixed(1)}
                                                            <span className="fh-home-review-count">
                                                                ({item.totalReviews})
                                                            </span>
                                                        </span>
                                                    )}
                                                <span
                                                    className={
                                                        item.isAvailable
                                                            ? "fh-home-availability"
                                                            : "fh-home-availability fh-home-availability--off"
                                                    }
                                                >
                                                    <span aria-hidden="true" />
                                                    {item.isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {!loading && !error && featuredItems.length === 0 && (
                        <div className="fh-home-featured-state">
                            <i className="bi bi-basket" aria-hidden="true" />
                            <span>There are no menu items to feature right now.</span>
                            <button
                                type="button"
                                className="foodhub-button-secondary"
                                onClick={() => navigate("/menu")}
                            >
                                Browse menu
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="fh-home-how" aria-labelledby="fh-home-how-title">
                <div className="container fh-home-how-layout">
                    <div className="fh-home-how-copy">
                        <span className="fh-home-eyebrow">A SIMPLE WAY TO ORDER</span>
                        <h2 id="fh-home-how-title">
                            Good food is just a <span>few steps away.</span>
                        </h2>
                        <p>
                            Browse the menu, choose what sounds good, and place
                            your order—all in one place.
                        </p>
                        <button
                            type="button"
                            className="foodhub-button-primary"
                            onClick={() => navigate("/menu")}
                        >
                            Find your next meal
                            <i className="bi bi-arrow-right" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="fh-home-steps" aria-label="How ordering works">
                        <div className="fh-home-step">
                            <span className="fh-home-step-number">01</span>
                            <span className="fh-home-step-icon" aria-hidden="true">
                                <i className="bi bi-search" />
                            </span>
                            <div>
                                <h3>Explore</h3>
                                <p>Find dishes on the FoodHub menu.</p>
                            </div>
                        </div>
                        <div className="fh-home-step">
                            <span className="fh-home-step-number">02</span>
                            <span className="fh-home-step-icon" aria-hidden="true">
                                <i className="bi bi-bag-heart" />
                            </span>
                            <div>
                                <h3>Choose</h3>
                                <p>Add your picks to your cart.</p>
                            </div>
                        </div>
                        <div className="fh-home-step">
                            <span className="fh-home-step-number">03</span>
                            <span className="fh-home-step-icon" aria-hidden="true">
                                <i className="bi bi-emoji-smile" />
                            </span>
                            <div>
                                <h3>Enjoy</h3>
                                <p>Place your order when you’re ready.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="fh-home-cta">
                <div className="container">
                    <div className="fh-home-cta-panel">
                        <div>
                            <span className="fh-home-eyebrow">YOUR NEXT BITE</span>
                            <h2>Find something delicious.</h2>
                            <p>Explore the menu and choose what you’re craving.</p>
                        </div>
                        <button
                            type="button"
                            className="fh-home-cta-button"
                            onClick={() => navigate("/menu")}
                        >
                            Explore the menu
                            <i className="bi bi-arrow-right" aria-hidden="true" />
                        </button>
                        <span className="fh-home-cta-decoration" aria-hidden="true">
                            ✳
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
