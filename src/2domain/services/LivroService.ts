import { inject, injectable } from 'inversify';
import 'reflect-metadata';
 import LivroRepositorioInterface from '../interfaces/LivroRepositorioInterface';
import LivroServiceInterface from '../interfaces/LivroServiceInterface';
import Livro from '../../1entidades/Livro';

@injectable()
export default class LivroService implements LivroServiceInterface {
    private readonly livroRepositorio: LivroRepositorioInterface;

    constructor(
        @inject('LivroRepositorio')
        livroRepositorio: LivroRepositorioInterface
    ) {
        this.livroRepositorio = livroRepositorio;
    }
    
    async buscarTodos(): Promise<(Livro | undefined)[]> {
        return await this.livroRepositorio.buscarTodos();
    }
    
    async criar(livro: Livro): Promise<Livro> {
        return await this.livroRepositorio.criar(livro);
    }
    
    async deletar(id: string): Promise<void> {
        const deletado = await this.livroRepositorio.deletar(id);
        if (deletado) return;
        throw new Error('Livro não encontrado');
    }

    
}