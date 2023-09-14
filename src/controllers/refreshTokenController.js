const { validationResult, matchedData } = require('express-validator');
const dayjs = require("dayjs");

const authService = require("../services/authService");

module.exports = {
    addAction: async (req, res) => {
        //validando se a request esta com erro
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({ error: {msg : errors.mapped()} });
            return;
        }
        //pegando os dados da request
        const data = matchedData(req);

        //pegando o userId no refreshToken
        const refreshToken = await authService.RefreshToken(data.refreshToken);
        if(!refreshToken.userId) {
            res.status(400).json({error: {msg : refreshToken.error} });
            return;
        }

        //deletando todos os RefreshTokens do user
        await authService.DeleteRefreshToken(refreshToken.userId);

        //gerando o expiresIn do refreshToken
        const expiresIn = dayjs().add(30, "days").unix();

        //criando o objeto do refreshToken
        let refreshTokenData = {};
        refreshTokenData.userId = refreshToken.userId;
        refreshTokenData.expiresIn = expiresIn;
 
        //criando um refreshToken novo
        const newRefreshToken = await authService.GenerateRefreshToken(refreshTokenData);

        //mandando o id do user para gerar um token
        const setToken = await authService.GenerateToken(refreshToken.userId);

        res.status(201).json({ token: setToken.token, refreshToken: newRefreshToken });
    },
};