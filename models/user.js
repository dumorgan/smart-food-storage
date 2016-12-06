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
        client.query('SELECT "idProduct" FROM "Products" WHERE "idUser" = $1 ORDER BY "idProduct"', [idUser], function(err, result) {
          if (err) {
            console.log(err);
            done();
          }
          else {
            var productList = [];
            var ids = result.rows[0].idProduct;
            var pIds = [];
            pIds.push(result.rows[0].idProduct);
            for (var i = 1; i < result.rows.length; i++) {
              ids = ids + ',' + result.rows[i].idProduct;
              pIds.push(result.rows[i].idProduct);
            }
        //    var product = result.rows[i];
      //      console.log("Product id: " + product.idProduct);
            var idProduct = product.idProduct;
            client.query('SELECT sum(amount)/sum(totalpurchased) as ratio '+
                          'FROM "Measures" m ' +
                          'INNER JOIN "Shipments" s ON m."idScale"=s."idScale" WHERE (timestamp,m."idScale") IN(' +
                          'SELECT max(timestamp),s."idScale" FROM ' +
                          '"Measures" m INNER JOIN "Scales" s ON m."idScale" = s."idScale" '+
                          'WHERE s."idScale" IN (' +
                          'SELECT s."idScale" FROM "Products" p ' +
                          'INNER JOIN "Shipments" sh ON p."idProduct" = sh."idProduct" ' +
                          'INNER JOIN "Scales" s ON sh."idScale" = s."idScale" ' +
                          'WHERE p."idProduct" IN (' + ids + ') ORDER BY "p.idProduct") ' +
                          'GROUP BY s."idScale")', function(err, result) {
                            if (err) {
                              console.log(err);
                              callback({error: err});
                            }
                            else {
                              for (var j = 0; j < result.rows.length; j++) {
                                var ratio = result.rows[j].ratio;
                                var indicator;
                                if (ratio >= 0.8) {
                                  indicator = 5;
                                }
                                else if (ratio < 0.8 && ratio >= 0.6) {
                                  indicator = 4;
                                }
                                else if (ratio < 0.6 && ratio >= 0.4) {
                                  indicator = 3
                                }
                                else if (ratio < 0.4 && ratio >= 0.2) {
                                  indicator = 2
                                }
                                else {
                                  indicator = 1
                                }
                                productList.push({idProduct: pIds[j], indicator: indicator});
                              }
                              callback(false,productList)
                            }
                        });
          }
        });
      }
    });
  }
}

module.exports = User;
