import routes from './Api/routes';
import express, { Request, Response } from 'express';


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json('Bem vindo a primeira rota!!!');
});

app.use('/api', routes);

app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port}`);
});

