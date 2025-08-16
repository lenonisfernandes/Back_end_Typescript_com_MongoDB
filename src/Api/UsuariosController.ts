import { Router, Request, Response } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import { AtualizarUsarioDTO as AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../Usuarios';
import { UsuarioSchema } from '../Infra/UsuarioSchema';

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
        this.router.patch('/:id', this.AtualizarUsuarioPorId.bind(this));
        this.router.delete('/:id', this.deletarUsuarioPorId.bind(this));
    }

    // TODO: validar bodies libs: Express validator ou Class Validator

    public buscarUsuarios(req: Request, res: Response) {
        const usuarios: UsuarioSchema[] = this.usuarioRepositorio.getUsuarios();
        const usuariosDto: ViewUsuarioDTO[] = usuarios.map(usuario => ({
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        } as ViewUsuarioDTO));
        res.json(usuariosDto);
    }

    public buscarUsuarioPorId(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.json('Id não enviado!');
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
            return;
        }
        res.json('Usuario não encontrado');
    }

    public criarUsuario(req: Request, res: Response) {
        const dadosUsuario: CriarUsarioDTO = req.body;
        let usuarios = this.usuarioRepositorio.getUsuarios();
        const idsExistentes = usuarios.map(usuario => usuario.id);
        const novoId = Math.max(...idsExistentes) + 1;
        const usuario = new Usuario(
            novoId ?? '0',
            dadosUsuario.nome,
            dadosUsuario.ativo,
            dadosUsuario.saldo
        );
        this.usuarioRepositorio.criarUsario(usuario);
        usuarios = this.usuarioRepositorio.getUsuarios();
        res.json(usuarios);
    }

    public AtualizarUsuarioPorId(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.json('Id não enviado!');
            return;
        }
        const dadosUsuario: AtualizarUsuarioDTO = req.body;
        const usuario = this.usuarioRepositorio.atualizarUsuario(+id, dadosUsuario);
        if (usuario) {
            const usuarioDto: ViewUsuarioDTO = {
                nome: usuario.nome,
                ativo: usuario.ativo,
                NumeroDoc: usuario.KAMV,
            };
            res.json(usuarioDto);
            return;
        }
        res.json('Usuario não encontrado');
    }

    public deletarUsuarioPorId(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            res.json('Id não enviado!');
            return;
        }
        const sucesso = this.usuarioRepositorio.deletarUsuario(+id);
        if (sucesso) {
            res.json('Usuario excluído com sucesso');
            return;
        }
        res.json('Usuario não encontrado');
    }
}


export default UsuarioController;