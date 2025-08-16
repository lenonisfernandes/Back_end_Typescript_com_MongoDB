import routes from './Api/routes';
import express, { NextFunction, Request, Response } from 'express';
import Logger from './Infra/Logger';


const app = express();
const port = 3000;

app.use(express.json());

app.use(Logger);

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.json('Bem vindo a primeira rota!!!');
});


app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port}`);
});

