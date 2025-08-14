export class Usuario {
    id: number;
    nome: string;
    ativo: boolean = true;
    saldo?: bigint = 12n;
    NumeroDoc?: number;
    senha?: string;

    constructor(id: number, nome: string, ativo: boolean, saldo?: bigint) {
        //this.id = Math.round(Math.random() * 100);
        this.id = id;
        this.nome = nome;
        this.ativo = ativo;
        this.saldo = saldo;
        this.senha = 'minha senha';
    }
}

// DTO - Data Transfer Object

export type CriarUsarioDTO = {
    nome: string;
    ativo: boolean;
    saldo?: bigint;
    NumeroDoc?: number;
    senha?: string;
}

export type ViewUsuarioDTO = {
    nome: string;
    ativo: boolean;
    NumeroDoc?: number;
}
