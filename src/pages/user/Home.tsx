import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>

            {/* =====================================================
                HERO
            ===================================================== */}

            <section
                id="heroFoodCarousel"
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="3000"
            >
                {/* Indicators */}
                <div className="carousel-indicators">

                    <button
                        type="button"
                        data-bs-target="#heroFoodCarousel"
                        data-bs-slide-to="0"
                        className="active"
                        aria-current="true"
                    ></button>

                    <button
                        type="button"
                        data-bs-target="#heroFoodCarousel"
                        data-bs-slide-to="1"
                    ></button>

                    <button
                        type="button"
                        data-bs-target="#heroFoodCarousel"
                        data-bs-slide-to="2"
                    ></button>

                </div>


                <div className="carousel-inner">


                    {/* =====================================================
            SLIDE 1 - BURGER
        ===================================================== */}

                    <div className="carousel-item active">

                        <div
                            className="position-relative text-white home-hero-background home-hero-background--burger"
                        >

                            <div className="container">

                                <div
                                    className="row align-items-center home-hero-row"
                                >

                                    {/* LEFT CONTENT */}

                                    <div className="col-lg-6">

                                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-4">
                                            🔥 BEST SELLER
                                        </span>

                                        <h1 className="display-1 fw-bold lh-1 mb-4">

                                            Juicy
                                            <br />

                                            <span className="text-warning">
                                                Classic Burger.
                                            </span>

                                        </h1>

                                        <p className="lead text-white-50 mb-4">
                                            A juicy grilled burger with melted cheese,
                                            fresh vegetables and our special sauce.
                                        </p>


                                        <div className="d-flex align-items-center gap-4 mb-4">

                                            <div>
                                                <h3 className="fw-bold mb-0">
                                                    ₹199
                                                </h3>

                                                <small className="text-white-50">
                                                    Starting price
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    ⭐ 4.9
                                                </h5>

                                                <small className="text-white-50">
                                                    Excellent
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    30 min
                                                </h5>

                                                <small className="text-white-50">
                                                    Delivery
                                                </small>
                                            </div>

                                        </div>


                                        <button
                                            className="btn btn-warning btn-lg rounded-3 px-4 fw-bold"
                                            onClick={() => navigate("/menu")}
                                        >
                                            Explore Menu
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
            SLIDE 2 - PIZZA
        ===================================================== */}

                    <div className="carousel-item">

                        <div
                            className="position-relative text-white home-hero-background home-hero-background--pizza"
                        >

                            <div className="container">

                                <div
                                    className="row align-items-center home-hero-row"
                                >

                                    {/* LEFT CONTENT */}

                                    <div className="col-lg-6">

                                        <span className="badge bg-danger rounded-pill px-3 py-2 mb-4">
                                            🍕 CUSTOMER FAVORITE
                                        </span>

                                        <h1 className="display-1 fw-bold lh-1 mb-4">

                                            Hot &
                                            <br />

                                            <span className="text-warning">
                                                Cheesy Pizza.
                                            </span>

                                        </h1>

                                        <p className="lead text-white-50 mb-4">
                                            Crispy golden crust topped with rich cheese,
                                            fresh ingredients and delicious pizza sauce.
                                        </p>


                                        <div className="d-flex align-items-center gap-4 mb-4">

                                            <div>
                                                <h3 className="fw-bold mb-0">
                                                    ₹299
                                                </h3>

                                                <small className="text-white-50">
                                                    Starting price
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    ⭐ 5.0
                                                </h5>

                                                <small className="text-white-50">
                                                    Excellent
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    30 min
                                                </h5>

                                                <small className="text-white-50">
                                                    Delivery
                                                </small>
                                            </div>

                                        </div>


                                        <button
                                            className="btn btn-warning btn-lg rounded-3 px-4 fw-bold"
                                            onClick={() => navigate("/menu")}
                                        >
                                            Explore Menu
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
            SLIDE 3 - COLD DRINK
        ===================================================== */}

                    <div className="carousel-item">

                        <div
                            className="position-relative text-white home-hero-background home-hero-background--drink"
                        >

                            <div className="container">

                                <div
                                    className="row align-items-center home-hero-row"
                                >

                                    {/* LEFT CONTENT */}

                                    <div className="col-lg-6">

                                        <span className="badge bg-primary rounded-pill px-3 py-2 mb-4">
                                            🧊 ICE COLD
                                        </span>

                                        <h1 className="display-1 fw-bold lh-1 mb-4">

                                            Refreshing
                                            <br />

                                            <span className="text-warning">
                                                Cold Drinks.
                                            </span>

                                        </h1>

                                        <p className="lead text-white-50 mb-4">
                                            Ice-cold refreshing drinks that perfectly
                                            complete your favorite meal.
                                        </p>


                                        <div className="d-flex align-items-center gap-4 mb-4">

                                            <div>
                                                <h3 className="fw-bold mb-0">
                                                    ₹79
                                                </h3>

                                                <small className="text-white-50">
                                                    Starting price
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    ⭐ 4.7
                                                </h5>

                                                <small className="text-white-50">
                                                    Excellent
                                                </small>
                                            </div>


                                            <div className="vr"></div>


                                            <div>
                                                <h5 className="fw-bold mb-0">
                                                    Ice Cold
                                                </h5>

                                                <small className="text-white-50">
                                                    Always Fresh
                                                </small>
                                            </div>

                                        </div>


                                        <button
                                            className="btn btn-warning btn-lg rounded-3 px-4 fw-bold"
                                            onClick={() => navigate("/menu")}
                                        >
                                            Explore Menu
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
        PREVIOUS BUTTON
    ===================================================== */}

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#heroFoodCarousel"
                    data-bs-slide="prev"
                >

                    <span
                        className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center shadow home-carousel-control-icon"
                    >
                        <i className="bi bi-chevron-left fs-5"></i>
                    </span>

                    <span className="visually-hidden">
                        Previous
                    </span>

                </button>


                {/* =====================================================
        NEXT BUTTON
    ===================================================== */}

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#heroFoodCarousel"
                    data-bs-slide="next"
                >

                    <span
                        className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center shadow home-carousel-control-icon"
                    >
                        <i className="bi bi-chevron-right fs-5"></i>
                    </span>

                    <span className="visually-hidden">
                        Next
                    </span>

                </button>

            </section>


            {/* =====================================================
                FOOD CATEGORY
            ===================================================== */}

            <section className="bg-light pt-5">

                <div className="container py-3">

                    <div className="text-center mb-5">

                        <span className="badge rounded-pill bg-warning text-dark px-3 py-2 mb-3">
                            OUR FAVORITES
                        </span>

                        <h2 className="display-5 fw-bold">
                            Made for your
                            <span className="text-warning"> cravings.</span>
                        </h2>

                        <p className="text-secondary">
                            Pick your favorite and let us handle the rest.
                        </p>

                    </div>


                    <div className="row g-4">

                        {/* BURGER */}

                        <div className="col-md-4">

                            <div className="card border-0 rounded-4 overflow-hidden shadow-sm h-100">

                                <div className="position-relative">

                                    <img
                                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                                        alt="Burger"
                                        className="w-100 home-featured-image"
                                    />

                                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2">
                                        Popular
                                    </span>

                                </div>

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between">

                                        <h4 className="fw-bold">
                                            Classic Burger
                                        </h4>

                                        <span className="fw-bold text-warning">
                                            ₹199
                                        </span>

                                    </div>

                                    <p className="text-secondary mb-0">
                                        Juicy grilled patty with fresh
                                        vegetables and melted cheese.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* PIZZA */}

                        <div className="col-md-4">

                            <div className="card border-0 rounded-4 overflow-hidden shadow-sm h-100">

                                <div className="position-relative">

                                    <img
                                        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
                                        alt="Pizza"
                                        className="w-100 home-featured-image"
                                    />

                                    <span className="badge bg-danger position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2">
                                        Best Seller
                                    </span>

                                </div>

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between">

                                        <h4 className="fw-bold">
                                            Cheese Pizza
                                        </h4>

                                        <span className="fw-bold text-warning">
                                            ₹299
                                        </span>

                                    </div>

                                    <p className="text-secondary mb-0">
                                        Crispy crust, melted cheese and
                                        delicious fresh toppings.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* DRINK */}

                        <div className="col-md-4">

                            <div className="card border-0 rounded-4 overflow-hidden shadow-sm h-100">

                                <div className="position-relative">

                                    <img
                                        src="https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80"
                                        alt="Cold Drink"
                                        className="w-100 home-featured-image"
                                    />

                                    <span className="badge bg-primary position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2">
                                        Refreshing
                                    </span>

                                </div>

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between">

                                        <h4 className="fw-bold">
                                            Cold Drinks
                                        </h4>

                                        <span className="fw-bold text-warning">
                                            ₹79
                                        </span>

                                    </div>

                                    <p className="text-secondary mb-0">
                                        Ice-cold refreshing drinks perfect
                                        with your favorite meal.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SECOND BUTTON */}

                    {/* <div className="text-center mt-5">

                        <button
                            className="btn btn-dark btn-lg rounded-3 px-4 fw-semibold"
                            onClick={() => navigate("/menu")}
                        >
                            View Full Menu
                            <i className="bi bi-arrow-right ms-2"></i>
                        </button>

                    </div> */}

                </div>

            </section>


            {/* =====================================================
                WHY US
            ===================================================== */}

            <section className="bg-white pb-5">

                <div className="container py-5">

                    <div className="row align-items-center">

                        <div className="col-lg-6 mb-5 mb-lg-0">

                            <span className="badge rounded-pill bg-warning text-dark px-3 py-2 mb-3">
                                WHY FOODHUB?
                            </span>

                            <h2 className="display-5 fw-bold">
                                Simple food.
                                <br />
                                <span className="text-warning">
                                    Serious taste.
                                </span>
                            </h2>

                            <p className="text-secondary lead">
                                We believe great food doesn't need to be
                                complicated. Fresh ingredients, great recipes
                                and fast delivery.
                            </p>

                        </div>


                        <div className="col-lg-6">

                            <div className="row g-3">

                                <div className="col-6">

                                    <div className="bg-light rounded-4 p-4 text-center">

                                        <i className="bi bi-heart-fill text-danger fs-2"></i>

                                        <h6 className="fw-bold mt-3">
                                            Made With Care
                                        </h6>

                                        <small className="text-secondary">
                                            Fresh ingredients
                                        </small>

                                    </div>

                                </div>


                                <div className="col-6">

                                    <div className="bg-light rounded-4 p-4 text-center">

                                        <i className="bi bi-lightning-charge-fill text-warning fs-2"></i>

                                        <h6 className="fw-bold mt-3">
                                            Fast Delivery
                                        </h6>

                                        <small className="text-secondary">
                                            Under 30 minutes
                                        </small>

                                    </div>

                                </div>


                                <div className="col-6">

                                    <div className="bg-light rounded-4 p-4 text-center">

                                        <i className="bi bi-star-fill text-primary fs-2"></i>

                                        <h6 className="fw-bold mt-3">
                                            Great Quality
                                        </h6>

                                        <small className="text-secondary">
                                            4.9 customer rating
                                        </small>

                                    </div>

                                </div>


                                <div className="col-6">

                                    <div className="bg-light rounded-4 p-4 text-center">

                                        <i className="bi bi-bag-heart-fill text-success fs-2"></i>

                                        <h6 className="fw-bold mt-3">
                                            Easy Ordering
                                        </h6>

                                        <small className="text-secondary">
                                            Simple & quick
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FINAL CTA
            ===================================================== */}

            <section
                className="position-relative overflow-hidden text-white home-final-cta"
            >

                <div className="container py-5">

                    <div className="row align-items-center py-4">

                        <div className="col-lg-8">

                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                                HUNGRY?
                            </span>

                            <h2 className="display-5 fw-bold">
                                Your next favorite meal
                                <br />
                                is waiting.
                            </h2>

                            <p className="text-white-50 lead mb-0">
                                Burgers. Pizza. Drinks.
                                <br />
                                Everything delicious in one place.
                            </p>

                        </div>


                        <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">

                            {/* THIRD AND FINAL BUTTON */}

                            <button
                                className="btn btn-warning btn-lg rounded-3 px-5 fw-bold"
                                onClick={() => navigate("/menu")}
                            >
                                Order Now
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;