import path from 'path';
import fs from 'fs';
import { DBSchema } from './DBSchema';
import { Usuario } from '../usuarios';
import { UsuarioSchema } from './UsuarioSchema';

export default class UsuarioRepositorio {
    private caminhoArquivo: string;

    constructor(caminho: string = 'fakeBD.json') {
        this.caminhoArquivo = path.join(__dirname, caminho);
    }

    private acessoDB(): DBSchema {
        const bdPuro = fs.readFileSync(this.caminhoArquivo, 'utf-8');
        return JSON.parse(bdPuro);
    }
    private reescreverBD(DbAtualizado: DBSchema): boolean {
        try {
            fs.writeFileSync(this.caminhoArquivo, JSON.stringify(DbAtualizado));
            return true;
        } catch {
            return false;
        }
    }

    public getUsuarios(): UsuarioSchema[] {
        const bd = this.acessoDB();
        const usuarios = bd.users;
        return usuarios;
    }

    public getUsuarioPorId(id: number): UsuarioSchema | undefined {
        const usuarios = this.getUsuarios();
        return usuarios.find(user => user.id === id);
    }

    public criarUsario(usuario: Usuario): UsuarioSchema[] {
        const usuarios = this.getUsuarios();
        usuarios.push(
            { ...usuario }
        );
        const bdAtualizado = this.acessoDB();
        bdAtualizado.users = usuarios;
        this.reescreverBD(bdAtualizado);
        return usuarios;
    }

    public deletarUsuario(id: number): boolean {
        const usuarios = this.getUsuarios();
        const indiceUsuario = usuarios.findIndex(user => user.id === id);

        if (indiceUsuario === -1) {
            return false; // Usuário não encontrado
        }

        usuarios.splice(indiceUsuario, 1);
        const bdAtualizado = this.acessoDB();
        bdAtualizado.users = usuarios;

        return this.reescreverBD(bdAtualizado);
    }

    public atualizarUsuario(id: number, dadosAtualizados: Partial<Usuario>): UsuarioSchema | null {
        const usuarios = this.getUsuarios();
        const indiceUsuario = usuarios.findIndex(user => user.id === id);

        if (indiceUsuario === -1) {
            return null; // Usuário não encontrado
        }

        // Atualiza apenas os campos fornecidos, mantendo os existentes
        usuarios[indiceUsuario] = {
            ...usuarios[indiceUsuario],
            ...dadosAtualizados,
            id // Garante que o ID não seja alterado
        };

        const bdAtualizado = this.acessoDB();
        bdAtualizado.users = usuarios;

        const sucesso = this.reescreverBD(bdAtualizado);
        return sucesso ? usuarios[indiceUsuario] : null;
    }
}