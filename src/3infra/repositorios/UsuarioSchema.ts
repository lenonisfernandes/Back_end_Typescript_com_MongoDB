import { ObjectId } from 'mongodb';

export type UsuarioSchema = {
    _id: ObjectId,
    id: number,
    nome: string,
    ativo: boolean,
    saldo?: bigint,
    contato?: { [key: string]: unknown },
    KAMV?: number
}