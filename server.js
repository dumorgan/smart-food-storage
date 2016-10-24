var port = process.env.PORT || 80;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');
const path = require('path');

//Middlewares for parsing the body of HTML requests
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Controller files that define application routes
app.use('/',require('./controllers/controller'));
app.use('/mcu',require('./controllers/mcu_controller'));

app.listen(port);

console.log("Server lifted on port " + port); 
