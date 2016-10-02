require('./../routes/database.js');

var User = exports;

User.save = function(req, callback) {
    console.log('saving the new User');
    var email = req.body.email;
    var password = req.body.password;

    //User.facebook.id    = profile.id; // set the users facebook id
    //var token = token; // we will save the token that facebook provides to the user
    //User.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
    //var email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first


    console.log( email, password);

    var local = 'local';

    var sql = 'INSERT INTO \"Users\"(email, password) VALUES ($1, $2) RETURNING \"idUser\"';
    var data = [
        req.body.email,
        req.body.password,
    ];

    pg.connect(connectionString, function(err, client, done) {
      //Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({sucess:false, data:err});
      }

      client.query(sql,data, function(err, result) {
        if (err) {
            console.error('error in adding new user', err);
        }

        //consoles the id number we are at
        console.log('Insert result:', result.rows);
        console.log(User);

        console.log("checked", data);
        //req.User = results.rows[0];

        //next();
        var userData= {
            id: result.rows[0].idUser
        };
        callback(userData);
        });
      });
}


User.findById = function(id, callback) {
  console.log('finding the user to deserialize');

  var sql = 'SELECT * FROM \"Users\" WHERE \"idUser\" = $1';
  var data = [
     id
  ];

  pg.connect(connectionString, function(err, client, done) {

    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess:false, data:err});
    }
    console.log(data);
    client.query(sql, data, function (err, result) {
        if (err) {
            console.error(err);
        }
        console.log(id + ' is found to be deserialized');
        var user = {
            id: result.rows[0].idUser,
            email: result.rows[0].email,
            password: result.rows[0].password
        };
        console.log(user);
        callback(false, user);
    });
  });
};

User.findOne = function(email, callback) {
  var isNotAvailable = false;

  console.log(email + ' is in the findOne function test');

  var sql = 'SELECT * FROM \"Users\" WHERE email = $1';
  var data = [email];

  console.log(data);

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess:false, data:err});
    }
    console.log(data);
    client.query(sql, data, function(err, result) {
      if (err) {
        console.error(err);
        return callback(err,isNotAvailable,this);
      }
      if (result.rows.length > 0) {
        isNotAvailable = true;
        console.log(email + ' is already in use');
      }
      else {
        isNotAvailable = false;
        console.log(email + ' is available');
      }
      return callback(false,isNotAvailable,this);
    });
  });
}
