import NotFoundException from '../../Api/Exceptions/NotFoundExpection';
import UsuarioRepositorio from '../../Infra/UsuarioRepositorio';
import { ViewUsuarioDTO } from '../../Usuarios';

export default class UsuarioService {
    private readonly usuarioRepositorio: UsuarioRepositorio;
    constructor(usuarioRepositorio: UsuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }
    buscarId(id: number): ViewUsuarioDTO | undefined {
        const usuario = this.usuarioRepositorio.getUsuarioPorId(+id);
        if (usuario) {
            const usuarioDto: ViewUsuarioDTO = {
                id: usuario.id,
                nome: usuario.nome,
                ativo: usuario.ativo,
            };
            return usuarioDto;
        }
        throw new NotFoundException('Usuario não encontrado');
    }
}

















// //CRUD     - READ
// import UsuarioRepositorio from '../../Infra/UsuarioRepositorio';
// import { UsuarioSchema } from '../../Infra/UsuarioSchema';
// import { Usuario } from '../../Usuarios';

// const usuarioRepositorio = new UsuarioRepositorio();

// // hoisting
// function retornaUsuarios() {
//     return usuarioRepositorio.getUsuarios();
// }
// function retornaUsuarioPorId(id: number): UsuarioSchema | undefined {
//     //console.log('tipo do id =', typeof id);
//     return usuarioRepositorio.getUsuarioPorId(id);
// }

// function criarUsario(usuario: Usuario): UsuarioSchema[] {
//     const usuarios = usuarioRepositorio.criarUsario(
//         { ...usuario }
//     );
//     return usuarios;
// }

// function atualizaUsuario(id: number, dadosAtualizacao: UsuarioSchema): UsuarioSchema | undefined {
//     const usuario = usuarioRepositorio.getUsuarioPorId(id);

//     if (usuario) {
//         console.log(`Usuário com ID ${id} não encontrado`);
//         return;
//     }
//     throw new Error('Not implemented');
//     // // Atualiza apenas os campos fornecidos
//     // usuarioRepositorio.

//     // return usuarioRepositorio;
// }


// function deletaUsuario(id: number): UsuarioSchema | undefined {
//     const usuario = usuarioRepositorio.getUsuarioPorId(id);

//     if (usuario) {
//         console.log(`Usuário com ID ${id} não encontrado`);
//         return;
//     }
//     throw new Error('Not implemented');
//     // Remove o usuário do array e retorna o usuário removido
//     // const usuarioRemovido = usuarioRepositorio.splice(indiceUsuario, 1)[0];
//     // return usuarioRemovido;
// }