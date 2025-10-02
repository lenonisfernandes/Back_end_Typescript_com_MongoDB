import mongoose, { ObjectId } from "mongoose";

class Livro {
    constructor(
        public nome?: string,
        public autores?: ObjectId[],
        public _id?: mongoose.Types.ObjectId,
    ) { }
}

export default Livro;