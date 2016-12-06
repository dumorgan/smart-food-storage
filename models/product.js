
"use strict";

var connectionString = "postgres://morgan:7921@localhost:5432/pi_db";
var pg = require('pg');

var Product = class Product {

  constructor(name) {
    if (name) {
      this.name = name;
    }
  }

save(idUser, callback) {
    var name = this.name;

    console.log("Adding new product " + name + " to user " + idUser);

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({sucess: false, data: err});
      }
      var query = "INSERT INTO \"Products\" (name,\"idUser\") VALUES ($1,$2)";
      client.query(query,[name,idUser], function(err, result) {
        if (err) {
          callback(false)
        }
        else {
          done();
          callback(true)
        }
      });
    });
  }

  getId(idUser,callback) {
    var name = this.name;

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        callback(err);
      }
      client.query("SELECT \"idProduct\" FROM \"Products\" WHERE name=$1 AND \"idUser\"=$2",[name,idUser], function(err, result) {
        if (err) {
          console.log(err);
          callback(err);
        }
        else {
          callback(result.rows[0].idProduct);
        }
      });
    });
  }

  getAllFromUser(idUser, callback) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        callback(err);
      }
      else {
        client.query('SELECT SUM(m.amount) as "totalAmount", p.name as name, SUM(s."totalpurchased") as totalPurchased' +
                    'FROM "Products" p INNER JOIN "Shipments" s ON p."idProduct" = s."idProduct"' +
                    'INNER JOIN "Scales" sc ON s."idScale"=sc."idScale"' +
                    'INNER JOIN "Measures" m ON m."idScale"=sc."idScale"' +
                    'WHERE p."idUser" = $1' +
                    'group by p."idProduct"',[idUser], function(error, result) {
                      if (error) {
                        console.log(error);
                        callback(error);
                      }
                      else {
                        callback(result.rows);
                      }
                    });
      }
    });
  }
}

module.exports = Product;
