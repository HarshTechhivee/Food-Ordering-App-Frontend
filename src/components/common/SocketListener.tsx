import { useEffect } from "react";
import { formatOrderStatus } from "../../utils/orderStatus.js";
import { useAppDispatch } from "../../store/hooks.js";
import { addNotification } from "../../store/slices/notificationSlice.js";
import { socket } from "../../services/socket.js";
import type { OrderStatus } from "../../types/order.types.js";

function SocketListener() {

    const dispatch = useAppDispatch();

    useEffect(() => {

        const handleNewOrder = (data: { orderId: number }) => {

            dispatch(
                addNotification({
                    id: crypto.randomUUID(),
                    type: "NEW_ORDER",
                    title: "New Order",
                    message: `Order #${data.orderId} has been placed.`,
                    createdAt: new Date().toISOString(),
                    read: false,
                })
            );
        };

        const handleCancelOrder = (data: { orderId: number }) => {
            dispatch(
                addNotification({
                    id: crypto.randomUUID(),
                    type: "CANCEL_ORDER",
                    title: "Cancel Order",
                    message: `Order #${data.orderId} has been Cancelled.`,
                    createdAt: new Date().toISOString(),
                    read: false,
                })
            )
        }

        const handleRejectOrder = (data: { orderId: number; }) => {
            dispatch(
                addNotification({
                    id: crypto.randomUUID(),
                    type: "REJECT_ORDER",
                    title: "Reject Order",
                    message: `Order #${data.orderId} has been Rejected.`,
                    createdAt: new Date().toISOString(),
                    read: false,
                })
            )
        }

        const handleStatusUpdated = (data: { orderId: number; status: string; }) => {

            console.log("USER RECEIVED order:statusUpdated:", data);

            dispatch(
                addNotification({
                    id: crypto.randomUUID(),
                    type: "ORDER_STATUS_UPDATED",
                    title: "Order Updated",
                    message: `Order #${data.orderId} is now ${formatOrderStatus(data.status as OrderStatus)}.`,
                    createdAt: new Date().toISOString(),
                    read: false,
                })
            );
        };

        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleStatusUpdated);
        socket.on("order:rejected", handleRejectOrder)
        socket.on("order:cancelled", handleCancelOrder)

        return () => {
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdated);
            socket.off("order:rejected", handleRejectOrder)
            socket.off("order:cancelled", handleCancelOrder)
        };
    }, [dispatch]);

    return null;
}

export default SocketListener;