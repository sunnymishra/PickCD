var connectionPool = require('../util/databaseDriver.js').DatabaseDriver.connectionPool;
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));

UserRepository = function() {
};

UserRepository.find = function(id, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.debug('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }   

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT userId, displayName, email, aboutMe, silverCoins, goldCoins from F_User Where userId = ? and active = ? ", [id, 1], function(err, rows, fields){
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

UserRepository.create = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
        if (err) {
        	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
        	callback(err);
        }

        log.debug('connected as id ' + connection.threadId);
        
        connection.query('Insert into F_USER SET ?', user, function(err, result){
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


UserRepository.findByEmail = function(email, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT userId from F_USER Where email = ? and active = ? ", [email, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
					log.debug('Email matched !');
					callback(null, true, rows[0].userId);
				}else{
					callback(null, false);
					log.warn('Email didn\'t match !');
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

UserRepository.authenticate = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT * from F_USER Where email = ? and password = ? and active = ? ", [user.email, user.password, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
					log.debug('Authentication success !');
					callback(null, true, rows[0]);
				}else{
					callback(null, false);
					log.warn('Wrong email or password or active=false !');
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

UserRepository.updatePassword = function(obj, callback) {
	connectionPool.getConnection(function(err,connection){
        if (err) {
        	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
        	callback(err);
        }

        log.debug('connected as id ' + connection.threadId);
        
        var sql;
        var inputArray;
        if(obj.isForgotPassword){
        	// This is the Forgot Password scenario
        	log.debug('This is Forgot password scenario in DAO');
        	sql='Update F_USER SET password = ?, modifiedDate = ?, forgotPasswordCode = ?, isPasswordVerified = 0 where userId = ?';
        	inputArray=[obj.user.password, obj.user.modifiedDate, obj.user.forgotPasswordCode, obj.user.userId];
        }
        else{
        	// This is the Change Password scenario
        	log.debug('This is Change password scenario in DAO');
        	sql='Update F_USER SET password = ?, modifiedDate = ? where userId = ?';
        	inputArray=[obj.user.password, obj.user.modifiedDate, obj.user.userId];
    	}
        connection.query(sql, inputArray, function(err, result){
            connection.release();
            if(!err) {
            	log.debug('result.updatedRecords:', result.affectedRows);
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

UserRepository.verifyForgotPasswordCode = function(user, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query("SELECT 1 from F_USER Where userId = ? and forgotPasswordCode = ? and active = ? ", [user.userId, user.forgotPasswordCode, 1], function(err, rows, fields){
	        connection.release();
	        if(!err) {
	        	if(typeof rows !== 'undefined' && rows.length > 0){
					log.debug('forgotPasswordCode verification success !');
					callback(null, true);
				}else{
					callback(null, false);
					log.warn('Wrong userId or forgotPasswordCode or active=false !');
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


UserRepository.resetForgotPasswordCode = function(userId, callback) {
	connectionPool.getConnection(function(err,connection){
	    if (err) {
	    	log.error('database connectivity error'+ err);
	      	if(connection) connection.release();
	      	callback(err);
	    }

	    log.debug('connected as id ' + connection.threadId);
	    
	    connection.query('Update F_USER SET isPasswordVerified = 1, forgotPasswordCode = NULL where userId = ?', [userId], function(err, result){
            connection.release();
            if(!err) {
            	log.debug('result.updatedRecords:', result.affectedRows);
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



exports.UserRepository = UserRepository;
