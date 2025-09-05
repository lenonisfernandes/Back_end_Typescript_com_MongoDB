import routes from './4webApi/routes';
import express, { NextFunction, Request, Response } from 'express';
import Logger from './3infra/middlewares/Logger';
import { basicAuthMiddleware } from './3infra/middlewares/basicAuth';
import ErrorHandler from './3infra/middlewares/ErrorHandler';
import setupSwagger from './4webApi/config/Swagger';
import NotFoundException from './2domain/exceptions/NotFoundExpection';

const app = express();
const port = 3000;

app.use(express.json());


app.use(Logger.init());

app.use('/api', basicAuthMiddleware, routes);
setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.json('Bem vindo a primeira rota!!!');
});

const routeNotFoundMiddleware =
    (req: Request, res: Response, next: NextFunction) =>
        next(new NotFoundException('Rota não disponível'));

app.use(routeNotFoundMiddleware);
app.use(ErrorHandler.init());

app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port} \n
        📚 Documentação Swagger disponível em: http://localhost:3000/api-docs`);
});

