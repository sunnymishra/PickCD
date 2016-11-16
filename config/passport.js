'use strict';

var User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config');

module.exports = function(passport) {
	console.log('Inside passport.js config file');
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, {}, function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	//config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
	//	require(path.resolve(strategy))();
	//});
	require(path.resolve('./config/strategies'))();
};