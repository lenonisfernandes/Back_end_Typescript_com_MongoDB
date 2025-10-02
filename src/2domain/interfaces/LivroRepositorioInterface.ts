import Livro from "../../1entidades/Livro";

interface LivroRepositorioInterface {
    buscarTodos(): Promise<(Livro | undefined)[]>;

    criar(livro: Livro): Promise<Livro>;

    deletar(id: string): Promise<boolean>;
    
    adicionarAutor(userId: number, bookData: Livro): Promise<Livro | undefined>;
}

export default LivroRepositorioInterface;