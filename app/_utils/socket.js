// utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // your Node.js backend URL
export default socket;
