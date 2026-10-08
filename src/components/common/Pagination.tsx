interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange, }: PaginationProps) {

    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="d-flex flex-column align-items-center gap-3 mt-5">

            {/* Page information */}
            <small className="text-secondary">
                Page {currentPage} of {totalPages}
            </small>

            <nav aria-label="Menu pagination">

                <ul className="pagination mb-0 shadow-sm">

                    {/* Previous */}
                    <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""
                            }`}
                    >
                        <button
                            type="button"
                            className="page-link rounded-2 px-3 py-2"
                            onClick={() =>
                                onPageChange(
                                    Math.max(1, currentPage - 1)
                                )
                            }
                            disabled={currentPage === 1}
                        >
                            <i className="bi bi-chevron-left me-1" />
                            Previous
                        </button>
                    </li>

                    {/* Pages */}
                    {getPageNumbers().map((page, index) => {

                        if (page === "...") {
                            return (
                                <li
                                    key={`ellipsis-${index}`}
                                    className="page-item disabled rounded-2"
                                >
                                    <span className="page-link px-3 py-2">
                                        ...
                                    </span>
                                </li>
                            );
                        }

                        return (
                            <li
                                key={page}
                                className={`page-item ${currentPage === page
                                    ? "active"
                                    : ""
                                    }`}
                            >
                                <button type="button" className="page-link px-3 py-2 rounded-2"
                                    onClick={() => onPageChange(Number(page))} >
                                    {page}
                                </button>
                            </li>
                        );
                    })}

                    {/* Next */}
                    <li
                        className={`page-item ${currentPage === totalPages
                            ? "disabled"
                            : ""
                            }`}
                    >
                        <button
                            type="button"
                            className="page-link rounded-2 px-3 py-2"
                            onClick={() =>
                                onPageChange(
                                    Math.min(
                                        totalPages,
                                        currentPage + 1
                                    )
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <i className="bi bi-chevron-right ms-1" />
                        </button>
                    </li>

                </ul>

            </nav>
        </div>
    );
}

export default Pagination;