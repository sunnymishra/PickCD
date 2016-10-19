var connectionPool = require('../util/databaseDriver.js').DatabaseDriver.connectionPool;
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));
var nconf = require('nconf');

GoalRepository = function() {
};

GoalRepository.fetchMyGoalList = function(userId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.*, ug.userGoalId, ug.goalStartDate, ug.goalEndDate, ug.goalProgressPercent, ug.isGoalAchieved "+
	    	"from F_GOAL AS g "+
	    	"INNER JOIN F_USER_GOAL AS ug ON g.goalId=ug.goalId "+
	    	"where ug.userId = ? AND g.active = ? AND ug.statusType IN (?) ";
		
		var goalConnectionStatus = [nconf.get('goalStatusPendingAcceptance'), nconf.get('goalStatusPendingApproval'), nconf.get('goalStatusConfirmed')];
	    connection.query(sql, [userId, userId, goalConnectionStatus], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchTaglist = function(callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT tagId, tagName from F_TAG "+
	    	"where active = ? ";
	    connection.query(sql, [1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


GoalRepository.createGoal = function(goal, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    log.debug('Inserting goal: ' + JSON.stringify(goal));
	    connection.query('Insert into F_GOAL SET ?', goal, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null, result);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
        });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.createUserGoalMap = function(goalDetails, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Insert into F_USER_GOAL SET ?', goalDetails, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null, result);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
        });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.createGoalLog = function(goalLogDetails, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Insert into F_GOAL_LOG SET ?', goalLogDetails, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('Last insert record:', result);
	            callback(null);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
        });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.find = function(goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Select * from F_GOAL where goalId=? and active=?', [goalId, 1], function(err, rows){
            connection.release();
            if(!err) {
	        	log.debug('Fetched result:', rows[0]);
	            callback(null, rows[0]);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
        });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.updateGoalProgressPercent = function(obj, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 'Update F_USER_GOAL SET goalProgressPercent = ?, modifiedDate = ? where userGoalId = ?';
	    connection.query(sql, [obj.goalProgressPercent, obj.modifiedDate, obj.userGoalId], function(err, result){
	        connection.release();
	        if(!err) {
	        	log.debug('result.updatedRecords: %s', result.affectedRows);
	            callback(null, result);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


GoalRepository.fetchGoalWithUserGoalId = function(userGoalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.goalId, g.tagId, g.goalTypeId, g.goalName, g.goalDescription, g.goalTargetValue, g.goalUnit, "+
			"ug.userGoalId, ug.goalProgressPercent, ug.goalStartDate, ug.goalEndDate, ug.isGoalAchieved "+
			"from F_GOAL g JOIN F_USER_GOAL ug ON g.goalId=ug.goalId "+
	    	"where ug.userGoalId=? and g.active = ? ";

	    connection.query(sql, [userGoalId, 1], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows[0]);
		            callback(null, true, rows[0]);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist !', userGoalId);
				}
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchMemberUserGoal = function(userId, goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.goalId, g.tagId, g.goalTypeId, g.goalName, g.goalDescription, g.goalTargetValue, g.goalUnit, "+
			"ug.userGoalId, ug.goalProgressPercent, ug.goalStartDate, ug.goalEndDate, ug.isGoalAchieved "+
			"from F_GOAL g JOIN F_USER_GOAL ug ON g.goalId=ug.goalId "+
	    	"where ug.userId=? and ug.goalId=? and ug.statusType IN (?) and g.active = ? ";

	    var goalConnectionStatus = [nconf.get('goalStatusPendingAcceptance'), nconf.get('goalStatusPendingApproval'), nconf.get('goalStatusConfirmed')];
	    connection.query(sql, [userId, goalId, goalConnectionStatus, 1], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows[0]);
		            callback(null, true, rows[0]);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist !', userGoalId);
				}
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchGoalLog = function(userGoalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT logValue, logUnit, logNotes, logDate "+
			"from F_GOAL_LOG where userGoalId=? ";
	    connection.query(sql, [userGoalId], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows);
		            callback(null, true, rows);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist in F_GOAL_LOG table !', userGoalId);
				}
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


GoalRepository.updateGoalLog = function(obj, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 'Update F_GOAL_LOG SET logValue = ?, logNotes = ? where goaLogId = ?';
	    connection.query(sql, [obj.logValue, obj.logNotes, obj.goaLogId], function(err, result){
	        connection.release();
	        if(!err) {
	        	log.debug('result.updatedRecords: %s', result.affectedRows);
	            callback(null, result);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


GoalRepository.fetchGoalList = function(tagId, goalTypeId, userId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"SELECT g.goalId, g.tagId, g.goalTypeId, g.goalName, g.goalDescription "+
			"from f_goal g  "+
			"left outer join f_user_goal ug on g.goalId=ug.goalId and ug.userId=? and ug.active=? "+
			"where ug.goalId is NULL "+
			"and g.tagId = ? AND g.goalTypeId = ? AND g.active = ? AND g.isPrivateGoal = ? ";
			// The Left outer join is done to remove any Goals of this User showing up in result
	    connection.query(sql, [userId, 1, tagId, goalTypeId, 1, 0], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchMyGoalMemberList = function(goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"select u.userId, u.displayName, ug.statusType "+
	    	"from f_user_goal ug join f_user u on ug.userId=u.userId "+
			"where goalId=? and ug.statusType IN (?) "+
			"order by ug.statusType ";
		
		var goalConnectionStatus = [nconf.get('goalStatusPendingAcceptance'), nconf.get('goalStatusPendingApproval'), nconf.get('goalStatusConfirmed')];
	    connection.query(sql, [goalId, goalConnectionStatus], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};


GoalRepository.fetchUserGoalList = function(friendUserId, loggedInUserId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"select ug1.goalId, ug1.userGoalId, goalName, g.tagId, tagName  , tempTable.goalId as commonGoal "+
			"from f_goal g "+
			"Join f_tag t on g.tagId=t.tagId "+
			"Join f_user_Goal ug1 on ug1.goalId=g.goalId "+
			"left outer join "+
			"(select goalId from f_user_goal ug2 where ug2.userId=? and ug2.statusType IN (?)) tempTable on tempTable.goalId=ug1.goalId "+
			"where  ug1.userId=?  and ug1.statusType IN (?) and g.active=? ";
			//"order by ug1.statusType ";

		var goalConnectionStatus = [nconf.get('goalStatusConfirmed')];
	    connection.query(sql, [loggedInUserId, goalConnectionStatus, friendUserId, goalConnectionStatus, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchGoalDetails = function(goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 	
	    	'Select g.goalId, g.goalName, g.goalDescription, g.goalTypeId, gt.goalTypeName, g.tagId, t.tagName  from F_GOAL g '+
			'inner join F_GOAL_TYPE gt on g.goalTypeId=gt.goalTypeId '+
			'inner join F_TAG t on g.tagId=t.tagId '+
			'where g.goalId=? and g.active=? ';
	    connection.query(sql, [goalId, 1], function(err, rows){
            connection.release();
            if(!err) {
	        	log.debug('Fetched result:', rows[0]);
	            callback(null, rows[0]);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
        });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchGoalMemberList = function(goalId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"select ug.userId, displayName, goldCoins, silverCoins, ug.isGoalAchieved "+
			"from F_USER u join F_USER_GOAL ug on u.userId=ug.userId "+
			"where goalId=? and ug.active=? and u.active=? ";

	    connection.query(sql, [goalId, 1, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	log.debug('Fetched result:', rows);
	            callback(null, rows);
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};

GoalRepository.fetchNonMemberGoalList = function(userId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    var sql = 
	    	"select ug.goalId, ug.userGoalId, goalName, g.tagId, tagName, ug.isGoalAchieved, ug.statusType "+
			"from f_goal g "+
			"Join f_tag t on g.tagId=t.tagId "+
			"Join f_user_Goal ug on ug.goalId=g.goalId "+
			"where ug.userId=? and ug.statusType IN (?) and g.active=? "+
			"order ug.statusType ";
		var goalConnectionStatus = [nconf.get('goalStatusPendingAcceptance'), nconf.get('goalStatusPendingApproval'), nconf.get('goalStatusConfirmed')];
	    connection.query(sql, [userId, goalConnectionStatus, 1], function(err, rows){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
		        	log.debug('Fetched result:', rows);
		            callback(null, true, rows);
		        }else{
					callback(null, false);
					log.warn('userGoalId %s doesn\'t exist !', userGoalId);
				}
	        } else{
	        	log.error('Error while performing Query. '+ err);  
	        	callback(err);
	    	}
	    });

	    connection.on('error', function(err) {
	          log.error('Error in connection database. '+ err); 
	          if(connection) connection.release();
	          callback(err);
	    });
	});
};



exports.GoalRepository = GoalRepository;
