import { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, decreaseQuantity } from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMenu } from "../../store/slices/menuSlice";
import { getMenuImageSrc } from "../../utils/menuImage";
import Toast from "../../components/common/Toast";
import type { MenuItem, MenuQuery, MenuSort, } from "../../types/menu.types";
import Pagination from "../../components/common/Pagination";

export function Menu() {

    const dispatch = useAppDispatch();

    const navigate = useNavigate()

    const { data, loading, error, } = useAppSelector((state) => state.menu);

    const user = useAppSelector((state) => state.auth.user);

    const [showLoginToast, setShowLoginToast] = useState(false);

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            setShowLoginToast(true);

            setTimeout(() => {
                navigate("/login", { state: { from: "/menu", }, });
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

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [sort, setSort] = useState<MenuSort>("newest");

    const [page, setPage] = useState(1);

    const limit = 8;

    const cartItems = useAppSelector((state) => state.cart.items);

    useEffect(() => {

        const query: MenuQuery = { page, limit, sort, };

        if (search.trim()) {
            query.search = search.trim();
        }

        if (category) {
            query.category = category;
        }

        dispatch(fetchMenu(query));

    }, [dispatch, page, search, category, sort,]);

    const items = data?.items ?? [];

    const pagination = data?.pagination;

    return (

        <div className="container py-5">

            <Toast message="Please login first to add items to your cart." show={showLoginToast}
                onClose={() => setShowLoginToast(false)} type="warning" />

            <div className="mb-5">
                <div className="text-center">
                    <span className="badge text-bg-primary mb-3">
                        Fresh & Delicious
                    </span>

                    <h1 className="display-5 fw-bold mb-2">
                        Our Menu
                    </h1>

                    <p className="text-secondary mb-0">
                        Discover something delicious and order your favorite meal.
                    </p>
                </div>
            </div>

            {/* Filters */}

            <div className="card border-0 shadow-sm rounded-4 mb-5">
                <div className="card-body p-4">
                    <div className="row g-3">

                        <div className="col-md-5">
                            <label className="form-label fw-semibold">
                                Search
                            </label>

                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-search" />
                                </span>

                                <input type="text" className="form-control" placeholder="Search for food..." value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Category
                            </label>

                            <select className="form-select menu-filter-select" value={category}
                                onChange={(event) => {
                                    setCategory(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Categories</option>
                                <option value="Burger">Burger</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Drinks">Drinks</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Sort By
                            </label>

                            <select className="form-select menu-filter-select" value={sort}
                                onChange={(event) => {
                                    setSort(event.target.value as MenuSort);
                                    setPage(1);
                                }}
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">
                                    Price: Low to High
                                </option>
                                <option value="price_desc">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>

            {/* Loading */}

            {loading && (
                <div className="py-5">
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="text-secondary mb-0">
                            Loading delicious food...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}

            {!loading && error && (
                <div className="py-5">
                    <div className="text-center">
                        <div className="mb-3">
                            <i className="bi bi-exclamation-triangle fs-1 text-danger" />
                        </div>

                        <h4 className="fw-bold">
                            Something went wrong
                        </h4>

                        <p className="text-secondary mb-0">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty */}

            {!loading && !error &&
                items.length === 0 && (
                    <div className="py-5">
                        <div className="text-center py-5">

                            <div className="mb-4">
                                <i className="bi bi-search fs-1 text-secondary" />
                            </div>

                            <h4 className="fw-bold">
                                No food found
                            </h4>

                            <p className="text-secondary mb-4">
                                We couldn't find anything matching your
                                search or filters.
                            </p>

                            <button type="button" className="btn btn-outline-dark"
                                onClick={() => {
                                    setSearch("");
                                    setCategory("");
                                    setSort("newest");
                                    setPage(1);
                                }}
                            >
                                <i className="bi bi-arrow-counterclockwise me-2" />
                                Clear Filters
                            </button>

                        </div>
                    </div>
                )}

            {/* Menu */}

            {!loading && !error && items.length > 0 &&
                (<div className="row g-4">

                    {items.map((item) => {

                        const cartItem = cartItems.find((cartItem) => cartItem.menuItemId === item.id);

                        return (
                            <div className="col-sm-6 col-lg-4 col-xl-3" key={item.id} >

                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                                    {/* Image */}
                                    <div
                                        className="position-relative menu-item-image"
                                    >

                                        {/* Image */}
                                        {getMenuImageSrc(item.image) ? (
                                            <img
                                                src={getMenuImageSrc(item.image)!}
                                                alt={item.name}
                                                className="w-100 h-100"
                                            />
                                        ) : (
                                            <div
                                                className="bg-light d-flex align-items-center justify-content-center w-100 h-100"
                                            >
                                                <i className="bi bi-image text-secondary fs-1" />
                                            </div>
                                        )}

                                        {/* Image gradient */}
                                        <div
                                            className="position-absolute bottom-0 start-0 w-100 menu-item-image-overlay"
                                        />

                                        {cartItem && (
                                            <span className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2 text-bg-success">
                                                In Cart
                                            </span>
                                        )}

                                        {/* Availability */}
                                        <span
                                            className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2 ${item.isAvailable
                                                ? "text-bg-primary"
                                                : "text-bg-danger"
                                                }`}
                                        >
                                            <i
                                                className={`bi ${item.isAvailable
                                                    ? "bi-circle-fill"
                                                    : "bi-eye-slash-fill"
                                                    } me-1`}
                                            />
                                            {item.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                        {/* Image Bottom Content */}
                                        <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">

                                            <div className="mb-2">
                                                <span className="badge bg-black bg-opacity-50 text-white rounded-pill px-3 py-2">
                                                    {item.category}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-end gap-3">

                                                <h4 className="fw-bold mb-0 menu-item-title">
                                                    {item.name}
                                                </h4>

                                                <strong className="fs-5 text-nowrap">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Content */}
                                    <div className="card-body d-flex flex-column p-4">

                                        <p className="text-secondary small mb-3 fs-6">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto">

                                            {/* Cart Actions */}
                                            {cartItem ?
                                                (<div className="d-flex gap-2">

                                                    <button type="button" className="btn btn-success flex-grow-1 w-50"
                                                        disabled={!item.isAvailable}
                                                        onClick={() => {
                                                            dispatch(
                                                                addToCart({
                                                                    menuItemId: item.id,
                                                                    name: item.name,
                                                                    price: Number(item.price),
                                                                    image: item.image,
                                                                    quantity: 1,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <i className="bi bi-plus-lg me-1" />
                                                        Add
                                                    </button>

                                                    <button type="button" className="btn btn-outline-danger flex-grow-1 w-50"
                                                        onClick={() => {
                                                            dispatch(
                                                                decreaseQuantity(item.id)
                                                            );
                                                        }}
                                                    >
                                                        <i className="bi bi-dash-lg me-1" />
                                                        Remove
                                                    </button>

                                                </div>)
                                                :
                                                (<button type="button" className="btn btn-primary w-100" disabled={!item.isAvailable}
                                                    onClick={() => handleAddToCart(item)} >
                                                    <i className="bi bi-cart-plus me-2" />
                                                    Add to Cart
                                                </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>)
            }

            {/* Pagination */}

            <Pagination
                currentPage={page}
                totalPages={pagination?.totalPages ?? 0}
                onPageChange={setPage}
            />

        </div>
    );
}