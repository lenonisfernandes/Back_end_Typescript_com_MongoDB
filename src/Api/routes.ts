import { Router } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import UsuarioController from './UsuariosController';

const routes = Router();

const usuarioRepositorio = new UsuarioRepositorio();
const usuarioController = new UsuarioController(usuarioRepositorio);

// Test Driven Design

routes.use('/usuarios', usuarioController.router);

export default routes;