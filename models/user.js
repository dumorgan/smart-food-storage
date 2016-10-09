"use strict";

const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const pg = require('pg');

var User = function(email,password) {
  this.email = email;
  this.password = password;
}

User.prototype.save = function(callback) {
  var email = this.email
  var password = this.password
  pg.connect(connectionString, function(err, client, done) {
    //Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess:false, data:err});
    }
    client.query("SELECT EXISTS(SELECT \"idUser\" FROM \"Users\" WHERE email=$1)",[email], function(err, result) {

      if (!result.rows[0].exists) {
        //SQL Query -> Insert user
        client.query("INSERT INTO \"Users\"(email,password) VALUES ($1,$2) RETURNING \"idUser\"",[email,password], function(err, result) {
          done();
          callback(true,result.rows[0].idUser);
        });
      }
      else {
        callback(false);
      }
    });
  });
};
/*
var User = class User {


  //var email;
  //var idUser;
  //var password;

  constructor(email,password) {
    this.email = email;
    this.password = password;
  }

  save() {
  }
}*/

module.exports = User;
