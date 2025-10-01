import { UsuarioSchemaDriver } from '../../3infra/repositorios/UsuarioSchema';
import { Usuario } from '../../1entidades/usuarios';

interface UsuarioRepositorioInterface {
    getUsuarios(): UsuarioSchemaDriver[];
    getUsuarioPorId(id: number): UsuarioSchemaDriver | undefined;
    criarUsario(usuario: Usuario): UsuarioSchemaDriver[];
    deletarUsuario(id: number): boolean;
    atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): UsuarioSchemaDriver | undefined;
    substituirUsuario(id: number, dadosCompletos: Usuario): UsuarioSchemaDriver | undefined;
}


export default UsuarioRepositorioInterface;