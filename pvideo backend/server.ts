import express, { Application } from "express";
import IO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
export class Server {
  private httpServer!: HTTPServer;
  private app!: Application;
  private io!: SocketIOServer;

  private readonly DEFAULT_PORT = 3000;

  constructor() {
    this.initialize();

    this.handleRoutes();
    this.handleSocketConnection();
  }

  private activeSockets: string[] = [];

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = IO(this.httpServer);
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      console.log("Socket connected.");
      let fullSocket: any;
      fullSocket = this.activeSockets.find(
        (fullSocket: any) => fullSocket == socket.id
      );
      if (!fullSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("users_added", {
          users: this.activeSockets.filter(
            (fullSocket: any) => fullSocket !== socket.id
          ),
        });

        socket.broadcast.emit("user_added", {
          users: [socket.id],
        });
      }
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
