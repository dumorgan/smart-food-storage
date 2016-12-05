"use strict";

var connectionString = "postgres://morgan:7921@localhost:5432/pi_db";
var pg = require('pg');

var randomString = require('randomstring');

var cryptoJS = require('crypto-js');

//var randomString = require('randomstring');

var User = class User {
  //var email;
  //var idUser;
  //var password;

  /**
  * User constructor
  * can receive one (idUser) or two (email and password) parameters
  */
  constructor(identifier,password) {
    if (password != undefined) {
      this.email = identifier;
      this.password = password;
    }
    else {
      this.idUser = identifier;
    }
  }

  encryptPassword() {
    return cryptoJS.SHA3(this.password).toString();
  }

  /**
  * Authentication function
  * params: authToken -> a 12 character string used as an authentication token
  * callback: this variable is used for returning true/false whether the authentication is successful
  */
  authenticate(authToken, callback) {
    var idUser = this.idUser;

    pg.connect(connectionString, function(err, client,done) {
      if (err) {
        done();
        console.log(err);
        callback({success:false, data:err});
      }

      client.query("SELECT token FROM \"Authentication\" WHERE \"idUser\" = $1",[idUser], function(err, result) {
        if (result.rows[0].token != authToken) {
          callback(false);
        }
        else {
          callback(true);
        }
      });
    });
  }

  /*
  * This function is used for saving the user into the db, returns the user's id and an authToken
  */
  save(callback) {
    var email = this.email;
    var password = this.encryptPassword();

    pg.connect(connectionString, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        callback({success:false, data:err});
      }
      client.query("SELECT EXISTS(SELECT \"idUser\" FROM \"Users\" WHERE email=$1)",[email], function(err, result) {

        if (!result.rows[0].exists) {
          //SQL Query -> Insert user
          client.query("INSERT INTO \"Users\"(email,password) VALUES ($1,$2) RETURNING \"idUser\"",[email,password], function(err, result) {
            var idUser = result.rows[0].idUser;
/*
            var token_val = randomString.generate({
              length: 12;
            });
            */
            var token = randomString.generate(12);
            client.query("INSERT INTO \"Authentication\" (\"idUser\",token) VALUES ($1,$2)",[idUser,token], function(err, result) {
              if (err) {
                callback(false);
              }
            });
            done();
            callback(true,idUser,token);
          });
        }
        else {
          callback(false);
        }
      });
    });
  }

  login(callback) {
    var email = this.email;
    var triedPassword = this.encryptPassword();

    pg.connect(connectionString, function(err, client, done)  {
      if (err) {
        done();
        console.log(err);
        callback({success:false, data:err});
      }

      client.query("SELECT \"password\",\"idUser\" FROM \"Users\" WHERE email=$1",[email], function(err, result) {
        if (result.rows[0] == undefined) {
          callback(false);
        }
        else if (result.rows[0].password != triedPassword) {
          callback(false);
        }
        else {
          var idUser = result.rows[0].idUser;
          client.query("SELECT \"token\" FROM \"Authentication\" WHERE \"idUser\"=$1",[idUser],function(err, result) {
            if (err) {
              console.log(err);
              done();
            }
            var authToken = result.rows[0].token;
            callback(true,idUser,authToken);
          });
        }
      });
    });
  }

  getProducts(callback) {
    var idUser = this.idUser;
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        callback({success:false, data:err});
      }
      else {
        client.query('SELECT "idProduct" FROM "Products" WHERE "idUser" = $1', [idUser], function(err, result) {
          if (err) {
            console.log(err);
            done();
          }
          else {
            var productList = [];
            result.rows.forEach(product => {
              console.log("Product id: " + product.idProduct);
              var idProduct = product.idProduct;
              client.query('SELECT sum(amount) FROM "Measures" WHERE (timestamp,"idScale") IN(' +
                            'SELECT max(timestamp),s."idScale" FROM ' +
                            '"Measures" m INNER JOIN "Scales" s ON m."idScale" = s."idScale" '+
                            'WHERE s."idScale" IN (' +
                            'SELECT s."idScale" FROM "Products" p ' +
                            'INNER JOIN "Shipments" sh ON p."idProduct" = sh."idProduct" ' +
                            'INNER JOIN "Scales" s ON sh."idScale" = s."idScale" ' +
                            'WHERE p."idProduct" = $1) ' +
                            'GROUP BY s."idScale")',[idProduct], function(err, result) {
                              if (err) {
                                console.log(err);
                                callback({error: err});
                              }
                              else {
                                console.log(result.rows[0]);
                                productList.push({idProduct: idProduct, amount: result.rows[0]})
                              }
                            });
            });
            callback(false,productList);
          }
        })
      }
    });
  }
}

module.exports = User;
