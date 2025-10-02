import { Schema } from 'mongoose';
import { ContatoSchema } from './ContatoSchema';

export const UsuarioSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    ativo: { type: Boolean, default: true },
    saldo: { type: Number, required: false },
    contato: ContatoSchema,
    KAMV: { type: Number, required: false }
})

