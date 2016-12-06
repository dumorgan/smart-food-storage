"use strict";
var connectionString = "postgres://morgan:7921@localhost:5432/pi_db";
var pg = require('pg');

var Scale = class Scale {

  constructor(mac) {
    if (mac != undefined) {
      this.mac = mac;
    }
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
        client.query("INSERT INTO \"Measures\" (\"idScale\",amount,timestamp) VALUES ($1,$2,$3) RETURNING \"idMeasure\"",[idScale,amount,timestamp], function(err, result) {
          if(err) {
            done();
            console.log(err);
            callback(false,err);
          }
          else {
            callback(true,result.rows[0].idMeasure);
          }
        });
      });
    });
  }

  getByUser(idUser, callback) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err)
      }

      client.query("SELECT \"idScale\",mac FROM \"Scales\" WHERE \"idUser\"=$1",[idUser],function(err, result) {
        if (err) {
          done();
          console.log(err);
          callback(false);
        }
        var scales = []
        for (var i = 0; i < result.rows.length; i++) {
          scales.push({"idUser":result.rows[i].idScale,"mac":result.rows[i].mac});
        }
        callback(scales);
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
