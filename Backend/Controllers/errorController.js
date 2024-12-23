const CustomError = require('../Utils/customError');


const handleCastError = (error) => {
    return new CustomError(`Valor invalido para ${error.path}: ${error.value}`);
}


const handleDuplicatedKey = (error) => {
    return  new CustomError(`O login ${error.keyValue.login} já existe`, 400);
}


const handleValidationError = (error) => {
    
    const msgError = Object.values(error.errors).map((value) => value.message);

    const msg = msgError.join(' ');
    return new CustomError(`Erro de validação: ${msg}`, 400);
}


const handleTokenExpiredError = (error) => {
    return new CustomError('Token expirado. Faça login novamente!', 401);
}


const handleJwtError = (error) => {
    return new CustomError('Token inválido. Faça login novamente!', 401);
}


module.exports = (error, req, res, next) => {
    error.status = error.status || 'error';
    error.statusCode = error.statusCode || 500;

    if(error.name === 'CastError'){
        error = handleCastError(error);
    }
    else if(error.code === 11000){
        error = handleDuplicatedKey(error);
    }
    else if(error.name === 'ValidationError'){
        error = handleValidationError(error);
    }
    else if(error.name === 'TokenExpiredError'){
        error = handleTokenExpiredError(error);
    }
    else if(error.name === 'JsonWebTokenError'){
        error = handleJwtError(error);
    }


    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    else{
        res.status(error.statusCode).json({
            status: error.status,
            message: 'Alguma coisa deu errado!',
            error
        });
    }
}