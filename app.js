require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect((err) => {
    if(err){
        console.log('Erro conectando ao banco de dados...', err)
        return
    }
    console.log('Conexão estabelecida!')
})

con.end((err) => {
    if(err){
        console.log('Erro to finish connection...', err)
        return
    }
    console.log('Conexão finalizada!')
})

app.use(bodyParser.json());

app.get("/home", (req, res) => {
    res.send("Olá")
})

app.post("/", (req, res) => {
    console.log(req.body);
    res.send(`<h1>Olá ${req.body.name} seu livro favorito é o ${req.body.bestBook}`);
})

const port = process.env.PORT;

app.listen(port, (req, res) => {
    console.log(`Server is running in http://localhost:${
    port}`)
});
