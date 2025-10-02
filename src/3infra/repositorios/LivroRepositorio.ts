import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import DBModels from './DBModels';
import LivroRepositorioInterface from '../../2domain/interfaces/LivroRepositorioInterface';
import Livro from '../../1entidades/Livro';
import { Usuario } from '../../1entidades/Usuario';

@injectable()
export default class LivroRepositorio implements LivroRepositorioInterface {
    private livroModel = Model<Livro>;
    private userModel = Model<Usuario>;

    constructor(@inject('DBModels') dbModel: DBModels) {
        this.livroModel = dbModel.livroModels;
        this.userModel = dbModel.userModels;
    }
    
    async adicionarAutor(userId: number, bookData: Livro): Promise<Livro | undefined> {
        const usuario = await this.userModel.findOne({ id: userId });
        const session = await this.userModel.db.startSession();
        try {
            await session.withTransaction(async () => {
                if (usuario) {
                    usuario.livros.push(bookData);
                    await usuario.save();

                    return await this.livroModel.findOneAndUpdate(
                        { nome: bookData.nome },
                        { $addToSet: { autores: usuario._id } },
                        { upsert: true }
                    ) ?? undefined;
                }
            });
            return;
        } finally {
            await session.endSession();
        }

        
    }

    async buscarTodos(): Promise<(Livro | undefined)[]> {
        return await this.livroModel.find().populate('autores');
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