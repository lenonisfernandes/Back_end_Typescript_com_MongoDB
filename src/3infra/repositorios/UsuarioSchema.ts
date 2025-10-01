import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { Usuario } from '../../1entidades/usuarios';

export type UsuarioSchemaDriver = {
    id: number,
    nome: string,
    ativo: boolean,
    _id?: ObjectId,
    saldo?: bigint,
    contato?: { [key: string]: unknown },
    KAMV?: number
}

const UsuarioSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    ativo: { type: Boolean, default: true },
    saldo: { type: Number, required: false },
    contato: { type: Object, required: false },
    KAMV: { type: Number, required: false }
})

export const UserModel = mongoose.model<Usuario>('User', UsuarioSchema);