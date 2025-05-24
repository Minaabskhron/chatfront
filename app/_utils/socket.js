// src/utils/socket.js
import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BASEURL, {
      transports: ["websocket"],
    });
  }
  return socket;
}
