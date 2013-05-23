/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  //, routes = require('./routes')
  , Config = require('./config/config')
  , config = new Config()
  ;

var server = express.createServer();
server.use(express.bodyParser());

/**
 * Routes.
 */
server.post('/profile', function(req, res) {
  var password = req.body.password
  ,   username = req.body.username
  ,   options = { 
        username: username, 
        password: password, 
        response: res 
      }
  ,   db = require('./data/data')
  ,   bcrypt = require('bcrypt-nodejs')
  ;

  if (username && password) {
    //console.log(options);
    db.view('restaurant/profiles'
      , { "key": options.username }
      , function (nothing, response) {
          if (response && response[0] && response[0].value) {
            dbhash = response[0].value;
            if ( bcrypt.compareSync(options.password, dbhash) ) 
            {
              options.response.send({
                'access': 'granted',
                'username': options.username
              });
            } else {
              options.response.send({
                'access': 'denied',
                'reason': 'authentication failed',
                'username': options.username
              });
            } 
          } else {
            options.response.send({
              'access': 'denied',
              'reason': ' username not found',
              'username': options.username
            });
          }
      }
    );
  }
});

/**
 * Start server.
 */
server.listen(config.server.port);
console.log('Server started!');
console.log('listening on port ' + config.server.port);
if(!process.env.NODE_ENV) {
   process.env.NODE_ENV = "development";
}
console.log('deployed as : ' + process.env.NODE_ENV);
