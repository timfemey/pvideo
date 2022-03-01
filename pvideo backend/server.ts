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

  //Initiaize socket.io and Server
  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = IO(this.httpServer);
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Pvideo Server Connected</h1>`);
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

        socket.broadcast.emit("users_added", {
          users: [socket.id],
        });
      }

      //On Call Action/Event
      socket.on("call", (res) => {
        socket.to(res.receiver).emit("call_alert", {
          request_to_call: res.call,
          socket_id: socket.id,
        });
      });

      //Receiver Declined Call
      socket.on("decline", (data) => {
        socket.to(data.receiver).emit("call_rejected", {
          socket_id: socket.id,
        });
      });

      //When Answering Call send this data to client
      socket.on("answer", (res) => {
        socket.to(res.receiver).emit("answered", {
          socket_id: socket.id,
          answer: res.answer,
        });
      });

      //Disconnection happens
      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          (fullSocket) => fullSocket !== socket.id
        );
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
