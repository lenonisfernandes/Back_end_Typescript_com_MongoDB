//CRUD     - READ
import {usuarios, UsuarioType}  from './usuarios';

const usuariosBD = retornaUsuarios();
console.log('usuariosBD',usuariosBD);

const usuarios1 = retornaUsuarioPorId(1232345);
mostraEmTela()
console.log('usuarios1',usuarios1);

function mostraEmTela(): void {
    console.log("exibindo em tela");
}

// hoisting
function retornaUsuarios () {
    return usuarios;
}
function retornaUsuarioPorId (id: number): UsuarioType | undefined {
    console.log('tipo do id =', typeof id);
    return usuarios.find(user => user.id === id);
}

// criar atualiza e delete