import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero */}
            <section className="bg-light py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <span className="badge bg-dark mb-3">
                                Fresh • Delicious • Fast
                            </span>

                            <h1 className="display-4 fw-bold mb-3">
                                Delicious food,
                                <br />
                                delivered to you.
                            </h1>

                            <p className="lead text-secondary mb-4">
                                Order your favorite meals from our restaurant
                                and enjoy fresh, delicious food at your
                                convenience.
                            </p>

                            <button
                                type="button"
                                className="btn btn-dark btn-lg px-4"
                                onClick={() => navigate("/menu")}
                            >
                                Explore Menu
                            </button>
                        </div>

                        <div className="col-lg-5 mt-5 mt-lg-0">
                            <div className="bg-dark text-white rounded-4 p-5 text-center">
                                <i className="bi bi-egg-fried display-1" />
                                <h3 className="mt-4">
                                    Good food starts here.
                                </h3>
                                <p className="text-white-50 mb-0">
                                    Freshly prepared meals made with care.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-5">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">
                            Why choose us?
                        </h2>

                        <p className="text-secondary">
                            Everything you need for a great food experience.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="text-center p-4 h-100">
                                <i className="bi bi-heart-fill fs-1" />

                                <h5 className="fw-bold mt-3">
                                    Made With Care
                                </h5>

                                <p className="text-secondary mb-0">
                                    Every meal is prepared with attention to
                                    quality and taste.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="text-center p-4 h-100">
                                <i className="bi bi-lightning-charge-fill fs-1" />

                                <h5 className="fw-bold mt-3">
                                    Fast Service
                                </h5>

                                <p className="text-secondary mb-0">
                                    Get your order processed quickly and
                                    efficiently.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="text-center p-4 h-100">
                                <i className="bi bi-star-fill fs-1" />

                                <h5 className="fw-bold mt-3">
                                    Great Quality
                                </h5>

                                <p className="text-secondary mb-0">
                                    Enjoy delicious meals made from quality
                                    ingredients.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-dark text-white py-5">
                <div className="container text-center py-4">
                    <h2 className="fw-bold mb-3">
                        Hungry already?
                    </h2>

                    <p className="text-white-50 mb-4">
                        Explore our menu and find something you'll love.
                    </p>

                    <button
                        type="button"
                        className="btn btn-light btn-lg px-4"
                        onClick={() => navigate("/menu")}
                    >
                        View Menu
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Home;