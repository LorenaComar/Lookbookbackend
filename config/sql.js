const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if(err){
        console.log('Erro conectando ao banco de dados...', err)
        return
    }
    console.log('Conexão estabelecida!')
});

module.exports = connection;