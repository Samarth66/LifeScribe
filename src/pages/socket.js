import io from "socket.io-client";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const socket = io(`${apiBaseUrl}/`);
socket.on("connect", () => {
  console.log("Socket is connected");
});
export default socket;
