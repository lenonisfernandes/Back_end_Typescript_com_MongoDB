import { DBSchema } from './DBSchema';
import { UsuarioSchema } from './UsuarioSchema';
import { Usuario } from '../../1entidades/usuarios';
import 'reflect-metadata';
import { injectable } from 'inversify';
import UsuarioAsyncRepositorioInterface from '../../2domain/interfaces/UsuarioAsyncRepositorioInterface';
import dotenv from 'dotenv';
import { Collection, Db, MongoClient, MongoServerError, ObjectId, ServerApiVersion } from 'mongodb';
import DbException from '../../2domain/exceptions/BdException';

dotenv.config();

const jsonSchema = {
    bsonType: 'object',
    required: ['id', 'nome', 'ativo'],
    properties: {
        nome: {
            bsonType: 'string',
            description: 'deve ser uma string'
        },
        email: {
            bsonType: 'string',
            pattern: '^\\S+@\\S+\\.\\S+$',
            description: 'deve ser um email válido'
        },
        ativo: {
            bsonType: 'boolean',
            description: 'deve ser verdadeiro ou falso'
        }
    },
};

@injectable()
export default class UsuarioRepositorio implements UsuarioAsyncRepositorioInterface {
    private uri: string;
    constructor(private dbName: string = 'tsmongo', private collectionName: string = 'users') {
        this.uri = process.env.MONGO_DB_KEY ?? '';
        this.dbName = 'tsmongo';
        this.collectionName = 'users';
        this.createCollectionWithValidation().catch(console.error);
    }

    async createCollectionWithValidation() {
        const client = new MongoClient(this.uri);
        await client.connect();
        const db = client.db(this.dbName);
        try {
            await db.createCollection(this.collectionName, { validator: { $jsonSchema: jsonSchema } });
            console.log('Collection criada com validações!');
        } catch (error) {
            if( error instanceof MongoServerError && error.message.includes('already exists') ) 
                console.info('Collection já existe. Nenhuma ação tomada.');
        } finally {
            await client.close();
        }
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
        const { collection, client } = await this.getCollectionAndClient();
        try {
            const results = await collection.deleteOne({ id });
            return (results.deletedCount > 0);
        } catch (error) {
            console.error(error);
            throw new DbException('Erro ao deletar usuário no banco de dados');
        } finally {
            client.close();
        }
    }

    // PATCH - Atualização parcial (apenas campos fornecidos)
    public async atualizarUsuarioParcial(id: number, dadosAtualizados: Partial<Usuario>): Promise<UsuarioSchema | undefined> {
        const { collection, client } = await this.getCollectionAndClient();

        try {
            const dadosPadraoMongo = {
                $set: {
                    ...(dadosAtualizados.nome && { nome: dadosAtualizados.nome }),
                    ...((dadosAtualizados.ativo !== undefined) && { ativo: dadosAtualizados.ativo }),
                }
            }
            await collection.updateOne( { id } , {dadosPadraoMongo} );
            return await this.getUsuarioPorId(id);

        } catch (error) {

        } finally {
            client.close();
        }
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