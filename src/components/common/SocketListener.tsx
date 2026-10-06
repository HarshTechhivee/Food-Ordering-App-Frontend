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

        const handleStatusUpdated = (data: { orderId: number; status: string; }) => {

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

        return () => {
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdated);
        };
    }, [dispatch]);

    return null;
}

export default SocketListener;