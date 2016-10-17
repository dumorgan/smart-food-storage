//index js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');
const path = require('path');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/',require('./controllers/controller'));

app.use('/mcu',require('./controllers/mcu_controller'));

/*
app.use(function(req, res, next) {
  var err = new Error('not found');
  err.status = 404;
  next(err);
});
*/
app.listen(8080);

console.log("Server lifted on port 8080");
