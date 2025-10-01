import { Usuario } from '../../1entidades/usuarios';

interface UsuarioAsyncRepositorioInterface {
    getUsuarios(): Promise<Usuario[]>;
    getUsuarioPorId(id: number): Promise<Usuario | undefined>;
    criarUsario(usuario: Usuario): Promise<Usuario[]>;
    deletarUsuario(id: number): Promise<boolean>;
    atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<Usuario | undefined>;
    substituirUsuario(id: number, dadosCompletos: Usuario): Promise<Usuario | undefined>;
}


export default UsuarioAsyncRepositorioInterface;