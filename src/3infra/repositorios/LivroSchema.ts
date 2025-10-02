import { Schema } from 'mongoose';
import { ContatoSchema } from './ContatoSchema';


export const LivroSchema: Schema = new Schema({
    nome: { type: String, required: false },
    autores: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
});
