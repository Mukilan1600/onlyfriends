import dotenv from "dotenv";

import Server from "./Server/Server";
import logger from "./Logger/Logger";

import APIRoutes from './api'

dotenv.config();

const server = new Server();

server.addRoutes(APIRoutes, "/api");

const PORT = process.env.PORT;

server.start(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
