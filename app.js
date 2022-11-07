require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fileUpload = require("express-fileupload");
const con = require("./config/sql");

const path = require("path");
const fs = require("fs");


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
    const {data, hora, local, livrodis, livrodes} = req.body;
    console.log(req.body);
    console.log(`Sua troca foi marcada para dia ${data}, às ${hora} horas em ${local}`);

    const sqlInsert = 'INSERT INTO troca (data_troca, hora_troca, local_troca, livrodis_troca, livrodes_troca) VALUES (?, ?, ?, ?, ?)';
    con.query(sqlInsert, [data, hora, local, livrodis, livrodes], (err, result) => {
        if (err) {
            console.log('Troca NÃO REALIZADA');
        }else{
            console.log('Troca REALIZADA');
        }
    })
});

app.get("/list/troca", (req, res) => {
    const sqlSelect = 'SELECT * FROM troca';
    
    con.query(sqlSelect, (err, result) => {
        if(err){
            console.log('Seleção das trocas realizada SEM SUCESSO')
        } else {
            console.log('Seleção das trocas realizada COM SUCESSO')
            res.send(result)
        }
    })
});

app.put("/edit/troca", (req, res) => {
    const { id } = req.body;
    const { data } = req.body;
    const { hora } = req.body;
    const { local } = req.body;
    const { livrodis } = req.body;
    const { livrodes } = req.body;

    const sqlUpdate = "UPDATE troca SET data_troca = ?, hora_troca = ?, local_troca = ?, livrodis_troca = ?, livrodes_troca = ? WHERE id_troca = ?";

    con.query(sqlUpdate, [data, hora, local, livrodis, livrodes, id], (err, result) => {
        if(err){
            console.log("Update da troca realizado SEM SUCESSO");
            console.log(err);
        }
        else{
            console.log("Update da troca realizado COM SUCESSO");
            res.send(result);
        }
    })
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






//Twitter sql
String.prototype.hashCode = function () {
    var hash = 0,
      i,
      chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  
  const verifyFileFormat = (mimetype) => {
    if (
      mimetype != "image/png" &&
      mimetype != "image/jpeg" &&
      mimetype != "image/jpg"
    ) {
      return {
        erro: true,
        mensagem: "Formato de arquivo inválido",
      };
    }
    return false;
  };
  
  module.exports = class TweetSql {
    constructor(userId) {
      this.userId = userId;
    }
  
    saveImage = async (image) => {
      const targetPath = path.join(
        __dirname,
        `../../../Lookbook/public/images/users/${this.userId}/`
      );
      if (!fs.existsSync(targetPath)) {
        await fs.mkdirSync(targetPath);
      }
      const imageExtension = image.mimetype;
      const extension = imageExtension.split("image/");
  
      const imageName = `${new Date().getTime()}_${image.name.hashCode()}.${
        extension[1]
      }`;
  
      await fs.writeFile(path.join(targetPath, imageName), image.data, (err) => {
        return err;
      });
      return imageName;
    };
  
    getTweetsByData = async (page) => {
      try {
        const sqlCommand = `SELECT * FROM publicacao ORDER BY data_publicacao DESC LIMIT 10 OFFSET ${
          page * 10
        }`;
  
        return new Promise((resolve, reject) => {
          con.query(sqlCommand, async (err, results, fields) => {
            if (err) {
              throw err;
            }
            if (results === undefined) {
              reject(new Error("Error rows is undefined"));
            } else {
              resolve(results);
            }
          });
        });
      } catch (error) {
        throw error;
      }
    };
  
    insertSimpleTweet = async (text) => {
      try {
        const sqlCommand = `INSERT INTO publicacao (texto_publicacao, data_publicacao, cod_usuario) VALUES (?, ?, ?)`;
  
        const values = [text, new Date(), this.userId];
  
        con.query(sqlCommand, values, (err, results) => {
          if (err) {
            throw err;
          }
          return results;
        });
      } catch (error) {
        throw error;
      }
    };
  
    insertImageTweet = async (text, image) => {
      try {
        const imagePath = await this.saveImage(image);
  
        const isNotImage = verifyFileFormat(image.mimetype);
  
        if (isNotImage) {
          return isNotImage;
        }
  
        const sqlCommand = `INSERT INTO publicacao (texto_publicacao, imagem_publicacao, data_publicacao, cod_usuario) VALUES (?, ?, ?, ?)`;
  
        const values = [text, imagePath, new Date(), this.userId];
  
        con.query(sqlCommand, values, (err, results) => {
          if (err) {
            throw err;
          }
          return results;
        });
      } catch (error) {
        throw error;
      }
    };
  };


//TWITTER POSTS

app.get("/feed", async (req, res, next) => {
    const page = req.query.page;
    const tweetSql = new TweetSql(14);

    const tweets = await tweetSql.getTweetsByData(page);

    res.send(tweets);
});

app.post("/tweet", async (req, res, next) => {
  const tweetSql = new TweetSql(14);
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