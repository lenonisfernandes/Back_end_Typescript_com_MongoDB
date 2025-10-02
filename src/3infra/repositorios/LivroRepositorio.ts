import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import DBModels from './DBModels';
import LivroRepositorioInterface from '../../2domain/interfaces/LivroRepositorioInterface';
import Livro from '../../1entidades/Livro';

@injectable()
export default class LivroRepositorio implements LivroRepositorioInterface {
    private livroModel = Model<Livro>;

    constructor(@inject('DBModels') dbModel: DBModels) {
        this.livroModel = dbModel.livroModels;
    }

    async buscarTodos(): Promise<(Livro | undefined)[]> {
        return await this.livroModel.find();
    }

    async criar(livro: Livro): Promise<Livro> {
        const novoLivro = new this.livroModel(livro);
        await novoLivro.save();
        return novoLivro;
    }

    async deletar(id: string): Promise<boolean> {
        const resultado = await this.livroModel.deleteOne({ _id: id });
        return resultado.deletedCount > 0;
    }

}