import { Server as netServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as socketIOServer } from "socket.io";


export type nextAPIResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: netServer &{
            io: socketIOServer
        }
    }
}


