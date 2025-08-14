import { Router, Request, Response } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import { CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../usuarios';

class UsuarioController {
    private readonly usuarioRepositorio: UsuarioRepositorio;
    public router: Router = Router();

    constructor(usuarioRepositorio: UsuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.routes();
    }

    public routes() {
        this.router.get('/', this.buscarUsuarios.bind(this));
        this.router.get('/:id', this.buscarUsuarioPorId.bind(this));
        this.router.post('/', this.criarUsuario.bind(this));
    }

    public buscarUsuarios(req: Request, res: Response) {
        const usuarios = this.usuarioRepositorio.getUsuarios();
        res.json(usuarios);
    }

    public buscarUsuarioPorId(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.json('Usuario não encontrado');
            return;
        }
        const usuario = this.usuarioRepositorio.getUsuarioPorId(+id);
        if (usuario) {
            const usuarioDto: ViewUsuarioDTO = {
                nome: usuario.nome,
                ativo: usuario.ativo,
                NumeroDoc: usuario.KAMV
            };
            res.json(usuarioDto);
        }
        res.json('Usuario não encontrado');
    }

    public criarUsuario(req: Request, res: Response) {
        const dadosUsuario: CriarUsarioDTO = req.body;
        const usuario = new Usuario(
            dadosUsuario.nome,
            dadosUsuario.ativo,
            dadosUsuario.saldo
        );
        this.usuarioRepositorio.criarUsario(usuario);
        const usuarios = this.usuarioRepositorio.getUsuarios();
        res.json(usuarios);
    }
}


export default UsuarioController;