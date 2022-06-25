import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { nextAPIResponseServerIo } from "../../types/sockets";
import { io } from "socket.io-client";

const handlerSocket = (req: NextApiRequest, res: nextAPIResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log("sockect initialized");
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("sendMessage", (msg) => {
        socket.emit("updateInput", msg);
      });
    });
  }
  res.end();
};

export default handlerSocket;
