import UsuarioService from '../2domain/services/UsuarioService';
import UsuarioRepositorio from '../3infra/repositorios/UsuarioRepositorio';
import { UsuarioSchema } from '../3infra/repositorios/UsuarioSchema';

jest.mock('../Infra/UsuarioRepositorio');

describe('UsuarioService', () => {
    let usuarioService: UsuarioService;
    let usuarioRepositorio: jest.Mocked<UsuarioRepositorio>;

    beforeEach(() => {
        usuarioRepositorio = new UsuarioRepositorio() as jest.Mocked<UsuarioRepositorio>;
        usuarioService = new UsuarioService(usuarioRepositorio);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('buscar por id', () => {
        it('deve retornar o usuario correpondente ao id fornecido', () => {
            const mockUsuario: UsuarioSchema = {
                id: 1,
                nome: 'Usuario Falso',
                ativo: true
            };

            usuarioRepositorio.getUsuarioPorId.mockReturnValue(mockUsuario);

            const usuario = usuarioService.buscarId(1);

            expect(usuarioRepositorio.getUsuarioPorId).toHaveBeenCalledWith(1);

            expect(usuario).toEqual(mockUsuario);
            expect(usuario?.ativo).toBeTruthy();
        });

        it('deve retornar um erro se o usuário não for encontrado', () => {
            usuarioRepositorio.getUsuarioPorId.mockReturnValue(undefined);

            expect(() => usuarioService.buscarId(999)).toThrow('Usuario não encontrado');
            expect(usuarioRepositorio.getUsuarioPorId).toHaveBeenCalledWith(999);

        });
    });
});