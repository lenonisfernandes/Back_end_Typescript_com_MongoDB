import { Schema } from 'mongoose';
import { ContatoSchema } from './ContatoSchema';
import { LivroSchema } from './LivroSchema';

export const UsuarioSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    ativo: { type: Boolean, default: true },
    saldo: { type: Number, required: false },
    contato: ContatoSchema,
    livro: [LivroSchema],
})

