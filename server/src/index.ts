import { Router } from 'express';
import Server from './Server/Server'
import dotenv from 'dotenv'

dotenv.config();

const server = new Server();

const router = Router()
router.get("/",(req,res) => res.send("Hello"));
server.addRoutes(router)

const PORT = process.env.PORT

server.start(PORT,() => {
    console.log("Started...")
})