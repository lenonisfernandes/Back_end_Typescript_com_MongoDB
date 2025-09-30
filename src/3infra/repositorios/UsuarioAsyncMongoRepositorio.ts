import { promises as fs} from 'fs';
import { DBSchema } from './DBSchema';
import { UsuarioSchema } from './UsuarioSchema';
import { Usuario } from '../../1entidades/usuarios';
import 'reflect-metadata';
import { injectable } from 'inversify';
import UsuarioAsyncRepositorioInterface from '../../2domain/interfaces/UsuarioAsyncRepositorioInterface';
import dotenv from 'dotenv';
import { Collection, Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import DbException from '../../2domain/exceptions/BdException';

dotenv.config();

@injectable()
export default class UsuarioRepositorio implements UsuarioAsyncRepositorioInterface {
    private uri: string;
    constructor(private dbName: string = 'tsmongo', private collectionName: string = 'users') {
        this.uri = process.env.MONGO_DB_KEY ?? '';
        this.dbName = 'tsmongo';
        this.collectionName = 'users';
    }

    private async getCollectionAndClient(): Promise<{ collection: Collection<UsuarioSchema>, client: MongoClient }> {
        const client = new MongoClient(this.uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });

        try {
            await client.connect();
            const db = client.db(this.dbName);
            const collection = db.collection<UsuarioSchema>(this.collectionName);

            return { collection, client };
        } catch (error) {
            if(
                error instanceof Error
            ) {
                throw new DbException('Erro ao conectar ao banco de dados');
            }
            client.close();
            throw error;
        }
    }
    
    private async reescreverBD(DbAtualizado: DBSchema): Promise<boolean> {
        // try {
        //     await fs.writeFile(this.caminhoArquivo, JSON.stringify(DbAtualizado, null, 2));
        //     return true;
        // } catch (error) {
        //     console.error('Erro ao escrever no banco de dados:', error);
            return false;
        // }
    }

    public async getUsuarios(): Promise<UsuarioSchema[]> {
        const objeto = await this.getCollectionAndClient();
        try {
            const users = await objeto.collection.find({}).toArray();
            return users;
        } catch {
            throw new DbException('Erro ao buscar usuários no banco de dados');            
        } finally {
            objeto.client.close();
        }
    }

    public async getUsuarioPorId(id: number): Promise<UsuarioSchema | undefined> {
        const { collection, client } = await this.getCollectionAndClient();
        try {
            const user = await collection.findOne({id: id});
            return user ?? undefined;
        } catch {
            throw new DbException('Erro ao buscar usuário por ID no banco de dados');
        } finally {
            client.close();
        }
    }

    public async criarUsario(usuario: Usuario): Promise<UsuarioSchema[]> {
        const { collection, client } = await this.getCollectionAndClient();
        const maiorId = await collection.find().sort({id: -1}).limit(1).toArray();

        try {
            const novoUsuario = {
                _id: new ObjectId(),
                id: maiorId[0].id + 1,
                nome: usuario.nome,
                ativo: usuario.ativo
            } as UsuarioSchema;


            await collection.insertOne(novoUsuario);
            return await collection.find({}).toArray();
        } catch {
            throw new DbException('Erro ao criar usuário no banco de dados');
        } finally {
            client.close();
        }
    }

    public async deletarUsuario(id: number): Promise<boolean> {
        // const usuarios = await this.getUsuarios();
        // const indiceUsuario = usuarios.findIndex(user => user.id === id);

        // if (indiceUsuario === -1) {
        //     return false; // Usuário não encontrado
        // }

        // usuarios.splice(indiceUsuario, 1);
        // const bdAtualizado = await this.acessoDB();
        // bdAtualizado.users = usuarios;

        // return this.reescreverBD(bdAtualizado);
        return false;
    }

    // PATCH - Atualização parcial (apenas campos fornecidos)
    public async atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<UsuarioSchema | undefined> {
        // const bd = await this.acessoDB();
        // const usuarios = bd.users;
        // const indiceUsuario = usuarios.findIndex(user => user.id === id);

        // if (indiceUsuario === -1) {
        //     return undefined; // Usuário não encontrado
        // }

        // // Atualiza apenas os campos fornecidos, mantendo os existentes
        // // O spread operator (...) preserva os valores originais e sobrescreve apenas os campos enviados
        // usuarios[indiceUsuario] = {
        //     ...usuarios[indiceUsuario], // Mantém todos os campos existentes
        //     ...dadosAtualizados,        // Sobrescreve apenas os campos fornecidos
        //     id                          // Garante que o ID não seja alterado
        // };

        // bd.users = usuarios;
        // const sucesso = await this.reescreverBD(bd);

        // return sucesso ? usuarios[indiceUsuario] : undefined;
        return undefined;
    }

    // PUT - Substituição completa (todos os campos obrigatórios)
    public async substituirUsuario(id: number, dadosCompletos: Usuario): Promise<UsuarioSchema | undefined> {
        // const bd = await this.acessoDB();
        // const usuarios = bd.users;
        // const indiceUsuario = usuarios.findIndex(user => user.id === id);

        // if (indiceUsuario === -1) {
        //     return undefined; // Usuário não encontrado
        // }

        // // Substitui completamente o usuário com os novos dados
        // // Mantém apenas o ID original e alguns campos que não devem ser alterados pelo usuário
        // const usuarioAtualizado: UsuarioSchema = {
        //     id,                           // ID original (não pode ser alterado)
        //     nome: dadosCompletos.nome,
        //     ativo: dadosCompletos.ativo,
        //     saldo: dadosCompletos.saldo,
        //     KAMV: usuarios[indiceUsuario].KAMV,  // Campo gerado pelo sistema, não alterável
        //     // Qualquer outro campo não enviado será removido/resetado
        // };

        // usuarios[indiceUsuario] = usuarioAtualizado;
        // bd.users = usuarios;

        // const sucesso = await this.reescreverBD(bd);
 
        // return sucesso ? usuarios[indiceUsuario] : undefined;
        return undefined;
    }
}