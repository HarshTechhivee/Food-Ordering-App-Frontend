import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminMenu, updateAdminMenuAvailabilityThunk, deleteAdminMenu } from "../../store/slices/adminMenuSlice.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import ConfirmModal from "../../components/common/ConfirmModal";
import type { MenuQuery, MenuSort, } from "../../types/menu.types.js";
import Pagination from "../../components/common/Pagination";

export const SERVER_URL = process.env.SERVER_URL;

function MenuManagement() {

    const dispatch = useAppDispatch();

    const { items, loading, error } = useAppSelector((state) => state.adminMenu);

    const pagination = useAppSelector((state) => state.adminMenu.pagination);

    const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [sort, setSort] = useState<MenuSort>("newest");

    const [page, setPage] = useState(1);

    const limit = 8;

    useEffect(() => {
        const query: MenuQuery = {
            page,
            limit,
            sort,
        };

        if (search.trim()) {
            query.search = search.trim();
        }

        if (category) {
            query.category = category;
        }

        dispatch(fetchAdminMenu(query));
    }, [dispatch, page, search, category, sort]);

    const handleAvailabilityChange = async (id: number, isAvailable: boolean) => {

        try {

            await dispatch(updateAdminMenuAvailabilityThunk({ id, isAvailable, })).unwrap();

        } catch (error) {

            console.error(error);
        }
    };

    const handleDelete = (id: number) => {
        setDeleteItemId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteItemId === null) return;

        try {
            await dispatch(deleteAdminMenu(deleteItemId)).unwrap();

            setDeleteItemId(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>

            <ConfirmModal
                show={deleteItemId !== null}
                title="Delete Menu Item"
                message="Are you sure you want to delete this menu item? This action will remove it from the active menu."
                confirmText="Delete Item"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteItemId(null)}
                loading={loading}
            />

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                <div>

                    <span className="badge text-bg-primary mb-3">
                        Restaurant Menu
                    </span>

                    <h1 className="display-5 fw-bold mb-2">
                        Menu Management
                    </h1>

                    <p className="text-secondary mb-0">
                        Manage your restaurant's menu items, availability, and pricing.
                    </p>

                </div>

                <Link to="/admin/menu/create" className="btn btn-primary" >
                    <i className="bi bi-plus-lg me-2" />
                    Add Menu Item
                </Link>

            </div>

            {loading && (
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
                        Loading menu items...
                    </p>

                </div>
            )}

            {error && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">

                    <div className="card-body text-center py-5">

                        <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center 
                            justify-content-center mx-auto mb-3 foodhub-icon--70">
                            <i className="bi bi-exclamation-circle fs-3" />
                        </div>

                        <h5 className="fw-bold mb-2">
                            Unable to load menu
                        </h5>

                        <p className="text-secondary mb-0">
                            {error}
                        </p>

                    </div>

                </div>
            )}

            {!loading && items.length === 0 && !error && (
                <div className="card border-0 shadow-sm rounded-4">

                    <div className="card-body text-center py-5">

                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center 
                            justify-content-center mx-auto mb-4 foodhub-icon--90">
                            <i className="bi bi-menu-button-wide fs-1" />
                        </div>

                        <h4 className="fw-bold mb-2">
                            No menu items yet
                        </h4>

                        <p className="text-secondary mb-4">
                            Start building your restaurant menu by adding your first item.
                        </p>

                        <Link
                            to="/admin/menu/create"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-plus-lg me-2" />
                            Add Menu Item
                        </Link>

                    </div>

                </div>
            )}

            {/* Filters */}
            <div className="card border-0 shadow-sm rounded-4 mb-5">
                <div className="card-body p-4">

                    <div className="row g-3">

                        {/* Search */}
                        <div className="col-md-5">
                            <label className="form-label fw-semibold">
                                Search
                            </label>

                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-search" />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for food..."
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Category
                            </label>

                            <select
                                className="form-select"
                                value={category}
                                onChange={(event) => {
                                    setCategory(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">
                                    All Categories
                                </option>

                                <option value="Burger">
                                    Burger
                                </option>

                                <option value="Pizza">
                                    Pizza
                                </option>

                                <option value="Drinks">
                                    Drinks
                                </option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Sort By
                            </label>

                            <select
                                className="form-select"
                                value={sort}
                                onChange={(event) => {
                                    setSort(
                                        event.target.value as MenuSort
                                    );
                                    setPage(1);
                                }}
                            >
                                <option value="newest">
                                    Newest
                                </option>

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

            <div className="row g-4">

                {items.map((item) => (
                    <div
                        className="col-sm-6 col-xl-3"
                        key={item.id}
                    >
                        <div
                            className="card h-100 border-0 overflow-hidden menu-item-card"
                        >

                            {/* Image + Overlay */}
                            <div
                                className="position-relative menu-item-image"
                            >

                                {/* Image */}
                                {item.image ? (
                                    <img
                                        src={`${SERVER_URL}${item.image}`}
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

                                {/* Active */}
                                <span
                                    className={`position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2 ${item.isActive
                                        ? "text-bg-success"
                                        : "text-bg-secondary"
                                        }`}
                                >
                                    <i
                                        className={`bi ${item.isActive
                                            ? "bi-check-circle-fill"
                                            : "bi-dash-circle-fill"
                                            } me-1`}
                                    />
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>

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
                                        <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-2">
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
                            <div className="card-body p-4">

                                <p className="text-secondary mb-2 menu-item-description">
                                    {item.description}
                                </p>

                                {/* Actions */}
                                <div className="card-footer bg-white border-0 px-4 pb-2 menu-card-footer">

                                    <div className="border-top pt-3">

                                        <div className="d-flex justify-content-around align-items-start admin-menu-actions">

                                            {/* Edit */}
                                            <Link
                                                to={`/admin/menu/edit/${item.id}`}
                                                className="text-decoration-none text-center"
                                            >
                                                <div
                                                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-2 foodhub-icon--48"
                                                >
                                                    <i className="bi bi-pencil fs-5" />
                                                </div>

                                                <small className="text-dark fw-medium">
                                                    Edit
                                                </small>
                                            </Link>

                                            {/* Availability */}
                                            {item.isActive && (
                                                <button
                                                    type="button"
                                                    className="border-0 bg-transparent p-0 text-center"
                                                    onClick={() =>
                                                        handleAvailabilityChange(
                                                            item.id,
                                                            !item.isAvailable
                                                        )
                                                    }
                                                >
                                                    <div
                                                        className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${item.isAvailable
                                                            ? "bg-warning-subtle text-warning"
                                                            : "bg-success-subtle text-success"
                                                            } foodhub-icon--48`}
                                                    >
                                                        <i
                                                            className={`bi ${item.isAvailable
                                                                ? "bi-eye-slash"
                                                                : "bi-eye"
                                                                } fs-5`}
                                                        />
                                                    </div>

                                                    <small className="text-dark fw-medium">
                                                        {item.isAvailable
                                                            ? "Unavailable"
                                                            : "Available"}
                                                    </small>
                                                </button>
                                            )}

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                className="border-0 bg-transparent p-0 text-center"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={!item.isActive}
                                            >
                                                <div
                                                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${item.isActive
                                                        ? "bg-danger-subtle text-danger"
                                                        : "bg-light text-secondary"
                                                        } foodhub-icon--48`}
                                                >
                                                    <i className="bi bi-trash fs-5" />
                                                </div>

                                                <small
                                                    className={
                                                        item.isActive
                                                            ? "text-dark fw-medium"
                                                            : "text-secondary"
                                                    }
                                                >
                                                    Delete
                                                </small>
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

            <Pagination
                currentPage={page}
                totalPages={pagination?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </div>
    );
}

export default MenuManagement;