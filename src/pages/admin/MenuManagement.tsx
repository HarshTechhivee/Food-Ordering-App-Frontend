import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminMenu, updateAdminMenuAvailabilityThunk, deleteAdminMenu } from "../../store/slices/adminMenuSlice.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import ConfirmModal from "../../components/common/ConfirmModal";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function MenuManagement() {

    const dispatch = useAppDispatch();

    const { items, loading, error } = useAppSelector((state) => state.adminMenu);

    const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

    useEffect(() => {

        dispatch(fetchAdminMenu());

    }, [dispatch]);

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
                            justify-content-center mx-auto mb-3"
                            style={{ width: "70px", height: "70px", }} >
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
                            justify-content-center mx-auto mb-4"
                            style={{ width: "90px", height: "90px", }} >
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

            <div className="row g-4">

                {items.map((item) => (

                    <div className="col-sm-6 col-xl-3" key={item.id} >

                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                            {/* Image */}

                            <div className="position-relative">

                                {item.image ?
                                    (<img src={`${SERVER_URL}${item.image}`} className="w-100"
                                        alt={item.name} style={{ height: "250px", objectFit: "cover", }}
                                    />)
                                    :
                                    (<div className="bg-light d-flex align-items-center justify-content-center"
                                        style={{ height: "220px", }} >
                                        <i className="bi bi-image text-secondary fs-1" />
                                    </div>)
                                }

                                {/* Active Status */}

                                <span className={`position-absolute top-0 start-0 m-3 badge rounded-pill 
                                    ${item.isActive ? "text-bg-success" : "text-bg-secondary"}`} >
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>

                                {/* Availability */}

                                <span className={`position-absolute top-0 end-0 m-3 badge rounded-pill 
                                    ${item.isAvailable ? "text-bg-primary" : "text-bg-danger"}`} >
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                </span>

                            </div>


                            {/* Content */}

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">

                                    <div>

                                        <h5 className="fw-bold mb-1">
                                            {item.name}
                                        </h5>

                                        <span className="badge bg-light text-dark">
                                            {item.category}
                                        </span>

                                    </div>

                                    <strong className="fs-5 text-primary text-nowrap">
                                        ₹{Number(item.price).toFixed(2)}
                                    </strong>

                                </div>


                                <p className="text-secondary small mb-0">
                                    {item.description}
                                </p>

                            </div>


                            {/* Actions */}

                            <div className="card-footer bg-white border-0 px-4 pb-4">

                                <div className="d-flex gap-2 flex-wrap">

                                    <Link to={`/admin/menu/edit/${item.id}`} className="btn btn-outline-primary btn-sm" >
                                        <i className="bi bi-pencil me-1" />
                                        Edit
                                    </Link>


                                    {item.isActive && (
                                        <button type="button"
                                            className={`btn btn-sm ${item.isAvailable ? "btn-outline-warning" : "btn-outline-success"}`}
                                            onClick={() => handleAvailabilityChange(item.id, !item.isAvailable)} >
                                            <i className={`bi ${item.isAvailable ? "bi-eye-slash" : "bi-eye"} me-1`} />

                                            {item.isAvailable ? "Unavailable" : "Available"}
                                        </button>
                                    )}


                                    <button type="button" className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={!item.isActive}
                                    >
                                        <i className="bi bi-trash me-1" />
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>
        </div>
    );
}

export default MenuManagement;