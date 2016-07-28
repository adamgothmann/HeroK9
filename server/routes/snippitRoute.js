var express = require('express');
var path = require('path');
var pg = require('pg');

var connection = require('../modules/connection');
var router = express.Router();


router.get('/', function(req, res){

  console.log("In snippitRoute");

  pg.connect(connection, function (err, client, done) {

    var results = [];

    var query = client.query("SELECT * FROM users");

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){

      var inquiriesNew = 0;
      var inquiriesPending = 0;
      var inquiriesApproved = 0;
      var applicationsNew = 0;
      var applicationsPending = 0;
      var applicationsApproved = 0;

      for (var i=0; i<results.length; i++){
        if(results[i].status === 0){
          //New Inquiry
          inquiriesNew++;
        } else if (results[i].status === 1){
          //Pending Inquiry
          inquiriesPending++;
        } else if (results[i].status === 2){
          //Approved Inquiry
          inquiriesApproved++;
        } else if (results[i].status === 3){
          //New Application
          applicationsNew++;
        } else if (results[i].status === 4){
          //Pending Application
          applicationsPending++;
        } else if (results[i].status === 5){
          //Approved Application
          applicationsApproved++;
        }
      }

      var data = {
        inquiry: undefined,
        application: undefined
      };

      data.inquiry = {
        new: inquiriesNew,
        pending: inquiriesPending,
        approved: inquiriesApproved
      };

      data.application = {
        new: applicationsNew,
        pending: applicationsPending,
        approved: applicationsApproved
      };

      res.send(data);

    });

  });

});




module.exports = router;