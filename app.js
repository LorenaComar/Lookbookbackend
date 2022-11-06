require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
});

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



app.post("/insert/desejados", (req, res) => {
    const {titulo, autor} = req.body;
    console.log(req.body);
    console.log(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);

    const sqlInsert = 'INSERT INTO livrosdesejados (titulo, autor) VALUES (?, ?)';
    con.query(sqlInsert, [titulo, autor], (err, result) => {
        if (err) {
            console.log('Inserção de dados no livros desejados realizada SEM SUCESSO');
        }else{
            console.log('Inserção de dados livros desejados realizada COM SUCESSO')
        }
    })
});

app.post("/insert/disponiveis", (req, res) => {
    const {titulo, autor} = req.body;
    console.log(req.body);
    console.log(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);

    const sqlInsert = 'INSERT INTO livrosdisponiveis (titulo, autor) VALUES (?, ?)';
    con.query(sqlInsert, [titulo, autor], (err, result) => {
        if (err) {
            console.log('Inserção de dados no livros disponíveis realizada SEM SUCESSO');
        }else{
            console.log('Inserção de dados livros disponíveis realizada COM SUCESSO')
        }
    })
});

app.get("/list/desejados", (req, res) => {
    const sqlSelect = 'SELECT * FROM livrosdesejados';
    
    con.query(sqlSelect, (err, result) => {
        if(err){
            console.log('Seleção dos livros desejados realizada SEM SUCESSO')
        } else {
            console.log('Seleção dos livros desejados realizada COM SUCESSO')
            res.send(result)
        }
    })
});

app.get("/list/disponiveis", (req, res) => {
    const sqlSelect = 'SELECT * FROM livrosdisponiveis';
    
    con.query(sqlSelect, (err, result) => {
        if(err){
            console.log('Seleção dos livros disponiveis realizada SEM SUCESSO')
        } else {
            console.log('Seleção dos livros disponiveis realizada COM SUCESSO')
            res.send(result)
        }
    })
});

app.put("/edit/desejados", (req, res) => {
    const { id } = req.body;
    const { titulo } = req.body;
    const { autor } = req.body;

    const sqlUpdate = "UPDATE livrosdesejados SET titulo = ?, autor = ? WHERE id = ?";

    con.query(sqlUpdate, [titulo, autor, id], (err, result) => {
        if(err){
            console.log("Update dos livros desejados realizado SEM SUCESSO");
            console.log(err);
        }
        else{
            console.log("Update dos livros desejados realizado COM SUCESSO");
            res.send(result);
        }
    })
});

app.put("/edit/disponiveis", (req, res) => {
    const { id } = req.body;
    const { titulo } = req.body;
    const { autor } = req.body;

    const sqlUpdate = "UPDATE livrosdisponiveis SET titulo = ?, autor = ? WHERE id = ?";

    con.query(sqlUpdate, [titulo, autor, id], (err, result) => {
        if(err){
            console.log("Update dos livros disponíveis realizado SEM SUCESSO");
            console.log(err);
        }
        else{
            console.log("Update dos livros disponíveis realizado COM SUCESSO");
            res.send(result);
        }
    })
});

app.delete("/delete/desejados/:id", (req,res) => {
    const { id } = req.params;

    const sqlDelete = "DELETE from livrosdesejados WHERE id = ?";

    con.query(sqlDelete, [id], (err, result) => {
        if(err) { 
            console.log("Livro deletado SEM SUCESSO");
            console.log(err);
        } else {
            console.log("Livro deletado COM SUCESSO");
            res.send(result);
        }
    });
});

app.delete("/delete/disponiveis/:id", (req,res) => {
    const { id } = req.params;

    const sqlDelete = "DELETE from livrosdisponiveis WHERE id = ?";

    con.query(sqlDelete, [id], (err, result) => {
        if(err) { 
            console.log("Livro deletado SEM SUCESSO");
            console.log(err);
        } else {
            console.log("Livro deletado COM SUCESSO");
            res.send(result);
        }
    });
});


app.post("/register", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    const sqlSelect = 'SELECT * FROM usuarios WHERE email = ?'
    con.query(sqlSelect, [email], (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length == 0) {
          const sqlInsert = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';

          con.query(sqlInsert, [email, senha], (err, response) => {
              if (err) {
                console.log("Cadastro de usuário realizado sem sucesso", err)
              } else {
              
              res.send({ msg: "Usuário cadastrado com sucesso" });
              }
            }
          );

      } else {
        res.send({ msg: "Email já cadastrado" });
      }
    });
  });


app.post('/login', (req, res) => {

    const email = req.body.email;
    const senha = req.body.senha;

    console.log(email, senha);

	con.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (err) {
          res.send(err);
        }
        if (result.length > 0) {
            bcrypt.compare(senha, result[0].senha, (error, response) => {
            if (error) {
              res.send(error);
            }
            if (response == true) {
              res.send({ msg: "Email ou senha incorreta" });
              
            } else {
              res.send({ msg: "Usuário logado com sucesso!" })
            }
          });
        } else {
          res.send({ msg: "Usuário não registrado!" });
        }
      });
});

app.post("/insert/troca", (req, res) => {
    const {data, hora, local} = req.body;
    console.log(req.body);
    console.log(`Sua troca foi marcada para dia ${data}, às ${hora} horas em ${local}`);

    const sqlInsert = 'INSERT INTO troca (data, hora, local) VALUES (?, ?, ?)';
    con.query(sqlInsert, [data, hora, local], (err, result) => {
        if (err) {
            console.log('Troca NÃO REALIZADA');
        }else{
            console.log('Troca REALIZADA');
        }
    })
});




//axios
app.listen(port, (req, res) => {
    console.log(`Server is running in http://localhost:${port}`)
});