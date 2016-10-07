class User {

  var email;
  var idUser;
  var password;

  constructor(email,password) {
    this.email = email;
    this.password = password;
  }

  save(email,password) {
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
            return res.json({'success':true});
          });
        }
        else {
          return res.json({'sucess':false,'exists':true});
        }
      });
    });
  }
}
