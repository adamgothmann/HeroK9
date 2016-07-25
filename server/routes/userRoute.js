var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require('../modules/connection');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
    // check if logged in
    if(req.isAuthenticated()) {
        // send back user object from database
        res.send(req.user);
        // res.sendFile(path.resolve('public/views/success.html'));
    } else {
        // failure best handled on the server. do redirect here.
        res.sendStatus(403);
    }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.redirect('/');
});

module.exports = router;
