import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, decreaseQuantity } from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMenu } from "../../store/slices/menuSlice";
import { getMenuImageSrc } from "../../utils/menuImage";
import Toast from "../../components/common/Toast";
import type { MenuItem, MenuQuery, MenuSort } from "../../types/menu.types";
import Pagination from "../../components/common/Pagination";
import MenuReviewsModal from "../../components/common/MenuReviewsModal";
import "./Menu.css";

const categories = ["", "Burger", "Pizza", "Drinks"];

export function Menu() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, loading, error } = useAppSelector((state) => state.menu);
    const user = useAppSelector((state) => state.auth.user);
    const cartItems = useAppSelector((state) => state.cart.items);

    const [showLoginToast, setShowLoginToast] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState<MenuSort>("newest");
    const [page, setPage] = useState(1);
    const [selectedReviewItem, setSelectedReviewItem] =
        useState<MenuItem | null>(null);

    const limit = 8;

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            setShowLoginToast(true);

            setTimeout(() => {
                navigate("/login", { state: { from: "/menu" } });
            }, 3000);

            return;
        }

        dispatch(
            addToCart({
                menuItemId: item.id,
                name: item.name,
                price: Number(item.price),
                image: item.image,
                quantity: 1,
            })
        );
    };

    useEffect(() => {
        const query: MenuQuery = { page, limit, sort };

        if (search.trim()) {
            query.search = search.trim();
        }

        if (category) {
            query.category = category;
        }

        dispatch(fetchMenu(query));
    }, [dispatch, page, search, category, sort]);

    const items = data?.items ?? [];
    const pagination = data?.pagination;

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setSort("newest");
        setPage(1);
    };

    return (
        <div className="fh-menu-page">
            <Toast
                message="Please login first to add items to your cart."
                show={showLoginToast}
                onClose={() => setShowLoginToast(false)}
                type="warning"
            />

            <header className="fh-menu-hero">
                <div className="container fh-menu-hero-layout">
                    <div className="fh-menu-hero-copy">
                        <span className="fh-menu-eyebrow">
                            <span aria-hidden="true" />
                            FIND YOUR NEXT FAVORITE
                        </span>
                        <h1>
                            A menu full of
                            <br />
                            {" "}
                            <span>good ideas.</span>
                        </h1>
                        <p>
                            Explore the FoodHub menu and find a dish that sounds
                            just right.
                        </p>
                        <label className="fh-menu-search">
                            <i className="bi bi-search" aria-hidden="true" />
                            <span className="visually-hidden">Search menu</span>
                            <input
                                type="search"
                                value={search}
                                placeholder="Search dishes..."
                                aria-label="Search dishes"
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                            />
                            {search && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={() => {
                                        setSearch("");
                                        setPage(1);
                                    }}
                                >
                                    <i className="bi bi-x-lg" aria-hidden="true" />
                                </button>
                            )}
                        </label>
                    </div>
                    <div className="fh-menu-hero-visual" aria-hidden="true">
                        <img
                            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1100&q=85"
                            alt=""
                        />
                        <span className="fh-menu-hero-sticker">
                            <i className="bi bi-egg-fried" />
                            GOOD FOOD
                        </span>
                        <span className="fh-menu-hero-sparkle">✳</span>
                    </div>
                </div>
            </header>

            <div className="fh-menu-main">
                <div className="container">
                    <section className="fh-menu-category-section" aria-labelledby="fh-menu-category-heading">
                        <div>
                            <span className="fh-menu-eyebrow">BROWSE BY CATEGORY</span>
                            <h2 id="fh-menu-category-heading">What are you in the mood for?</h2>
                        </div>
                        <div className="fh-menu-category-list" role="group" aria-label="Filter menu by category">
                            {categories.map((itemCategory) => (
                                <button
                                    type="button"
                                    className={`fh-menu-category-chip ${
                                        category === itemCategory ? "is-active" : ""
                                    }`}
                                    key={itemCategory || "all"}
                                    aria-pressed={category === itemCategory}
                                    onClick={() => {
                                        setCategory(itemCategory);
                                        setPage(1);
                                    }}
                                >
                                    {itemCategory || "All dishes"}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="fh-menu-toolbar" aria-label="Menu controls">
                        <div className="fh-menu-result-count" aria-live="polite">
                            {loading
                                ? "Updating the menu..."
                                : pagination
                                  ? `${pagination.total} ${
                                        pagination.total === 1 ? "dish" : "dishes"
                                    }`
                                  : "Menu"}
                        </div>
                        <label className="fh-menu-sort">
                            <span>Sort by</span>
                            <select
                                value={sort}
                                onChange={(event) => {
                                    setSort(event.target.value as MenuSort);
                                    setPage(1);
                                }}
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                            <i className="bi bi-chevron-down" aria-hidden="true" />
                        </label>
                    </section>

                    {loading && (
                        <div className="fh-menu-state" role="status" aria-live="polite">
                            <span className="fh-menu-spinner" aria-hidden="true" />
                            <h2>Loading the menu</h2>
                            <p>Just a moment while we bring up the dishes.</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="fh-menu-state fh-menu-state--error" role="alert">
                            <span className="fh-menu-state-icon" aria-hidden="true">
                                <i className="bi bi-exclamation-circle" />
                            </span>
                            <h2>We couldn’t load the menu.</h2>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && items.length === 0 && (
                        <div className="fh-menu-state fh-menu-state--empty">
                            <span className="fh-menu-state-icon" aria-hidden="true">
                                <i className="bi bi-search" />
                            </span>
                            <h2>
                                {category
                                    ? `No ${category.toLowerCase()} dishes found.`
                                    : "No matching dishes found."}
                            </h2>
                            <p>
                                Try another search or clear the filters to browse
                                the full menu.
                            </p>
                            <button
                                type="button"
                                className="foodhub-button-secondary"
                                onClick={clearFilters}
                            >
                                <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                                Clear filters
                            </button>
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <div className="fh-menu-grid" aria-live="polite">
                            {items.map((item) => {
                                const cartItem = cartItems.find(
                                    (currentItem) =>
                                        currentItem.menuItemId === item.id
                                );
                                const imageSrc = getMenuImageSrc(item.image);
                                const hasReviews = (item.totalReviews ?? 0) > 0;

                                return (
                                    <article className="fh-menu-card" key={item.id}>
                                        <div className="fh-menu-card-image-wrap">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={item.name}
                                                    className="fh-menu-card-image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div
                                                    className="fh-menu-card-image-placeholder"
                                                    role="img"
                                                    aria-label={`No image available for ${item.name}`}
                                                >
                                                    <i className="bi bi-egg-fried" aria-hidden="true" />
                                                </div>
                                            )}
                                            <span
                                                className={`fh-menu-card-availability ${
                                                    item.isAvailable
                                                        ? ""
                                                        : "is-unavailable"
                                                }`}
                                            >
                                                <span
                                                    className={
                                                        item.isAvailable
                                                            ? "fh-menu-status-dot"
                                                            : "fh-menu-status-dot is-unavailable"
                                                    }
                                                    aria-hidden="true"
                                                />
                                                {item.isAvailable
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                            {cartItem && (
                                                <span className="fh-menu-card-in-cart">
                                                    <i className="bi bi-check2" aria-hidden="true" />
                                                    In your cart
                                                </span>
                                            )}
                                        </div>

                                        <div className="fh-menu-card-body">
                                            <span className="fh-menu-card-category">
                                                {item.category}
                                            </span>
                                            <div className="fh-menu-card-title-row">
                                                <h3>{item.name}</h3>
                                                <span className="fh-menu-card-price">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="fh-menu-rating"
                                                onClick={() =>
                                                    setSelectedReviewItem(item)
                                                }
                                                aria-label={
                                                    hasReviews
                                                        ? `View reviews for ${item.name}`
                                                        : `No reviews yet for ${item.name}`
                                                }
                                                disabled={!hasReviews}
                                            >
                                                <i
                                                    className={`bi ${
                                                        hasReviews
                                                            ? "bi-star-fill"
                                                            : "bi-star"
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                                {hasReviews ? (
                                                    <>
                                                        <strong>
                                                            {Number(
                                                                item.averageRating ?? 0
                                                            ).toFixed(1)}
                                                        </strong>
                                                        <span>
                                                            {item.totalReviews}{" "}
                                                            {item.totalReviews === 1
                                                                ? "review"
                                                                : "reviews"}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>No reviews yet</span>
                                                )}
                                            </button>
                                            <p className="fh-menu-card-description">
                                                {item.description}
                                            </p>
                                            <div className="fh-menu-card-actions">
                                                {cartItem ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="foodhub-button-primary fh-menu-cart-add"
                                                            disabled={!item.isAvailable}
                                                            aria-label={`Add another ${item.name} to cart`}
                                                            onClick={() =>
                                                                handleAddToCart(item)
                                                            }
                                                        >
                                                            <i
                                                                className="bi bi-plus-lg"
                                                                aria-hidden="true"
                                                            />
                                                            Add
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="fh-menu-cart-remove"
                                                            aria-label={`Remove one ${item.name} from cart`}
                                                            onClick={() =>
                                                                dispatch(
                                                                    decreaseQuantity(item.id)
                                                                )
                                                            }
                                                        >
                                                            <i
                                                                className="bi bi-dash-lg"
                                                                aria-hidden="true"
                                                            />
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="foodhub-button-primary fh-menu-cart-add fh-menu-cart-add--full"
                                                        disabled={!item.isAvailable}
                                                        onClick={() =>
                                                            handleAddToCart(item)
                                                        }
                                                    >
                                                        <i
                                                            className="bi bi-bag-plus"
                                                            aria-hidden="true"
                                                        />
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <Pagination
                        currentPage={page}
                        totalPages={pagination?.totalPages ?? 0}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            <MenuReviewsModal
                key={selectedReviewItem?.id ?? "closed"}
                menuItem={selectedReviewItem}
                onClose={() => setSelectedReviewItem(null)}
            />
        </div>
    );
}
