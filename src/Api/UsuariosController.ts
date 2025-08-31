import { Router, Request, Response } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import { AtualizarUsarioDTO as AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../Usuarios';
import { UsuarioSchema } from '../Infra/UsuarioSchema';
import { body, param, validationResult } from 'express-validator';
import NotFoundException from './Exceptions/NotFoundExpection';
import UsuarioService from '../domain/services/UsuarioService';
import BadRequestException from './Exceptions/BadRequestException';

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - ativo
 *       properties:
 *         id:
 *           type: number
 *           description: ID único do usuário
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Silva"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         saldo:
 *           type: number
 *           description: Saldo do usuário
 *           example: 100.50
 *         NumeroDoc:
 *           type: string
 *           description: Número do documento (KAMV)
 *           example: "12345678"
 * 
 *     CriarUsuarioDTO:
 *       type: object
 *       required:
 *         - nome
 *         - ativo
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "Maria Santos"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         saldo:
 *           type: number
 *           description: Saldo inicial do usuário
 *           example: 0
 * 
 *     AtualizarUsuarioDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Santos"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: false
 *         saldo:
 *           type: number
 *           description: Saldo do usuário
 *           example: 250.75
 * 
 *     ViewUsuarioDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: ID único do usuário
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Silva"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         NumeroDoc:
 *           type: string
 *           description: Número do documento (KAMV)
 *           example: "12345678"
 * 
 *     Error:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *           example: "Mensagem de erro"
 *         erros:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 * 
 *   responses:
 *     BadRequest:
 *       description: Erro de validação
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFound:
 *       description: Usuário não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 * 
 * tags:
 *   - name: Usuários
 *     description: Operações relacionadas aos usuários
 */
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

    /**
     * @swagger
     * /usuarios:
     *   get:
     *     summary: Busca todos os usuários
     *     tags: [Usuários]
     *     description: Retorna uma lista com todos os usuários cadastrados
     *     security:
     *       - basicAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuários retornada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ViewUsuarioDTO'
     *             example:
     *               - id: 1
     *                 nome: "João Silva"
     *                 ativo: true
     *                 NumeroDoc: "12345678"
     *               - id: 2
     *                 nome: "Maria Santos"
     *                 ativo: false
     *                 NumeroDoc: "87654321"
     *       401:
     *         description: Não autorizado - Credenciais inválidas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Credenciais inválidas"
     */
    public buscarUsuarios(req: Request, res: Response) {
        const usuarios: UsuarioSchema[] = this.usuarioRepositorio.getUsuarios();
        const usuariosDto: ViewUsuarioDTO[] = usuarios.map(usuario => ({
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        } as ViewUsuarioDTO));
        res.json(usuariosDto);
    }

    /**
     * @swagger
     * /usuarios/{id}:
     *   get:
     *     summary: Busca um usuário por ID
     *     tags: [Usuários]
     *     description: Retorna os dados de um usuário específico pelo seu ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID numérico do usuário
     *         example: 1
     *     responses:
     *       200:
     *         description: Usuário encontrado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ViewUsuarioDTO'
     *             example:
     *               id: 1
     *               nome: "João Silva"
     *               ativo: true
     *               NumeroDoc: "12345678"
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     */
    public buscarUsuarioPorId(req: Request, res: Response) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            throw new BadRequestException(erros.array());
        }
        const id = req.params.id;

        const usuarioDto = this.usuarioService.buscarId(+id);

        res.status(200).json(usuarioDto);
    }

    /**
     * @swagger
     * /usuarios:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Usuários]
     *     description: Cria um novo usuário no sistema
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CriarUsuarioDTO'
     *           example:
     *             nome: "Ana Costa"
     *             ativo: true
     *             saldo: 150.00
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Usuario'
     *             example:
     *               - id: 1
     *                 nome: "João Silva"
     *                 ativo: true
     *                 saldo: 100.50
     *               - id: 2
     *                 nome: "Ana Costa"
     *                 ativo: true
     *                 saldo: 150.00
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     */
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

    /**
     * @swagger
     * /usuarios/{id}:
     *   patch:
     *     summary: Atualiza parcialmente um usuário
     *     tags: [Usuários]
     *     description: Atualiza alguns campos de um usuário existente (atualização parcial)
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID numérico do usuário
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AtualizarUsuarioDTO'
     *           example:
     *             nome: "João Santos Silva"
     *             saldo: 200.00
     *     responses:
     *       200:
     *         description: Usuário atualizado parcialmente com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 mensagem:
     *                   type: string
     *                   example: "Usuário atualizado parcialmente com sucesso"
     *                 usuario:
     *                   $ref: '#/components/schemas/ViewUsuarioDTO'
     *             example:
     *               mensagem: "Usuário atualizado parcialmente com sucesso"
     *               usuario:
     *                 id: 1
     *                 nome: "João Santos Silva"
     *                 ativo: true
     *                 NumeroDoc: "12345678"
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     */
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

    /**
     * @swagger
     * /usuarios/{id}:
     *   put:
     *     summary: Substitui completamente um usuário
     *     tags: [Usuários]
     *     description: Substitui todos os dados de um usuário existente (substituição completa)
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID numérico do usuário
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nome
     *               - ativo
     *               - saldo
     *             properties:
     *               nome:
     *                 type: string
     *                 description: Nome completo do usuário
     *                 example: "Pedro Oliveira"
     *               ativo:
     *                 type: boolean
     *                 description: Status de ativação do usuário
     *                 example: false
     *               saldo:
     *                 type: number
     *                 description: Saldo do usuário
     *                 example: 500.00
     *     responses:
     *       200:
     *         description: Usuário substituído com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 mensagem:
     *                   type: string
     *                   example: "Usuário substituído com sucesso"
     *                 usuario:
     *                   $ref: '#/components/schemas/ViewUsuarioDTO'
     *             example:
     *               mensagem: "Usuário substituído com sucesso"
     *               usuario:
     *                 id: 1
     *                 nome: "Pedro Oliveira"
     *                 ativo: false
     *                 NumeroDoc: "12345678"
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     */
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

    /**
     * @swagger
     * /usuarios/{id}:
     *   delete:
     *     summary: Remove um usuário
     *     tags: [Usuários]
     *     description: Remove um usuário do sistema pelo seu ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID numérico do usuário
     *         example: 1
     *     responses:
     *       200:
     *         description: Operação concluída
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *             examples:
     *               success:
     *                 summary: Usuário removido com sucesso
     *                 value: "Usuario excluído com sucesso"
     *               not_found:
     *                 summary: Usuário não encontrado
     *                 value: "Usuario não encontrado"
     *               missing_id:
     *                 summary: ID não fornecido
     *                 value: "Id não enviado!"
     */
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