import UsuarioRepositorio from "./Infra/UsuarioRepositorio";
import { Usuario } from "./usuarios";
import express, {Request, Response} from 'express';


const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Bem vindo a primeira rota!!!')
});

app.listen(port, () => {
    console.info(`Servidor rodando na porta: http://localhost:${port}` )
});

// const usuarioRepositorio = new UsuarioRepositorio;

// const usuario = new Usuario("Alberto",true,18n);


// console.log(
//     usuarioRepositorio.criarUsario(usuario)
// )

