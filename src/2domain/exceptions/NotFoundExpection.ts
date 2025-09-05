import CustomError from './CustomError';

class NotFoundException extends CustomError {
    constructor(message: string = 'Dado não encontrado') {
        super(message, 404);
    }
}

export default NotFoundException;