"use strict";
const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const pg = require('pg');

var Scale = class Scale {
  constructor(mac) {
    this.mac = mac;
  }

  createNew(idUser,callback) {
    var mac = this.mac;
    pg.connect(connectionString, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        callback({sucess:false, data:err});
      }
      client.query("INSERT INTO \"Scales\" (mac,\"idUser\",\"currentWeight\") SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT \"idScale\",\"idUser\",mac FROM \"Scales\" WHERE mac=$1) RETURNING \"idScale\"",
      [mac,idUser,0], function(err, result) {
        if (err) {
          done();
          console.log(err);
          callback(false);
        }
        //mac already EXISTS
        if (result.rowCount == 0) {
          callback(false)
        }
        //sucessfull addition
        else {
          callback(true,result.rows[0].idScale);
        }
      });
    });
  }

  findByMac(callback) {
    var mac = this.mac;
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err)
      }
      client.query("SELECT \"idScale\" FROM \"Scales\" WHERE mac=$1",[mac], function(err, result) {
        if (err) {
          done();
          console.log(err);
          callback(null);
        }
        callback(result.rows[0].idScale);
      });
    });
  }

  addMeasure(amount,timestamp,callback) {
    var amount = amount;
    var timestamp = timestamp;
    this.findByMac(function(idScale) {
      var idScale = idScale;
      pg.connect(connectionString, function(err, client, done) {
        if (err)  {
          done();
          console.log(err)
          callback({sucess:false,data:err})
        }
        console.log(idScale,amount,idScale);
        client.query("INSERT INTO \"Measures\" (\"idScale\",amount) VALUES ($1,$2,$3) RETURNING \"idMeasure\"",[idScale,amount], function(err, result) {
          if(err) {
            done();
            console.log(err);
            callback(false);
          }
          callback(true,result.rows[0].idMeasure)
        })
      });
    });
  }
/*
  setWeight(timestamp,weight,callback) {
    var mac = this.mac;
    pg.connect(connectionString, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        callback({sucess:false, data:err});
      }
      var sql = "INSERT INTO \"Scales\""
    )};
  }
*/
}

module.exports = Scale;
