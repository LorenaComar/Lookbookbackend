require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get("/home", (req, res) => {
    res.send("Olá")
})

app.post("/", (req, res) => {
    res.send(req.body);
})

const port = process.env.PORT;

app.listen(port, (req, res) => {
    console.log(`Server is running in http://localhost:${
    port}`)
});
