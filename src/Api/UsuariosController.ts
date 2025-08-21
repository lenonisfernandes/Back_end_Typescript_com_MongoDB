import { Router, Request, Response } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import { AtualizarUsarioDTO as AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../Usuarios';
import { UsuarioSchema } from '../Infra/UsuarioSchema';
import { body, param, query, validationResult } from 'express-validator';
import NotFoundException from './Exceptions/NotFoundExpection';

class UsuarioController {
    private readonly usuarioRepositorio: UsuarioRepositorio;
    public router: Router = Router();

    constructor(usuarioRepositorio: UsuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.routes();
    }

    public routes() {
        this.router.get('/', this.buscarUsuarios.bind(this));
        this.router.get('/:id', [
            param('id').isNumeric().withMessage('O id deve ser numérico')
        ], this.buscarUsuarioPorId.bind(this));
        this.router.post('/', [
            body('nome')
                .exists().withMessage('O campo nome é obrigatório')
                .isString().withMessage('O campo nome deve ser um texto'),
            body('ativo')
                .exists().withMessage('O campo ativo é obrigatório')
                .isBoolean().withMessage('O campo ativo deve ser um boolean')
        ], this.criarUsuario.bind(this));
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
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.status(400).json({ erros: erros.array() });
            return;
        }

        const id = req.params.id;
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
        throw new NotFoundException('Usuario não encontrado');
    }

    public criarUsuario(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.status(400).json({ erros: erros.array() });
            return;
        }

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
        res.status(201).json(usuarios);
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
        res.status(404).json('Usuario não encontrado');
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