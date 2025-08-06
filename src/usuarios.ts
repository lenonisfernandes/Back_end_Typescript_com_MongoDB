export const usuarios: UsuarioType[] = [
    { 
       id: 123,
       nome: 'Renan',
       ativo: false,
       saldo: 124398498578n,
    },
    { 
       id: 124,
       nome: 'Jessica',
       ativo: true
    },
]

export type UsuarioType = {
    id: number,
    nome: string,
    ativo: boolean,
    saldo?: bigint
}
