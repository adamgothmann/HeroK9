var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

//serialize user
passport.serializeUser(function(user, done) {
  console.log('serializeUser');
    done(null, user.id);
});

passport.deserializeUser(function(err, id, passDone) {
  console.log('called deserializeUser');

  pg.connect(connection, function(err, client, pgDone) {
    //connection error
    if(err){
      pgDone();
      console.log(err);
      res.sendStatus(500);
    }

    client.query("SELECT * FROM users WHERE id = $1", [id], function(err, results) {

      pgDone();
      if(results.rows.length >= 1){
        console.log('in deserializeUser success');
        // console.log(results.rows[0]);
        return passDone(null, results.rows[0]);
      }

      // handle errors
      if(err){
        console.log(err);
      }

    });


  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, function(req, email, password, done){
	    pg.connect(connection, function (err, client) {
	    	console.log('called local - pg');
	    	var user = [];
        var query = client.query("SELECT * FROM users WHERE email = $1", [email]);

        query.on('row', function (row) {
        	console.log('User obj', row);
        	user.push(row);


          // Hash and compare


        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
          for(var i =0; i<user.length; i++){

            if(encryptLib.comparePassword(password, user[i].password)) {
              // all good!
              console.log('pass matched');
              done(null, user[i]);
              client.end();
            }
        }
          console.log("no user found");
          done(null, false, {message: 'Incorrect username or password'});
          client.end();
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
	    });
    }
));

module.exports = passport;
