import express, { Express, Router } from 'express';

class Server {
    private app: Express;
    constructor() {
        this.initializeServer();
    }

    private initializeServer() {
        this.app = express()
    }

    public addRoutes(router: Router){
        this.app.use(router);
    }

    public start(port: number|string, cb: () => void) {
        this.app.listen(port, cb);
    }

}

export default Server;