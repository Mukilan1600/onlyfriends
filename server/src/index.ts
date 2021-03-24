import dotenv from 'dotenv'

import Server from './Server/Server'
import logger from './Logger/Logger'

dotenv.config();

const server = new Server();

const PORT = process.env.PORT

server.start(PORT,() => {
    logger.info(`Server is running on port ${PORT}`)
})