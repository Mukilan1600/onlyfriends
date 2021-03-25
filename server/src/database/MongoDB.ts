import mongoose from 'mongoose'
import logger from '../Logger/Logger'

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) logger.error(err)
    else    logger.info("Database connection successful")
})

export default mongoose;