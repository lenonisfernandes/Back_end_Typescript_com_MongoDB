import Livro from "../../1entidades/Livro";

interface LivroServiceInterface {
    buscarTodos(): Promise<(Livro | undefined)[]>;

    criar(livro: Livro): Promise<Livro>;

    deletar(id: string): Promise<void>;
}

export default LivroServiceInterface;