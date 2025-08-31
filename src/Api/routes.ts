import { Router } from 'express';
import UsuarioRepositorio from '../Infra/UsuarioRepositorio';
import UsuarioController from './UsuariosController';
import UsuarioService from '../domain/services/UsuarioService';

const routes = Router();

const usuarioRepositorio = new UsuarioRepositorio();
const usuarioService = new UsuarioService(usuarioRepositorio);
const usuarioController = new UsuarioController(usuarioRepositorio, usuarioService);

// Test Driven Design

routes.use('/usuarios', usuarioController.router);

export default routes;