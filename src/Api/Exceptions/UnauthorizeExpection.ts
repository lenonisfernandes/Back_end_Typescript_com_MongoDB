import CustomError from './CustomError';

class UnauthorizeException extends CustomError {
    constructor(message: string = 'Acesso não autorizado') {
        super(message, 401);
    }
}

export default UnauthorizeException;