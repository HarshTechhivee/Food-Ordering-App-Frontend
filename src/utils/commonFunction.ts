export function formatStatus(status: string): string {

    return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

}

export function getStatusPaymentClass(status: string): string {

    switch (status) {
        case "PENDING":
            return "text-bg-warning";

        case "PAID":
        case "DELIVERED":
            return "text-bg-success";

        case "REFUNDED":
        case "OUT_FOR_DELIVERY":
            return "text-bg-info";

        case "APPROVED":
            return "text-bg-primary";

        case "REJECTED":
        case "FAILED":
        case "CANCELLED":
            return "text-bg-danger";

        default:
            return "text-bg-secondary";
    }
}


// export function getPaymentStatusClass(status: string): string {

//     switch (status) {
//         case "PENDING":
//             return "text-bg-warning";

//         case "PAID":
//             return "text-bg-success";

//         case "FAILED":
//             return "text-bg-danger";

//         case "REFUNDED":
//             return "text-bg-info";

//         default:
//             return "text-bg-secondary";
//     }
// }