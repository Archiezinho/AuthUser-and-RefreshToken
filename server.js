require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//require nas rotas
const apiRoutes = require('./src/routes');

//conexão com o banco
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.log("Error: " + error.message);
})

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//adicionando caminho diretorio onde ficarão as imagens
server.use(express.static(__dirname + '/public'));

//rotas
server.use('/', apiRoutes);

server.use((error, request, response, next) => {
    return response.json({ error: {
        msg: error.message
    }});
});

//teste para ver se o servidor tá rodando
server.listen(process.env.PORT, ()=> {
    console.log(`- Rodando no endereço: ${process.env.BASE}`);
})