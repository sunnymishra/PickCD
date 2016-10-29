var express = require('express');
var router = express.Router();
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'./lib/logger.js'));
var GoalService = require('../service/GoalService.js').GoalService;
var DatabaseDriver = require('../util/databaseDriver.js').DatabaseDriver;

var USER_COLLECTION = 'user';

router.get('/', function(req, res) {
	var userNumber = req.query.userId;
  	log.debug('Inside /user?userId router. userId:'+ userNumber);

	console.log('userId:'+userNumber);

    var routerCallback = function(err, docs) {
	    if (err) {
	      res.status(400).send(err.message);
	    } else {
	      res.status(200).json(docs);
	    }
  	};

  	DatabaseDriver.db.collection(USER_COLLECTION).find({"userId":parseInt(userNumber)}).toArray(routerCallback);

  	log.debug('exiting from /user?userId router');
});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}



module.exports = router;

