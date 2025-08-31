import { Router, Request, Response } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import { AtualizarUsarioDTO as AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../Usuarios';
import { UsuarioSchema } from '../Infra/UsuarioSchema';
import { body, param, validationResult } from 'express-validator';
import NotFoundException from './Exceptions/NotFoundExpection';
import UsuarioService from '../domain/services/UsuarioService';
import BadRequestException from './Exceptions/BadRequestException';

class UsuarioController {
    private readonly usuarioRepositorio: UsuarioRepositorio;
    private readonly usuarioService: UsuarioService;
    public router: Router = Router();

    constructor(
        usuarioRepositorio: UsuarioRepositorio,
        usuarioService: UsuarioService,
    ) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.usuarioService = usuarioService;
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

        // PATCH - Atualização parcial (alguns campos)
        this.router.patch('/:id', [
            param('id').isNumeric().withMessage('O id deve ser numérico'),
            // Validações opcionais para PATCH - campos podem ou não estar presentes
            body('nome').optional().isString().withMessage('O campo nome deve ser um texto'),
            body('ativo').optional().isBoolean().withMessage('O campo ativo deve ser um boolean'),
            body('saldo').optional().isNumeric().withMessage('O campo saldo deve ser numérico')
        ], this.atualizarUsuarioParcial.bind(this));

        // PUT - Substituição completa do recurso (todos os campos obrigatórios)
        this.router.put('/:id', [
            param('id').isNumeric().withMessage('O id deve ser numérico'),
            // Validações obrigatórias para PUT - todos os campos devem estar presentes
            body('nome')
                .exists().withMessage('O campo nome é obrigatório')
                .isString().withMessage('O campo nome deve ser um texto'),
            body('ativo')
                .exists().withMessage('O campo ativo é obrigatório')
                .isBoolean().withMessage('O campo ativo deve ser um boolean'),
            body('saldo')
                .exists().withMessage('O campo saldo é obrigatório')
                .isNumeric().withMessage('O campo saldo deve ser numérico')
        ], this.substituirUsuario.bind(this));

        this.router.delete('/:id', [
            param('id').isNumeric().withMessage('O id deve ser numérico'),
        ], this.deletarUsuarioPorId.bind(this));
    }

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
            throw new BadRequestException(erros.array());
        }
        const id = req.params.id;

        const usuarioDto = this.usuarioService.buscarId(+id);

        res.status(200).json(usuarioDto);
    }

    public criarUsuario(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            throw new BadRequestException(erros.array());
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

    public atualizarUsuarioParcial(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.status(400).json({ erros: erros.array() });
            return;
        }

        const id = +req.params.id;
        const dadosAtualizacao: Partial<AtualizarUsuarioDTO> = req.body;

        // Verifica se pelo menos um campo foi enviado
        if (Object.keys(dadosAtualizacao).length === 0) {
            res.status(400).json({
                erro: 'Pelo menos um campo deve ser enviado para atualização'
            });
            return;
        }


        const usuario = this.usuarioRepositorio.atualizarUsuarioParcial(id, dadosAtualizacao);

        if (!usuario) throw new NotFoundException('Usuário não encontrado');

        const usuarioDto: ViewUsuarioDTO = {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        };

        res.status(200).json({
            mensagem: 'Usuário atualizado parcialmente com sucesso',
            usuario: usuarioDto
        });
    }

    // PUT - Substituição completa (substitui todos os campos)
    public substituirUsuario(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.status(400).json({ erros: erros.array() });
            return;
        }

        const id = +req.params.id;
        const dadosCompletos: Usuario = req.body;

        const usuario = this.usuarioRepositorio.substituirUsuario(id, dadosCompletos);

        if (!usuario) throw new NotFoundException('Usuário não encontrado');

        const usuarioDto: ViewUsuarioDTO = {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        };

        res.status(200).json({
            mensagem: 'Usuário substituído com sucesso',
            usuario: usuarioDto
        });
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