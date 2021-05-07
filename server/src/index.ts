import path from "path";
import dotenv from "dotenv";
import admin from "firebase-admin";

import Server from "./Server/Server";
import logger from "./Logger/Logger";

import APIRoutes from "./api";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve("firebase-service-acc.json")
  ),
});

require("./database/MongoDB");
const server = new Server();

server.addRoutes(APIRoutes, "/api");

const PORT = process.env.PORT;

server.start(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
