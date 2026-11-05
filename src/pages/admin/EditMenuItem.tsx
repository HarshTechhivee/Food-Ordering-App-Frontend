import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItemFormFields from "../../components/admin/MenuItemFormFields.js";
import { updateAdminMenu } from "../../store/slices/adminMenuSlice.js";
import { useAppDispatch } from "../../store/hooks.js";
import { getAdminMenuItem } from "../../services/adminMenu.api.js";
import { updateMenuItemFormSchema, type UpdateMenuItemFormData } from "../../schemas/menu.schema.js";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage.js";
import { getMenuImageSrc } from "../../utils/menuImage.js";
import { useMenuImagePreview } from "../../components/admin/useMenuImagePreview.js";

export function EditMenuItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loadingItem, setLoadingItem] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateMenuItemFormData>({
        resolver: zodResolver(updateMenuItemFormSchema),
    });

    const selectedImage = useWatch({ control, name: "image" })?.[0];
    const imagePreview = useMenuImagePreview(selectedImage, getMenuImageSrc(existingImage));

    useEffect(() => {
        const loadItem = async () => {
            try {
                if (!id) {
                    throw new Error("Invalid menu item ID");
                }

                const item = await getAdminMenuItem(Number(id));
                setExistingImage(item.image);
                reset({
                    name: item.name,
                    description: item.description,
                    price: Number(item.price),
                    category: item.category,
                    isAvailable: item.isAvailable,
                });
            } catch (error) {
                setLoadError(getApiErrorMessage(error, "Failed to load menu item"));
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
            setSubmitError(null);
            await dispatch(updateAdminMenu({ id: Number(id), formData })).unwrap();
            navigate("/admin/menu");
        } catch (error) {
            setSubmitError(
                typeof error === "string"
                    ? error
                    : getApiErrorMessage(error, "Failed to update menu item")
            );
        }
    };

    return (
        <div className="admin-page admin-menu-form-page">
            <div className="admin-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <span className="badge text-bg-primary mb-2">Restaurant Menu</span>
                    <h1 className="display-6 fw-bold mb-2">Edit Menu Item</h1>
                    <p className="text-secondary mb-0">Update the details of an existing menu item.</p>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/admin/menu")}
                    disabled={isSubmitting}
                >
                    <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                    Back to Menu
                </button>
            </div>

            {loadingItem && (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-secondary mb-0">Loading menu item...</p>
                    </div>
                </div>
            )}

            {(loadError || submitError) && !loadingItem && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
                    <span>{loadError || submitError}</span>
                </div>
            )}

            {!loadingItem && !loadError && (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <MenuItemFormFields
                        register={register}
                        errors={errors}
                        imagePreview={imagePreview}
                        imageLabel="Replace menu image"
                        imageHelp="Leave empty to keep the current image. JPG, PNG, or WebP, up to 5 MB."
                        idPrefix="edit-item"
                    />

                    <div className="admin-form-actions d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/admin/menu")}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-2" aria-hidden="true" />
                                    Update Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
