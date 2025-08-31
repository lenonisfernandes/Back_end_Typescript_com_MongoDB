import path from 'path';
import fs from 'fs';
import { DBSchema } from './DBSchema';
import { Usuario } from '../Usuarios';
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

    // PATCH - Atualização parcial (apenas campos fornecidos)
    public atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): UsuarioSchema | undefined {
        const bd = this.acessoDB();
        const usuarios = bd.users;
        const indiceUsuario = usuarios.findIndex(user => user.id === id);

        if (indiceUsuario === -1) {
            return undefined; // Usuário não encontrado
        }

        // Atualiza apenas os campos fornecidos, mantendo os existentes
        // O spread operator (...) preserva os valores originais e sobrescreve apenas os campos enviados
        usuarios[indiceUsuario] = {
            ...usuarios[indiceUsuario], // Mantém todos os campos existentes
            ...dadosAtualizados,        // Sobrescreve apenas os campos fornecidos
            id                          // Garante que o ID não seja alterado
        };

        bd.users = usuarios;
        const sucesso = this.reescreverBD(bd);

        return sucesso ? usuarios[indiceUsuario] : undefined;
    }

    // PUT - Substituição completa (todos os campos obrigatórios)
    public substituirUsuario(id: number, dadosCompletos: Usuario): UsuarioSchema | undefined {
        const bd = this.acessoDB();
        const usuarios = bd.users;
        const indiceUsuario = usuarios.findIndex(user => user.id === id);

        if (indiceUsuario === -1) {
            return undefined; // Usuário não encontrado
        }

        // Substitui completamente o usuário com os novos dados
        // Mantém apenas o ID original e alguns campos que não devem ser alterados pelo usuário
        const usuarioAtualizado: UsuarioSchema = {
            id,                           // ID original (não pode ser alterado)
            nome: dadosCompletos.nome,
            ativo: dadosCompletos.ativo,
            saldo: dadosCompletos.saldo,
            KAMV: usuarios[indiceUsuario].KAMV,  // Campo gerado pelo sistema, não alterável
            // Qualquer outro campo não enviado será removido/resetado
        };

        usuarios[indiceUsuario] = usuarioAtualizado;
        bd.users = usuarios;

        const sucesso = this.reescreverBD(bd);
        return sucesso ? usuarios[indiceUsuario] : undefined;
    }
}