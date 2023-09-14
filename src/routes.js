const express = require('express');
const router = express.Router();

const auth = require('./middlewares/auth');

const authValidator = require('./validators/authValidator');
const authController = require('./controllers/authController');

const refreshTokenValidator = require('./validators/refreshTokenValidator');
const refreshTokenController = require('./controllers/refreshTokenController');


// rotas de login e cadastro
router.post('/user/signin', authValidator.signin, authController.signin);
router.post('/user/signup', authValidator.signup, authController.signup);
router.post('/user/forgotPassword', authValidator.forgotPassword, authController.forgotPassword);

// rota para gerar um novo refreshToken
router.post('/refreshToken', refreshTokenValidator.addAction, refreshTokenController.addAction);


module.exports = router;