import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAdminMenu } from "../../store/slices/adminMenuSlice.js";

import { useAppDispatch } from "../../store/hooks.js";
import { getAdminMenuItem, } from "../../services/adminMenu.api.js";

import { updateMenuItemFormSchema, type UpdateMenuItemFormData, } from "../../schemas/menu.schema.js";



export function EditMenuItem() {

    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [loadingItem, setLoadingItem] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, }
        = useForm<UpdateMenuItemFormData>({ resolver: zodResolver(updateMenuItemFormSchema), });

    useEffect(() => {

        const loadItem = async () => {

            try {
                if (!id) {
                    throw new Error("Invalid menu item ID");
                }

                const item = await getAdminMenuItem(Number(id));

                reset({
                    name: item.name,
                    description: item.description,
                    price: Number(item.price),
                    category: item.category,
                    isAvailable: item.isAvailable,
                });

            } catch (error: any) {

                setError(error.response?.data?.message || "Failed to load menu item");

            } finally {

                setLoadingItem(false);

            }
        };

        loadItem();

    }, [id, reset]);


    const onSubmit = async (data: UpdateMenuItemFormData) => {

        if (!id) return;

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("category", data.category);
        formData.append("isAvailable", String(data.isAvailable));

        if (data.image.length > 0) {
            formData.append("image", data.image[0]);
        }

        try {
            await dispatch(updateAdminMenu({ id: Number(id), formData, })).unwrap();

            navigate("/admin/menu");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <span className="badge text-bg-primary mb-3">
                            Restaurant Menu
                        </span>

                        <h1 className="display-6 fw-bold mb-2">
                            Edit Menu Item
                        </h1>

                        <p className="text-secondary mb-0">
                            Update the details of an existing menu item.
                        </p>
                    </div>

                    <button type="button" className="btn btn-outline-secondary"
                        onClick={() => navigate("/admin/menu")} >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Menu
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loadingItem && (
                <div className="card border-0 rounded-4 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="text-secondary mb-0">
                            Loading menu item...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && !loadingItem && (
                <div className="alert alert-danger rounded-4 shadow-sm d-flex align-items-center gap-2" role="alert" >
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            {!loadingItem && !error && (
                <div className="card border-0 rounded-4 shadow-sm">
                    <div className="card-body p-4 ">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Basic Information */}
                            <div className="mb-4">
                                <h5 className="fw-bold mb-1">
                                    Basic Information
                                </h5>

                                <p className="text-secondary small mb-0">
                                    Update the details customers will see on the menu.
                                </p>
                            </div>

                            <div className="row g-4">

                                {/* Name */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Name
                                    </label>

                                    <input type="text" placeholder="e.g. Margherita Pizza"
                                        className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                                        {...register("name")} />

                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name.message}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea rows={4} placeholder="Describe the menu item..."
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        {...register("description")} />

                                    {errors.description && (
                                        <div className="invalid-feedback">
                                            {errors.description.message}
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Price
                                    </label>

                                    <div className="input-group">
                                        <span className="input-group-text">
                                            ₹
                                        </span>

                                        <input type="number" step="0.01" placeholder="0.00"
                                            className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                            {...register("price", { valueAsNumber: true, })} />
                                    </div>

                                    {errors.price && (
                                        <div className="text-danger small mt-1">
                                            {errors.price.message}
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Category
                                    </label>

                                    <input type="text" placeholder="e.g. Pizza"
                                        className={`form-control ${errors.category ? "is-invalid" : ""}`}
                                        {...register("category")} />

                                    {errors.category && (
                                        <div className="invalid-feedback">
                                            {errors.category.message}
                                        </div>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Replace Menu Image
                                    </label>

                                    <input type="file" accept="image/jpeg,image/png,image/webp"
                                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                                        {...register("image")} />

                                    <div className="form-text">
                                        Leave empty to keep the current image.
                                        Supported formats: JPG, PNG, WebP.
                                    </div>

                                    {errors.image && (
                                        <div className="invalid-feedback">
                                            {errors.image.message}
                                        </div>
                                    )}
                                </div>

                                {/* Availability */}
                                <div className="col-12">
                                    <div className="border rounded-4 p-3 bg-light">
                                        <div className="form-check">

                                            <input type="checkbox" className="form-check-input" id="isAvailable"
                                                {...register("isAvailable")} />

                                            <label htmlFor="isAvailable" className="form-check-label fw-semibold" >
                                                Available for ordering
                                            </label>
                                        </div>

                                        <p className="text-secondary small mb-0 mt-2 ms-4">
                                            Customers can order this item when it is available.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-5 pt-4 border-top">
                                <button type="button" className="btn btn-outline-secondary"
                                    onClick={() => navigate("/admin/menu")} disabled={isSubmitting} >
                                    Cancel
                                </button>

                                <button type="submit" className="btn btn-primary" disabled={isSubmitting} >
                                    {isSubmitting ?
                                        (<>
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                            Updating...
                                        </>)
                                        :
                                        (<>
                                            <i className="bi bi-check-lg me-2"></i>
                                            Update Menu Item
                                        </>)
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}