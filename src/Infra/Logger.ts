import { NextFunction, Request, Response } from 'express';

// export default function Logger(req: Request, res: Response, next: NextFunction) {
//     const timestamp = new Date().toISOString();
//     console.info(`${timestamp} Chamada ao método: ${req.method} url: ${req.url} `);
//     next();
// }

class Logger {
    private static implementacao(req: Request, res: Response, next: NextFunction) {
        const timestamp = new Date().toISOString();
        console.info(`${timestamp} Chamada ao método: ${req.method} url: ${req.url} `);
        next();
    }

    static init() {
        return this.implementacao;
    }
}
export default Logger;