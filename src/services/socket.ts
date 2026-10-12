import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.SERVER_URL;

console.log(SOCKET_URL)
console.log(process.env.API_BASE_URL,'API_BASE URL')

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