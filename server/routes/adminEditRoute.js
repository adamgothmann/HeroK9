var express = require('express');
var path = require('path');
var pg = require('pg');

var connection = require('../modules/connection');
var router = express.Router();

router.post('/', function(req, res){

  console.log("In adminEditRoute with:");
  console.log(req.body);
  res.sendStatus(200);

  // pg.connect(connection, function (err, client, done) {
  //
  // //Stuff here!
  //
  // });

});

module.exports = router;