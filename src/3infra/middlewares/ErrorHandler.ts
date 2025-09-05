import { NextFunction, Request, Response } from 'express';
import CustomError from '../../2domain/exceptions/CustomError';

class ErrorHandler {
    public static handleError(
        error: Error,
        req: Request, res: Response, next: NextFunction) {
        let status = 500;
        const message = error.message;
        console.error(`[Erro] status: ${status}, Message: ${message}`);

        if (error instanceof CustomError) {
            status = error.getStatus();
            res.status(status).json({
                status: error.getStatus(),
                message
            });
            return;
        }

        res.status(status).json({
            status,
            message
        });
    }

    public static init():
        (error: Error, req: Request, res: Response, next: NextFunction) => void {
        return ErrorHandler.handleError;
    }
}
export default ErrorHandler;