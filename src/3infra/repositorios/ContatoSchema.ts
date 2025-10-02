import { Schema } from 'mongoose';


export const ContatoSchema: Schema = new Schema({
    email: { type: String, required: false },
    telefone: { type: String, required: false },
    website: { type: String, required: false }
});
