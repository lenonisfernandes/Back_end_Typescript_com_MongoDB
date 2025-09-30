import CustomError from './CustomError';

class BdException extends CustomError {
    constructor(message: string) {
        super(message, 500);
        console.log('BD Error: ', super.message);
    }
}

export default BdException;