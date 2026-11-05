import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateMenuItemFormData } from "../../schemas/menu.schema.js";

interface MenuItemFormFieldsProps {
    register: UseFormRegister<CreateMenuItemFormData>;
    errors: FieldErrors<CreateMenuItemFormData>;
    imagePreview: string | null;
    imageLabel: string;
    imageHelp: string;
    idPrefix: string;
}

function MenuItemFormFields({
    register,
    errors,
    imagePreview,
    imageLabel,
    imageHelp,
    idPrefix,
}: MenuItemFormFieldsProps) {
    return (
        <div className="row g-4 admin-form-layout">
            <div className="col-12 col-lg-8">
                <section className="admin-form-section h-100" aria-labelledby={`${idPrefix}-information`}>
                    <div className="admin-form-section-title">
                        <h2 id={`${idPrefix}-information`}>Item information</h2>
                        <p>Enter the details customers will see on the menu.</p>
                    </div>

                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label" htmlFor={`${idPrefix}-name`}>Name</label>
                            <input
                                id={`${idPrefix}-name`}
                                type="text"
                                placeholder="e.g. Margherita Pizza"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                aria-invalid={Boolean(errors.name)}
                                {...register("name")}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor={`${idPrefix}-category`}>Category</label>
                            <input
                                id={`${idPrefix}-category`}
                                type="text"
                                placeholder="e.g. Pizza"
                                className={`form-control ${errors.category ? "is-invalid" : ""}`}
                                aria-invalid={Boolean(errors.category)}
                                {...register("category")}
                            />
                            {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor={`${idPrefix}-price`}>Price</label>
                            <div className="input-group">
                                <span className="input-group-text" aria-hidden="true">₹</span>
                                <input
                                    id={`${idPrefix}-price`}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                    aria-invalid={Boolean(errors.price)}
                                    {...register("price", { valueAsNumber: true })}
                                />
                            </div>
                            {errors.price && <div className="text-danger small mt-1">{errors.price.message}</div>}
                        </div>

                        <div className="col-12">
                            <label className="form-label" htmlFor={`${idPrefix}-description`}>Description</label>
                            <textarea
                                id={`${idPrefix}-description`}
                                rows={4}
                                placeholder="Describe the menu item..."
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                aria-invalid={Boolean(errors.description)}
                                {...register("description")}
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                        </div>

                        <div className="col-12">
                            <div className="admin-availability-setting">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`${idPrefix}-availability`}
                                        {...register("isAvailable")}
                                    />
                                    <label htmlFor={`${idPrefix}-availability`} className="form-check-label fw-semibold">
                                        Available for ordering
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="col-12 col-lg-4">
                <section className="admin-form-section h-100" aria-labelledby={`${idPrefix}-image-settings`}>
                    <div className="admin-form-section-title">
                        <h2 id={`${idPrefix}-image-settings`}>Image and availability</h2>
                        <p>Add a clear image and set ordering availability.</p>
                    </div>

                    <div className="admin-menu-preview mb-3">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview of the menu item" />
                        ) : (
                            <div className="admin-menu-preview-placeholder">
                                <i className="bi bi-image" aria-hidden="true" />
                                <span>Image preview will appear here</span>
                            </div>
                        )}
                    </div>

                    <label className="form-label" htmlFor={`${idPrefix}-image`}>{imageLabel}</label>
                    <input
                        id={`${idPrefix}-image`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                        aria-invalid={Boolean(errors.image)}
                        aria-describedby={`${idPrefix}-image-help`}
                        {...register("image")}
                    />
                    <div id={`${idPrefix}-image-help`} className="form-text">{imageHelp}</div>
                    {errors.image && <div className="text-danger small mt-1">{errors.image.message}</div>}
                </section>
            </div>
        </div>
    );
}

export default MenuItemFormFields;
