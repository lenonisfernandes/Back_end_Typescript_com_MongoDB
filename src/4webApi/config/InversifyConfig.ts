import { Container } from 'inversify';
import UsuarioRepositorioInterface from '../../2domain/interfaces/UsuarioRepositorioInterface';
import UsuarioRepositorio from '../../3infra/repositorios/UsuarioRepositorio';
import UsuarioController from '../controllers/UsuariosController';
import UsuarioServiceInterface from '../../2domain/interfaces/UsuarioServiceInterface';
import UsuarioService from '../../2domain/services/UsuarioService';


const container = new Container();

container
    .bind<UsuarioRepositorioInterface>('UsuarioRepositorio')
    .to(UsuarioRepositorio);
container
    .bind<UsuarioServiceInterface>('UsuarioService')
    .to(UsuarioService);
container
    .bind<UsuarioController>('UsuarioController')
    .to(UsuarioController);


export default container;