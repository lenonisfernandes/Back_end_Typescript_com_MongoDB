export type UsuarioSchema = {
    id: number,
    nome: string,
    ativo: boolean,
    saldo?: bigint,
    contato?: { [key: string]: unknown },
    KAMV?: number
}