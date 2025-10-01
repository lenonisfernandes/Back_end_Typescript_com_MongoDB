import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';

dotenv.config();

class MongooseConfig {
    static async connect(): Promise<void> {
        try {
            const CHAVEMONGO = `${process.env.MONGO_DB_KEY}${process.env.DATABASE}?${process.env.DB_OPTIONS}`;
            console.log(CHAVEMONGO);
            if(!CHAVEMONGO) throw new Error("Chave de BD não encontrada.");
            const connectionOptions: ConnectOptions = { connectTimeoutMS: 5000 };
            await mongoose.connect(CHAVEMONGO, connectionOptions);
            console.log("Conectado ao MongoDB com sucesso.");
        } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
}

export default MongooseConfig;
