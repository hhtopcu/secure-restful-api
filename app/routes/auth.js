var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var secret = require('../config/secret');

var User = require('../models/user');

var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';


    // If user or password, credentials error
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // First find the user
    User.findOne({username: req.body.username})
      .select('password').select('username')
      .exec(function (err, user) {
          if (err) { return next(err); }

          if (!user) { 
            res.status(401);
            res.json({
              "status": 401,
              "message": "Invalid credentials"
            });
            return; 
          }

          // Decrypt and compare the user password
          bcrypt.compare(password, user.password, function (err, valid) {
           
             if (err) { return next(err); }
             
             if (!valid) { 
                res.status(401);
                res.json({
                  "status": 401,
                  "message": "Invalid credentials"
                });
                return;
             }
             
             //var token = jwt.encode({username: user.username}, secret());
             var token = generateToken(user.username);

             res.status(200).send(token);
          });
      });

 
  },


  register: function(req, res){
    var username = req.body.username || '';
    var password = req.body.password || '';
    var role = req.body.role || '';

    var user = new User();

    user.username = username;
    user.role = role;
    

    bcrypt.hash(req.body.password, 10, function (err, hash) {
      user.password = hash;
      user.save(function(err,user) {

        if(err) { return(next(err)); }


        res.status(201).send();
        //res.json(user);

      });
     });

  },
 
  validateUser: function(username, callback) {

      process.nextTick(function(){
          User.findOne({username: username})
              .select('username')
              .exec(function (err, user) {

                  callback(err, user);
                  //if (err) { return null; }

                  //return user;
              });
      });


  },
};
 
// private method
function generateToken(username) {
  var expires = expiresIn(7); // 7 days

    // Put username into encoded string
  var token = jwt.encode({
    exp: expires,
    username: username
  }, secret());

  return {
    token: token,
    expires: expires,
    username: username
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;