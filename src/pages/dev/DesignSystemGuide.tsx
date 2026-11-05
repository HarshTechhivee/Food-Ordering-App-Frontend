const colorTokens = [
    { name: "Primary orange", value: "#EA7418", className: "foodhub-styleguide-swatch--orange" },
    { name: "Charcoal", value: "#25211D", className: "foodhub-styleguide-swatch--charcoal" },
    { name: "Warm cream", value: "#FFF3E6", className: "foodhub-styleguide-swatch--cream" },
    { name: "Customer peach", value: "#FFF8F1", className: "foodhub-styleguide-swatch--peach" },
    { name: "Admin neutral", value: "#F4F5F6", className: "foodhub-styleguide-swatch--neutral" },
];

export default function DesignSystemGuide() {
    return (
        <main className="foodhub-styleguide">
            <header className="foodhub-styleguide-header">
                <div>
                    <p className="foodhub-eyebrow mb-2">Internal preview - Development only</p>
                    <h1 className="mb-2">FoodHub design foundation</h1>
                    <p className="mb-0">One brand, two distinct experiences.</p>
                </div>
                <a className="foodhub-button-secondary" href="/home">
                    Return to FoodHub
                </a>
            </header>

            <section className="foodhub-styleguide-section">
                <h2>Shared brand foundation</h2>
                <div className="foodhub-styleguide-swatches">
                    {colorTokens.map((token) => (
                        <div className="foodhub-styleguide-swatch-card" key={token.name}>
                            <span className={`foodhub-styleguide-swatch ${token.className}`} />
                            <span className="fw-semibold">{token.name}</span>
                            <code>{token.value}</code>
                        </div>
                    ))}
                </div>

                <div className="foodhub-styleguide-type">
                    <div>
                        <span className="foodhub-styleguide-label">Manrope · headings</span>
                        <h3>A little something delicious</h3>
                    </div>
                    <div>
                        <span className="foodhub-styleguide-label">Inter · body</span>
                        <p className="mb-0">Thoughtful typography and clear details make every choice feel easy.</p>
                    </div>
                </div>
            </section>

            <div className="foodhub-styleguide-themes">
                <section className="foodhub-styleguide-theme foodhub-styleguide-theme--customer">
                    <p className="foodhub-eyebrow">Customer experience</p>
                    <h2>Warm, expressive, inviting</h2>
                    <p>Room to explore, appetizing surfaces, and confident orange actions.</p>
                    <div className="foodhub-styleguide-card">
                        <span className="foodhub-badge">Made for your cravings</span>
                        <h3 className="mt-3">A more delicious day starts here.</h3>
                        <p>Warm cream, soft peach, and generous breathing room.</p>
                        <div className="d-flex flex-wrap gap-2">
                            <button type="button" className="foodhub-button-primary">Explore menu</button>
                            <button type="button" className="foodhub-button-secondary">View details</button>
                        </div>
                    </div>
                </section>

                <section className="foodhub-styleguide-theme foodhub-styleguide-theme--admin">
                    <p className="foodhub-eyebrow">Restaurant admin</p>
                    <h2>Professional, focused, clear</h2>
                    <p>Structured neutrals, denser information, and precise orange accents.</p>
                    <div className="foodhub-styleguide-admin-preview">
                        <nav aria-label="Style guide admin navigation" className="foodhub-styleguide-admin-nav">
                            <span className="foodhub-styleguide-admin-brand">FoodHub <small>WORKSPACE</small></span>
                            <span className="foodhub-styleguide-admin-link is-active">Overview</span>
                            <span className="foodhub-styleguide-admin-link">Orders</span>
                            <span className="foodhub-styleguide-admin-link">Menu management</span>
                        </nav>
                        <div className="foodhub-styleguide-admin-content">
                            <div className="foodhub-styleguide-admin-kpi">
                                <span>Workspace status</span>
                                <strong>Ready to serve</strong>
                            </div>
                            <label className="foodhub-styleguide-label" htmlFor="foodhub-styleguide-input">Reusable input</label>
                            <input id="foodhub-styleguide-input" className="foodhub-input" placeholder="Search your workspace" />
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <span className="foodhub-status foodhub-status--success">Completed</span>
                                <span className="foodhub-status foodhub-status--pending">Pending</span>
                                <span className="foodhub-status foodhub-status--attention">Needs attention</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <p className="foodhub-styleguide-note">
                This preview is available only in development and is not part of the production route set.
            </p>
        </main>
    );
}
