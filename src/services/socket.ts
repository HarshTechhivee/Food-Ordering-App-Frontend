import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.SERVER_URL;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});