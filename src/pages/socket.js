import io from "socket.io-client";

const socket = io("http://localhost:8000");
socket.on("connect", () => {
  console.log("Socket is connected");
});
export default socket;
