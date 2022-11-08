require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fileUpload = require("express-fileupload");
const TweetSql = require("./services/tweet")
const con = require("./config/sql");

const path = require("path");
const fs = require("fs");
const Troca = require('./services/troca');


const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "X-PINGOTHER, Content-Type, Authorization"
    );
  
    next();
});

app.post("/insert/desejados", (req, res) => {
    const {titulo, autor} = req.body;
    console.log(req.body);
    console.log(`<h1>Olá ${autor} seu livro ${titulo} foi um sucesso`);

    const sqlInsert = 'INSERT INTO livrosdesejados (titulo_livrosdesejados, autor_livrosdesejados) VALUES (?, ?)';
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

    const sqlInsert = 'INSERT INTO livrosdisponiveis (titulo_livrosdisponiveis, autor_livrosdisponiveis) VALUES (?, ?)';
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

    const sqlUpdate = "UPDATE livrosdesejados SET titulo_livrosdesejados = ?, autor_livrosdesejados = ? WHERE id_livrosdesejados = ?";

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

    const sqlUpdate = "UPDATE livrosdisponiveis SET titulo_livrosdisponiveis = ?, autor_livrosdisponiveis = ? WHERE id_livrosdisponiveis = ?";

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

    const sqlDelete = "DELETE from livrosdesejados WHERE id_livrosdesejados = ?";

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

    const sqlDelete = "DELETE from livrosdisponiveis WHERE id_livrosdisponiveis = ?";

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
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    const sqlSelect = 'SELECT * FROM usuarios WHERE email_usuario = ?'
    con.query(sqlSelect, [email], (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length == 0) {
          const sqlInsert = 'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)';

          con.query(sqlInsert, [nome, email, senha], (err, response) => {
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

	con.query("SELECT * FROM usuarios WHERE email_usuario = ?", [email], (err, result) => {
        if (err) {
          res.send(err);
        }
        if (result.length > 0) {
            bcrypt.compare(senha, result[0].senha, (error, response) => {
            if (error) {
              res.send(error);
            }
            if (response == true) {
              console.log("Email ou senha incorreta");
              
            } else {
              console.log("Usuário logado com sucesso!")
            }
          });
        } else {
          res.send({ msg: "Usuário não registrado!" });
        }
      });
});

app.post("/insert/troca", (req, res) => {
    const {data, hora, local, livrodis, livrodes} = req.body;
    console.log(req.body);
    console.log(`Sua troca foi marcada para dia ${data}, às ${hora} horas em ${local}`);

    const trocaService = new Troca(con);

    trocaService.insertTroca({data, hora, local, livrodis, livrodes})
});

app.get("/list/troca", async (req, res) => {
    const trocaService = new Troca(con);

    const trocas = await trocaService.listTroca();

    res.json(trocas);
});

app.put("/edit/troca", (req, res) => {
    const { id } = req.body;
    const { data } = req.body;
    const { hora } = req.body;
    const { local } = req.body;
    const { livrodis } = req.body;
    const { livrodes } = req.body;

    const trocaService = new Troca(con);

    trocaService.editTroca({id, data, hora, local, livrodis, livrodes})
});

app.delete("/delete/troca/:id", (req,res) => {
    const { id } = req.params;

    const sqlDelete = "DELETE from troca WHERE id_troca = ?";

    con.query(sqlDelete, [id], (err, result) => {
        if(err) { 
            console.log("Troca deletada SEM SUCESSO");
            console.log(err);
        } else {
            console.log("Troca deletada COM SUCESSO");
            res.send(result);
        }
    });
});


//TWITTER POSTS

app.get("/feed", async (req, res, next) => {
    const page = req.query.page;
    const tweetSql = new TweetSql(14, con);

    const tweets = await tweetSql.getTweetsByData(page);

    res.send(tweets);
});

app.post("/tweet", async (req, res, next) => {
  const tweetSql = new TweetSql(14, con);
  const text = req.body.text;
  const files = req.files;

  if (files) {
    res.send(
      (await tweetSql.insertImageTweet(text, files.image)) || "Tweet criado"
    );
  } else {
    await tweetSql.insertSimpleTweet(text);
    res.send("Tweet criado");
  }
});

app.delete("/tweet", async (req, res, next) => {
    try {
        const tweetSql = new TweetSql(14, con);
        await tweetSql.deleteAllTweets();
        res.send("Tweets Deletados");
    } catch(err) {
        next(err);
    }
})

app.post("/upload-image", async (req, res, next) => {
  const image = req.files.image;

  if (image) {
    const result = await saveImage(image);
    if (result) {
      return next(result);
    }

    return res.json({
      erro: false,
      mensagem: "Upload realizado com sucesso!",
    });
  }

  return res.status(400).json({
    erro: true,
    mensagem:
      "Erro: Upload não realizado com sucesso, necessário enviar uma imagem png, jpg ou jpeg!",
  });
});


//axios
app.listen(port, (req, res) => {
    console.log(`Server is running in http://localhost:${port}`)
});