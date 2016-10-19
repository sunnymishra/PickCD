var UserRepository = require('../database/UserRepository.js').UserRepository;
var DatabaseError = require('../exception/CustomException.js').CustomException.databaseError;
var Util = require('../util/util.js');
var Util = Util();
var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
var nconf = require('nconf');
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));

function AccountService() {};


AccountService.register = function(user, callback) {
	user.password=Util.encryptKey(user.password);
	//user.created_date=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	user.createdDate=new Date();
	user.active=true;

	log.debug('Registering ' + user.email);

	var registerCallback = function(error, obj) {
		if (error) {
			log.error('Error during DB access');
			log.error('typeof error %s',typeof error);
			if(error.code==='ER_DUP_ENTRY'){
				log.error('User email already exists. User can\'t  be registered.');
				error.code='DUPLICATE_EMAIL';
				callback({"success":false, "code": "DUPLICATE_EMAIL"});
			}
		  	callback(error); 
		} else {
	       callback(null, {"userId":obj.insertId});
	    }
	};
	// NOTE: Mail should be sent to user on successfull registration
	UserRepository.create(user, registerCallback);

	log.debug('Create command is sent. Exiting AccountService.register');
};

AccountService.isAccountExist = function(email, callback) {
	//user.created_date=dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	log.debug('isAccountExist for email: ' + email);

	var findByEmailCallback = function(error, isSuccess, userId) {
		if (error) {
			log.error('Error during DB access');
		  	callback(error); 
		} else {
			if(isSuccess)
	       		callback(null, {"email.exist":true, "userId":userId});
	       	else
	       		callback(null, {"email.exist":false, "description":"Email doesn't exist"});
	    }
	};

	UserRepository.findByEmail(email, findByEmailCallback);

	log.debug('isAccountExist command is sent to DAO. Exiting AccountService.isAccountExist');
};

// NOTE: forgotPassword and isAccountExist should be 1 router call 1 DAO call



AccountService.authenticate = function(user, callback) {
	log.debug('email:\'%s\',password:\'%s\'',user.email, user.password);
	user.password=Util.encryptKey(user.password);
	UserRepository.authenticate(user, function(err, isSuccess, result){
		if (err) {
			log.error('Error during DB access');
			callback(err);
		} else {
			if(isSuccess){
				// NOTE: Store user session in REDIS
				callback(null, {"success":true, "userId":result.userId,"email":result.email});
			}
	       	else
	       		callback({"success":false, "description":"Incorrect Email or Password"});
			
		}
	});
};

AccountService.forgotPassword = function(user, callback) {
	user.modifiedDate=new Date();
	var verificationCode = Util.verificationCode();
	user.forgotPasswordCode = Util.encryptKey(verificationCode);
	user.password=Util.encryptKey(user.newPassword);
	// TODO: Handle UserId not exist of UserId inactive scenario
	UserRepository.updatePassword({user:user, isForgotPassword:true}, function(err, result){
		if (err) {
			log.error('Error during DB access');
			callback(err);
		} else {
			// NOTE: Move this part outside in service/mail.js and use mail.json file also 
			var smtpTransport = nodemailer.createTransport("SMTP", {
			    host: "smtp.gmail.com", // hostname
			    secureConnection: true, // use SSL
			    port: 465, // port for secure SMTP
			    auth: {
			        user: "sunny.leotechno@gmail.com",
			        pass: "unknowns"
			    }
			});
			
			// NOTE: Mail sending should be async.Here it is synchronous
			smtpTransport.sendMail({
				from: 'sunny.leotechno@gmail.com',
				to: 'sunny.mishra0389@gmail.com',
				subject: 'Forgot password verification code',
				text: 'Please enter following verification code to activate your new app password:\n' + verificationCode
			}, function forgotPasswordResult(err) {
				if (err) {
					callback(err, false);
				} else {
					callback(null, true);
				}
			});
			;
		}
	});

};

AccountService.verifyForgotPasswordCode = function(user, callback) { 
	user.forgotPasswordCode=Util.encryptKey(user.forgotPasswordCode);
	UserRepository.verifyForgotPasswordCode(user, function(err, isSuccess){
		if (err) {
			log.error('Error during DB access');
			callback(err);
		} else {
			if(isSuccess){
				UserRepository.resetForgotPasswordCode(user.userId, function(err, result){
					if (err) {
						log.error('Error during DB access');
						callback(err);
					} else {
						callback(null, {"success":true});
					}
				});
			}
	       	else
	       		callback({"success":false, "description":"Incorrect Verification code"});
			
		}
	});
};



exports.AccountService = AccountService;
