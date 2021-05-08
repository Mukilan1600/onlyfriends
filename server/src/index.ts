import dotenv from "dotenv";
import admin from "firebase-admin";

import Server from "./Server/Server";
import logger from "./Logger/Logger";

import APIRoutes from "./api";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_CONFIG_BASE64, "base64").toString(
        "ascii"
      )
    )
  ),
});

require("./database/MongoDB");
const server = new Server();

server.addRoutes(APIRoutes, "/api");

const PORT = process.env.PORT;

server.start(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
