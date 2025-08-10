import path from "path";
import fs from 'fs';
import { DBSchema } from "./DBSchema";
import { Usuario, UsuarioSchema } from "../usuarios";

export default class UsuarioRepositorio {
    private caminhoArquivo: string;

    constructor(caminho: string = 'fakeBD.json') {
        this.caminhoArquivo = path.join(__dirname, caminho)
    }

    private acessoDB(): DBSchema {
        const bdPuro = fs.readFileSync(this.caminhoArquivo, 'utf-8');
        return JSON.parse(bdPuro);
    } 
    private reescreverBD(DbAtualizado: DBSchema):boolean {
        try {
            fs.writeFileSync(this.caminhoArquivo, JSON.stringify(DbAtualizado));
            return true;
        } catch {
            return false;
        }
    }

    public getUsuarios(): UsuarioSchema[] {
        const bd =  this.acessoDB();
        const usuarios = bd.users;
        return usuarios;
    }

    public getUsuarioPorId (id: number): UsuarioSchema | undefined {
        const usuarios = this.getUsuarios();
        return usuarios.find(user => user.id === id);
    }

    public criarUsario(usuario: Usuario): UsuarioSchema[] {
        const usuarios = this.getUsuarios();
        usuarios.push(
            { ...usuario }
        );
        const bdAtualizado = this.acessoDB();
        bdAtualizado.users = usuarios;
        this.reescreverBD(bdAtualizado);
        return usuarios;
    } 
}