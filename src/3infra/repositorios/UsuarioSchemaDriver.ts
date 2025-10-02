import { ObjectId } from 'bson';


export type UsuarioSchemaDriver = {
    id: number;
    nome: string;
    ativo: boolean;
    _id?: ObjectId;
    saldo?: bigint;
    contato?: { [key: string]: unknown; };
    KAMV?: number;
};
