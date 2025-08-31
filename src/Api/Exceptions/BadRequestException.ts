import { ValidationError } from 'express-validator';
import CustomError from './CustomError';

class BadRequestException extends CustomError {
    constructor(message: Array<ValidationError>) {
        const mensagemTratada = message.map(m => m.msg);
        super(mensagemTratada.toString(), 400);
    }
}

export default BadRequestException;