const { checkSchema } = require('express-validator');

module.exports = {
    signup: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: { min: 2}
            },
            errorMessage: 'Nome precisa pelo menos ter dois caracteres.'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        cell: {
            isLength: {
                options: { min: 15, max: 15}
            },
            errorMessage: 'Celular inválido.'
        },
        password: {
            isLength: {
                options: { min: 2}
            },
            errorMessage: 'Senha precisa pelo menos ter dois caracteres.'
        },
        role: {
            notEmpty: true,
            errorMessage: 'Cargo não preenchido.'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            isLength: {
                options: { min: 2}
            },
            errorMessage: 'Senha precisa pelo menos ter dois caracteres.'
        }
    }),
    forgotPassword: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        cell: {
            isLength: {
                options: { min: 15, max: 15}
            },
            errorMessage: 'Celular inválido.'
        }
    })
};