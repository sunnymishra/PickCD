'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	log = require('../../config/logger');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	log.error(err);
	return message;
};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.profile.provider = 'local';
	user.profile.contacts.isEmailVerified = false;
	user.profile.contacts.isMobileVerified = false;
	user.hashSaltPassword();
	// Then save the user 
	user.save(function(err) {
		if (err) {
			res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.status(200).send({
				message: 'User registration success'
			});
		}
	});
};

/**
 * Passport local authentication & Signin
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			console.log('passport authentication failed');
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			//user.profile.password = undefined;
			//user.profile.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	// Else hackers can add themselves as ADMIN role user
	delete req.body.roles;
	if (user) {
		// Merge existing user
		var newUser = req.body;
		if(newUser.profile){
			delete newUser.profile.userName;
			delete newUser.profile.password;
			delete newUser.profile.salt;
			if(newUser.profile.contacts){
				// Ensuring isMobileVerified is not changed in this API
				var mobileObj = newUser.profile.contacts.mobile;
				if(mobileObj && mobileObj.mCountryCode && mobileObj.mNumber){
					if(mobileObj.mCountryCode===user.profile.contacts.mobile.mCountryCode
						&& mobileObj.mNumber===user.profile.contacts.mobile.mNumber){
						delete newUser.profile.contacts.mobile;
						delete newUser.profile.contacts.isMobileVerified;
					}else{
						newUser.profile.contacts.isMobileVerified=false;
					}
				}else{
					delete newUser.profile.contacts.isMobileVerified; 
				}
				// Ensuring isEmailVerified is not changed in this API
				if(newUser.profile.contacts.email && newUser.profile.contacts.email!==user.profile.contacts.email){
					newUser.profile.contacts.isEmailVerified=false;
				}else{
					delete newUser.profile.contacts.isEmailVerified; 
				}
			}
			// Lodash merge() will merges Src and Dest Object inside Parent Object
			user.profile = _.merge(user.profile, newUser.profile);
		} else if(newUser.customer){
			// Lodash extend() will not merge child Src Object and child Dest Object inside Parent Object
			user.customer = _.extend(user.customer, newUser.customer);
		} else if(newUser.carrier){
			// Lodash extend() will not merge child Src Object and child Dest Object inside Parent Object
			user.carrier = _.extend(user.carrier, newUser.carrier);
		}

		user.updated = Date.now();
		// TODO: We should use user.update() here to save heavy save operation and avoid running into concurrency issues
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				//user.profile.password = undefined;
				//user.profile.salt = undefined;
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	if (req.user) {
		User.findById(req.user.id, '+profile.password +profile.salt', function(err, user) {
			if (!err && user) {
				if (user.authenticate(passwordDetails.currentPassword)) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.profile.password = passwordDetails.newPassword;
						user.hashSaltPassword();
						// TODO: We should use user.update() here to save heavy save operation and avoid running into concurrency issues
						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									// TODO: Check if we need to remove salt and password from Password set User object
									// Make a call to /users/me to find out if 2 values are exposed?
									if (err) {
										res.status(400).send(err);
									} else {
										res.send({
											message: 'Password changed successfully'
										});
									}
								});
							}
						});
					} else {
						res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					res.status(400).send({
						message: 'Current password is incorrect'
					});
				}
			} else {
				res.status(400).send({
					message: 'User is not found'
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
	if(req.user){
		//req.user.profile.password = undefined;
		//req.user.profile.salt = undefined;
		res.jsonp(req.user || null);
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
	//res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(401).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};