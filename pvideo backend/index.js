"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_js_1 = require("./server.js");
const server = new server_js_1.Server();
server.listen((port) => {
    console.log(`Status: Server is running at localhost:${port}`);
});
