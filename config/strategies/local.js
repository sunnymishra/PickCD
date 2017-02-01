'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'userName',
			passwordField: 'password'
		},
		function(userName, password, done) {
			User.findOne(
				{"profile.userName": userName}, 
				'+profile.password +profile.salt', 
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: 'Unknown user'
						});
					}
					if (!user.authenticate(password)) {
						return done(null, false, {
							message: 'Invalid password'
						});
					}
					user.profile.password=undefined;
					user.profile.salt=undefined;

					return done(null, user);
				}
			);
		}
	));
};