import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import UsuarioAsyncRepositorioInterface from '../../2domain/interfaces/UsuarioAsyncRepositorioInterface';
import { Usuario } from '../../1entidades/Usuario';
import { Model } from 'mongoose';
import DBModels from './DBModels';

@injectable()
export default class UsuarioMongooseRepositorio implements UsuarioAsyncRepositorioInterface {
    private userModel = Model<Usuario>;

    constructor(@inject('DBModels') dbModel: DBModels) {
        this.userModel = dbModel.userModels;
    }

    async getUsuarios(): Promise<Usuario[]> {
        return await this.userModel.find();
    }

    async getUsuarioPorId(id: number): Promise<Usuario | undefined> {
        return await this.userModel.findOne({id}) ?? undefined;
    }

    async criarUsario(usuario: Usuario): Promise<Usuario[]> {
        const user = new this.userModel(usuario);
        await user.save();
        return [user];
    }

    async deletarUsuario(id: number): Promise<boolean> {
        const result = await this.userModel.deleteOne({id});
        return result.deletedCount > 0;
    }

    async atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<Usuario | undefined> {
        const result = await this.userModel.findOneAndUpdate({id}, dadosAtualizados, { new: true});
        return result ?? undefined;
    }

    async substituirUsuario(id: number, dadosCompletos: Usuario): Promise<Usuario | undefined> {
        const result = await this.userModel.findOneAndUpdate({id}, dadosCompletos, { new: true});
        return result ?? undefined;
    }

}