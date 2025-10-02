import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import LivroServiceInterface from '../../2domain/interfaces/LivroServiceInterface';
import Livro from '../../1entidades/Livro';

@injectable()
class LivroController {
    private readonly livroService: LivroServiceInterface;
    public readonly router: Router = Router();

    constructor(
        @inject('LivroService')
        livroService: LivroServiceInterface,
    ) {
        this.livroService = livroService;
        this.routes();
    }

    private routes() {
        this.router.get('/', this.buscarTodos.bind(this));
        this.router.post('/', this.criar.bind(this));
        this.router.delete('/:id', this.deletar.bind(this));
        this.router.patch('/adicionar-autor', this.adicionarAutor.bind(this));
    }

    async buscarTodos(req: Request, res: Response): Promise<void> {
        const livros = await this.livroService.buscarTodos();
        res.status(200).json(livros);
    }

    async criar(req: Request, res: Response): Promise<void> {
        const dadosLivro: Livro = req.body;
        const livro = await this.livroService.criar(dadosLivro);
        res.status(201).json(livro);
    }

    async deletar(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this.livroService.deletar(id);
        res.status(204).json('Livro deletado com sucesso');
    }

    async adicionarAutor(req: Request, res: Response): Promise<void> { 
        const {userId, bookData}: {userId: number, bookData: Livro} = req.body;
        const livro = await this.livroService.adicionarAutor(userId, bookData);
        res.status(200).json(livro);
    }
}


export default LivroController;