import { AtualizarUsuarioDTO, CriarUsarioDTO, Usuario, ViewUsuarioDTO } from '../../1entidades/usuarios';

export default interface UsuarioServiceInterface {

    buscarId(id: number): ViewUsuarioDTO;

    buscarTodos(): ViewUsuarioDTO[];

    criarUsuario(dadosUsuario: CriarUsarioDTO): Usuario[];

    atualizarUsuarioParcial(id: number, dadosAtualizacao: Partial<AtualizarUsuarioDTO>): ViewUsuarioDTO;

    substituirUsuario(id: number, dadosCompletos: Usuario): ViewUsuarioDTO;

    deletarUsuario(id: number): boolean;
    // eslint-disable-next-line semi
}