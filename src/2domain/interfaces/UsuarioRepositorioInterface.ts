import { UsuarioSchema } from '../../3infra/repositorios/UsuarioSchema';
import { Usuario } from '../../1entidades/usuarios';

interface UsuarioRepositorioInterface {
    getUsuarios(): UsuarioSchema[];
    getUsuarioPorId(id: number): UsuarioSchema | undefined;
    criarUsario(usuario: Usuario): UsuarioSchema[];
    deletarUsuario(id: number): boolean;
    atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): UsuarioSchema | undefined;
    substituirUsuario(id: number, dadosCompletos: Usuario): UsuarioSchema | undefined;
}


export default UsuarioRepositorioInterface;