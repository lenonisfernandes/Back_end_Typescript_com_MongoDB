import { AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../../1entidades/usuarios';

export default interface UsuarioServiceInterface {

    buscarId(id: number): Promise<ViewUsuarioDTO>;

    buscarTodos(): Promise<ViewUsuarioDTO[]>;

    criarUsuario(dadosUsuario: CriarUsarioDTO): Promise<Usuario[]>;

    atualizarUsuarioParcial(id: number, dadosAtualizacao: Partial<AtualizarUsuarioDTO>): Promise<ViewUsuarioDTO>;

    substituirUsuario(id: number, dadosCompletos: Usuario): Promise<ViewUsuarioDTO>;

    deletarUsuario(id: number): Promise<boolean>;
    // eslint-disable-next-line semi
}