export class Usuario {
    id: number;
    nome: string;
    ativo: boolean = true;
    saldo?: bigint = 12n;
    NumeroDoc?: number;
    senha?: string;

    constructor(nome: string, ativo: boolean, saldo?: bigint) {
        this.id = Math.round(Math.random() * 100);
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
