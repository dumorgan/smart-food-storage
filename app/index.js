const express = require('express')
const app = express()

'use strict'

const pg = require('pg')
const conString = 'postgres://postgres:7921@localhost/pi_db' // make sure to match your own database's credentials

app.post('/users', function (req, res, next) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      return next(err)
    }
    client.query('INSERT INTO user (username,email,password) VALUES ($1,$2,$3);', [user.username,user.email,user.password], function (err, result) {
      done()

      if (err) {
        return next(err)
      }
      res.send(200)
    })
  })
})

app.listen(3000)
