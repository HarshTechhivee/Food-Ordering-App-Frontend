import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItemFormFields from "../../components/admin/MenuItemFormFields.js";
import { createMenuItemSchema, type CreateMenuItemFormData } from "../../schemas/menu.schema.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { createAdminMenu } from "../../store/slices/adminMenuSlice.js";
import { useMenuImagePreview } from "../../components/admin/useMenuImagePreview.js";

function CreateMenuItem() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const error = useAppSelector((state) => state.adminMenu.error);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateMenuItemFormData>({
        resolver: zodResolver(createMenuItemSchema),
        defaultValues: { isAvailable: true },
    });

    const selectedImage = useWatch({ control, name: "image" })?.[0];
    const imagePreview = useMenuImagePreview(selectedImage);

    const onSubmit = async (data: CreateMenuItemFormData) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("category", data.category);
        formData.append("isAvailable", String(data.isAvailable));
        formData.append("image", data.image[0]);

        try {
            await dispatch(createAdminMenu(formData)).unwrap();
            navigate("/admin/menu");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-page admin-menu-form-page">
            <div className="admin-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <span className="badge text-bg-primary mb-2">Restaurant Menu</span>
                    <h1 className="display-6 fw-bold mb-2">Create Menu Item</h1>
                    <p className="text-secondary mb-0">Add a new item to your restaurant menu.</p>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/admin/menu")}
                >
                    <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                    Back to Menu
                </button>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <MenuItemFormFields
                    register={register}
                    errors={errors}
                    imagePreview={imagePreview}
                    imageLabel="Menu image"
                    imageHelp="JPG, PNG, or WebP. Maximum file size: 5 MB."
                    idPrefix="create-item"
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
                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                                Create Item
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateMenuItem;
