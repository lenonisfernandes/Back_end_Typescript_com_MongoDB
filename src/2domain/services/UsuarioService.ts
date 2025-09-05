import { ViewUsuarioDTO, CriarUsarioDTO, AtualizarUsuarioDTO, Usuario } from '../../1entidades/usuarios';
import NotFoundException from '../exceptions/NotFoundExpection';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import UsuarioRepositorioInterface from '../interfaces/UsuarioRepositorioInterface';

@injectable()
export default class UsuarioService {
    private readonly usuarioRepositorio: UsuarioRepositorioInterface;

    constructor(
        @inject('UsuarioRepositorio')
        usuarioRepositorio: UsuarioRepositorioInterface
    ) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    buscarId(id: number): ViewUsuarioDTO {
        const usuario = this.usuarioRepositorio.getUsuarioPorId(id);
        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }

        const usuarioDto: ViewUsuarioDTO = {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        };

        return usuarioDto;
    }

    buscarTodos(): ViewUsuarioDTO[] {
        const usuarios = this.usuarioRepositorio.getUsuarios();
        return usuarios.map(usuario => ({
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        } as ViewUsuarioDTO));
    }

    criarUsuario(dadosUsuario: CriarUsarioDTO): Usuario[] {
        const usuarios = this.usuarioRepositorio.getUsuarios();
        const idsExistentes = usuarios.map(usuario => usuario.id);
        const novoId = Math.max(...idsExistentes) + 1;

        const novoUsuario = new Usuario(
            novoId,
            dadosUsuario.nome,
            dadosUsuario.ativo,
            dadosUsuario.saldo
        );

        this.usuarioRepositorio.criarUsario(novoUsuario);
        return this.usuarioRepositorio.getUsuarios();
    }

    atualizarUsuarioParcial(id: number, dadosAtualizacao: Partial<AtualizarUsuarioDTO>): ViewUsuarioDTO {
        if (Object.keys(dadosAtualizacao).length === 0) {
            // TODO: tratar para badrequest
            throw new Error('Pelo menos um campo deve ser enviado para atualização');
        }

        const usuario = this.usuarioRepositorio.atualizarUsuarioParcial(id, dadosAtualizacao);

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        };
    }

    substituirUsuario(id: number, dadosCompletos: Usuario): ViewUsuarioDTO {
        const usuario = this.usuarioRepositorio.substituirUsuario(id, dadosCompletos);

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            NumeroDoc: usuario.KAMV,
        };
    }

    deletarUsuario(id: number): boolean {
        const usuario = this.usuarioRepositorio.getUsuarioPorId(id);
        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }
        return this.usuarioRepositorio.deletarUsuario(id);
    }
}