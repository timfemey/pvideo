import { Server } from "./server.js";
const server = new Server();

server.listen((port) => {
  console.log(`Status: Server is running at localhost:${port}`);
});
