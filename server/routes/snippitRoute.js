var express = require('express');
var path = require('path');
var pg = require('pg');

var connection = require('../modules/connection');
var router = express.Router();


router.get('/', function(req, res){

  console.log("In snippitRoute");

  pg.connect(connection, function (err, client, done) {

    var results = [];

    var query = client.query("SELECT * FROM users WHERE status_id != 99");

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){

      var messageResults = [];
      var messagesQuery = client.query("SELECT * FROM messages ORDER BY messagetime DESC");

      messagesQuery.on('row', function(row){
        messageResults.push(row);
      });

      messagesQuery.on('end', function(){

        done();

        var inquiriesNew = 0;
        var inquiriesPending = 0;
        var inquiriesApproved = 0;
        var applicationsNew = 0;
        var applicationsPending = 0;
        var applicationsApproved = 0;

        for (var i=0; i<results.length; i++){
          if(results[i].status_id === 1){
            //New Inquiry
            inquiriesNew++;
          } else if (results[i].status_id === 2){
            //Pending Inquiry
            inquiriesPending++;
          } else if (results[i].status_id === 3){
            //Approved Inquiry
            inquiriesApproved++;
          } else if (results[i].status_id === 4){
            //New Application
            applicationsNew++;
          } else if (results[i].status_id === 5){
            //Pending Application
            applicationsPending++;
          } else if (results[i].status_id === 6){
            //Application needs review
            applicationsPending++;
		}else if (results[i].status_id === 7 ){
			//Application Approved
			applicationsApproved++;
		}
        }

        var data = {
          inquiry: undefined,
          application: undefined,
          user: req.user.first_name,
          messages: messageResults
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

        // console.log("object to send, data ", data);
        // console.log(results);

        res.send(data);


      });
    });

  });

});

router.post('/newMessage', function(req, res){

  console.log("In newMessage with,", req.body);

  pg.connect(connection, function (err, client, done) {
    client.query('INSERT INTO messages (message, subject, username) VALUES ($1, $2, $3)', [req.body.message, req.body.subject, req.user.first_name + " " + req.user.last_name]);
    done();
    res.sendStatus(200);
  });
});

router.put('/deleteMessage', function(req, res){

  console.log('In deleteMessage with,', req.body);

  pg.connect(connection, function (err, client, done) {
    client.query('DELETE FROM messages WHERE id = ($1)', [req.body.id]);
    done();
    res.sendStatus(200);
  });

});





module.exports = router;
