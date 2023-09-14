const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

module.exports = {
  AuthenticateUser: async (data) => {
    //validando o email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return { error: { msg: "E-mail ou Senha Inválido" } };
    }

    //validando a senha
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      return { error: { msg: "E-mail ou Senha Inválido" } };
    }

    return { userId: user._id };
  },
  GenerateToken: async (data) => {
    //gerando token e salvando-o
    const token = sign({}, process.env.TOKEN_SECRET, {
      subject: `${data}`,
      expiresIn: "1d",
    });

    return { token };
  },
  CreateUser: async (data) => {
    // Verificando se e-mail já existe
    const user = await User.findOne({
      email: data.email,
    });
    if (user) {
      return { error: { msg: "E-mail Já existe!" } };
    }
    //cadastrando user
    const newUser = await User({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      cell: data.cell,
      role: data.role,
    });
    await newUser.save();

    return true;
  },
  forgotPassword: async (data) => {
    //verificando se existe um usuário com esse email e celular
    const user = await User.findOne({ email: data.email, cell: data.cell });
    if (!user) {
      return { error: { msg: "E-mail ou celular Inválido" } };
    }

    return { userId: user._id };
  },
  GenerateRefreshToken: async (data) => {
    //cadastrando user
    const newRefreshToken = await RefreshToken({
      userId: data.userId,
      expiresIn: data.expiresIn,
    });
    await newRefreshToken.save();

    return newRefreshToken._id;
  },
  RefreshToken: async (data) => {
    //validando o token
    const refreshToken = await RefreshToken.findById(data);
    if (!refreshToken) {
      return { error: { msg: "Token inválido!" } };
    }

    return { userId: refreshToken.userId};
  },
  DeleteRefreshToken: async (data) => {
    //deletando o token
    await RefreshToken.deleteMany({userId : data})

    return;
  }
};
