import { Router } from 'express';
import UsuarioController from './controllers/UsuariosController';
import container from './config/InversifyConfig';

const routes = Router();

const usuarioController = container.get<UsuarioController>('UsuarioController');

// Test Driven Design
routes.use('/usuarios', usuarioController.router);

export default routes;