const { verify, decode } = require('jsonwebtoken');

module.exports = {
    private: async (req, res, next) => {
        //pegando o token
        let token = '';
        if(req.query.token){
            token = req.query.token;
        }
        else if(req.body.token){
            token = req.body.token;
        }

        //vendo se ele está vazio
        if(token == ''){
            res.status(401).json({error : {msg: "Login Inválido"}});
            return;
        }
        try {
            verify(token, process.env.TOKEN_SECRET)

            const {sub: userId} = decode(token);

            req.userId = String(userId);
            
            return next();
        }
        catch(err){
            return res.status(401).json({error : {msg: "Token Inválido"}});
        }
    }
};