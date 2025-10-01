import 'reflect-metadata';
import { injectable } from 'inversify';
import UsuarioAsyncRepositorioInterface from '../../2domain/interfaces/UsuarioAsyncRepositorioInterface';
import { Usuario } from '../../1entidades/usuarios';
import { UserModel } from './UsuarioSchema';

@injectable()
export default class UsuarioMongooseRepositorio implements UsuarioAsyncRepositorioInterface {
    constructor() {

    }

    async getUsuarios(): Promise<Usuario[]> {
        return await UserModel.find();
    }

    async getUsuarioPorId(id: number): Promise<Usuario | undefined> {
        return await UserModel.findOne({id}) ?? undefined;
    }

    async criarUsario(usuario: Usuario): Promise<Usuario[]> {
        const user = new UserModel(usuario);
        await user.save();
        return [user];
    }

    async deletarUsuario(id: number): Promise<boolean> {
        const result = await UserModel.deleteOne({id});
        return result.deletedCount > 0;
    }

    async atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<Usuario | undefined> {
        const result = await UserModel.findOneAndUpdate({id}, dadosAtualizados, { new: true});
        return result ?? undefined;
    }

    async substituirUsuario(id: number, dadosCompletos: Usuario): Promise<Usuario | undefined> {
        const result = await UserModel.findOneAndUpdate({id}, dadosCompletos, { new: true});
        return result ?? undefined;
    }

}