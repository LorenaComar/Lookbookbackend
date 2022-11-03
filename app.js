require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');


//conexão com o banco de dados
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

/*
con.end((err) => {
    if(err){
        console.log('Erro to finish connection...', err)
        return
    }
    console.log('Conexão finalizada!')
})
*/

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get("/home", (req, res) => {
    res.send("Olá")

})

app.post("/insert/desejados", (req, res) => {
    const {titulo, autor} = req.body;
    console.log(req.body);
    console.log(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);
    res.send(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);

    const sqlInsert = 'INSERT INTO livrosdesejados (titulo, autor) VALUES (?, ?)';
    con.query(sqlInsert, [titulo, autor], (err, result) => {
        if (err) {
            console.log('Inserção de dados no livros desejados SEM SUCESSO');
        }else{
            console.log('Inserção de dados livros desejados SUCESSO')
            res.send(result)
        }
    })
})

app.post("/insert/disponiveis", (req, res) => {
    const {titulo, autor} = req.body;
    console.log(req.body);
    console.log(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);
    res.send(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);

    const sqlInsert = 'INSERT INTO livrosdisponiveis (titulo, autor) VALUES (?, ?)';
    con.query(sqlInsert, [titulo, autor], (err, result) => {
        if (err) {
            console.log('Inserção de dados no livros disponíveis SEM SUCESSO');
        }else{
            console.log('Inserção de dados livros disponíveis SUCESSO')
            res.send(result)
        }
    })
})


//axios
app.listen(port, (req, res) => {
    console.log(`Server is running in http://localhost:${
    port}`)
});