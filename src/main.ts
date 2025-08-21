import routes from './Api/routes';
import express, { NextFunction, Request, Response } from 'express';
import Logger from './Infra/Logger';
import { basicAuthMiddleware } from './basicAuth';
import CustomError from './Api/Exceptions/CustomError';

const app = express();
const port = 3000;

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof CustomError) {
        res.status(error.getStatus()).json({
            error: error.message,
            status: error.getStatus()
        });
    }
    const message = 'Erro no servidor';
    const status = 500;
    console.error('status: ', status, 'message', error.message);
    res.status(status).json({
        error: message,
        status: status
    });
}

app.use(express.json());

app.use(Logger.init());

app.use(basicAuthMiddleware);

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.json('Bem vindo a primeira rota!!!');
});

app.use(errorHandler);

app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port}`);
});

