import routes from './Api/routes';
import express, { NextFunction, Request, Response } from 'express';
import Logger from './Infra/Logger';
import { basicAuthMiddleware } from './basicAuth';
import CustomError from './Api/Exceptions/CustomError';
import ErrorHandler from './Infra/ErrorHandler';

const app = express();
const port = 3000;

app.use(express.json());

app.use(Logger.init());

app.use(basicAuthMiddleware);

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.json('Bem vindo a primeira rota!!!');
});

app.use(ErrorHandler.init());

app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port}`);
});

