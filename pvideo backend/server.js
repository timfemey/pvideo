"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = require("http");
class Server {
    constructor() {
        this.DEFAULT_PORT = 3000;
        this.activeSockets = [];
        this.initialize();
        this.handleRoutes();
        this.handleSocketConnection();
    }
    initialize() {
        this.app = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.app);
        this.io = (0, socket_io_1.default)(this.httpServer);
    }
    handleRoutes() {
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }
    handleSocketConnection() {
        this.io.on("connection", (socket) => {
            console.log("Socket connected.");
            let fullSocket;
            fullSocket = this.activeSockets.find((fullSocket) => fullSocket == socket.id);
            if (!fullSocket) {
                this.activeSockets.push(socket.id);
                socket.emit("users_added", {
                    users: this.activeSockets.filter((fullSocket) => fullSocket !== socket.id),
                });
                socket.broadcast.emit("user_added", {
                    users: [socket.id],
                });
            }
        });
    }
    listen(callback) {
        this.httpServer.listen(this.DEFAULT_PORT, () => callback(this.DEFAULT_PORT));
    }
}
exports.Server = Server;
