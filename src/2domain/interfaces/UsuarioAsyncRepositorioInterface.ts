import { UsuarioSchema } from '../../3infra/repositorios/UsuarioSchema';
import { Usuario } from '../../1entidades/usuarios';

interface UsuarioAsyncRepositorioInterface {
    getUsuarios(): Promise<UsuarioSchema[]>;
    getUsuarioPorId(id: number): Promise<UsuarioSchema | undefined>;
    criarUsario(usuario: Usuario): Promise<UsuarioSchema[]>;
    deletarUsuario(id: number): Promise<boolean>;
    atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<UsuarioSchema | undefined>;
    substituirUsuario(id: number, dadosCompletos: Usuario): Promise<UsuarioSchema | undefined>;
}


export default UsuarioAsyncRepositorioInterface;