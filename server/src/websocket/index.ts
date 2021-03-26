import {Server} from 'http'
import socketio from 'socket.io'
import logger from '../Logger/Logger';

class WebSocket {
    private io: socketio.Server
    constructor(server: Server){
        this.io = require('socket.io')(server, {
            cors: {
              origin: "*",
              methods: ["GET", "POST"],
              credentials: true
            }
          })
        this.initializeSocketListeners();
    }

    private initializeSocketListeners() {
        this.io.on("connection", (socket: socketio.Socket) => {
            logger.info(`Incoming socket connection Id: ${socket.id}`)
        })
    }
}

export default WebSocket