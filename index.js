var tokenDB = new Map()
    // require("./upload.js")()
const express = require("express");
const Cookies = require('cookies')
const favicon = require('serve-favicon');
const bodyParser = require('body-parser')

const path = require("path")
const fs = require('fs');

const app = express()
app.listen(3000, () => console.log("ready"))
app.use('/', require('./routers/.js')(tokenDB));
app.use('/m', require('./routers/m.js')(tokenDB));
app.use('/upload', require('./routers/upload.js')(tokenDB));
app.use('/OAuth', require('./routers/OAuth.js')(tokenDB));
app.use(favicon(__dirname + '/Client/assets/favicon.ico'));
app.use(express.static(__dirname + '/Client/'));
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(__dirname, "./Client/404.html"))
});