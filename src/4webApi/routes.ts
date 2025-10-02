import { Router } from 'express';
import UsuarioController from './controllers/UsuarioController';
import container from './config/InversifyConfig';

const routes = Router();

const usuarioController = container.get<UsuarioController>('UsuarioController');
const livroController = container.get<UsuarioController>('LivroController');

// Test Driven Design
routes.use('/usuarios', usuarioController.router);
routes.use('/livros', livroController.router);

export default routes;