const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");
const dayjs = require("dayjs");

const authService = require("../services/authService");

module.exports = {
  signin: async (req, res) => {
    //validando se a request esta com erro
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: { msg: errors.mapped() } });
      return;
    }
    //pegando os dados da request
    const data = matchedData(req);

    //criando o objeto user
    let user = {};
    user.email = data.email;
    user.password = data.password;

    //mandando o objeto user para a autenticação
    const authenticatedUser = await authService.AuthenticateUser(user);
    if (!authenticatedUser.userId) {
      res.status(401).json({ error: authenticatedUser.error });
      return;
    }

    //mandando o userId para deletar o refreshToken antigo
    await authService.DeleteRefreshToken(authenticatedUser.userId);
    
    //gerando o expiresIn do refreshToken
    const expiresIn = dayjs().add(30, "days").unix();

    //adicionando as informações necessarias para cadastrar o refreshToken
    user.userId = authenticatedUser.userId;
    user.expiresIn = expiresIn;
    
    //Gerando o RefreshToken
    const refreshToken = await authService.GenerateRefreshToken(user);

    //mandando o id do user para gerar um token
    const setToken = await authService.GenerateToken(authenticatedUser.userId);

    res.status(200).json({ token: setToken.token, refreshToken: refreshToken });
  },
  signup: async (req, res) => {
    //validando se a request esta com erro
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: { msg: errors.mapped() } });
      return;
    }
    //pegando os dados da request
    const data = matchedData(req);

    // Verificando cargo
    if (data.role != "empresa" && data.role != "cliente") {
      res.status(400).json({ error: { msg: "Cargo Inválido" } });
      return;
    }

    //gerando hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    //criando o objeto user
    let user = {};
    user.name = data.name;
    user.email = data.email;
    user.passwordHash = passwordHash;
    user.cell = data.cell;
    user.role = data.role;

    //mandando o objeto para ser cadastrado
    const createdUser = await authService.CreateUser(user);
    if(createdUser !== true) {
        res.status(400).json({ error: createdUser.error });
        return;
    }
    res.status(201).end();
  },
  forgotPassword: async (req, res) => {
    //validando se a request esta com erro
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: { msg: errors.mapped() } });
      return;
    }

    //pegando os dados da request
    const data = matchedData(req);

    //criando o objeto user
    let user = {};
    user.email = data.email;
    user.cell = data.cell;

    //mandando o objeto user para a autenticação
    const authenticatedUser = await authService.forgotPassword(user);
    if (!authenticatedUser.userId) {
      res.status(401).json({ error: authenticatedUser.error });
      return;
    }

    //mandando o id do user para gerar um token
    const setToken = await authService.GenerateToken(authenticatedUser.userId);

    res.status(201).json({ token: setToken.token });
  },
};
