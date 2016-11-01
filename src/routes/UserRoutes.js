var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'./lib/logger.js'));
var nconf = require('nconf');
var mongoose = require('mongoose');
var User = require('../models').User;

router.get('/', function(req, res) {
	var firstName = req.query.firstName;
  	log.debug('Inside /user?firstName router. firstName:'+ firstName);

	console.log('firstName:'+firstName);

  	User.findOne({'firstName':firstName})
  		.populate('author')
		.exec(function (err, user) {
			if (err) return handleError(res, err.message,"Invalid user input", 400);
			res.status(200).json(user);
		});

  	log.debug('exiting from /user?firstName router');
});

router.post("/", function(req, res) {
  var userRequest = req.body;
 /* user.createDate = new Date();*/

 /* if (!(req.body.email)) return handleError(res, "Invalid user input", "Must provide an email.", 400);*/


  var user = new User(userRequest);
  user.save(function (err, results) {
  	console.log('Inside DB call');
	if (err){
		if(err.code=='11000')
			return handleError(res, err,  nconf.get('response.duplicateUsername'), "Failure: Duplicate Username.");
		else
			return handleError(res, err, null, "Failed to create new user.");
	} 
	res.status(201).json(results[0]);
  });

/*  DatabaseDriver.mongoDB.collection(USER_COLLECTION).insertOne(user, function(err, doc) {
  	console.log('Inside DB call');
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
      return;
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });*/
});

function handleError(res, err, responseCode, responseMessage, errorCode) {
  log.error("ERROR: " + err.code + ' || ' + err.message);
  res.status(errorCode || 500).json({"code":responseCode||errorCode || 500,"error": responseMessage});
}





module.exports = router;

