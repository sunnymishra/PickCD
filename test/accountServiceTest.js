var should = require('should'); 
//var assert = require('assert');
var request = require('request');
//var mongoose = require('mongoose');
//var winston = require('winston');
//var config = require('./config-debug');
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../../../lib/logger.js'));

describe('Routing', function() {
  var url = 'http://localhost:3000/focusroot/webservice/account';
  before(function(done) {
  	log.debug('inside before hook of mocha routes.js');
    // In our tests we use the test db
    //mongoose.connect(config.db.mongodb);                            
    done();
  });

  describe('Account', function() {
    it('should return error trying to register duplicate username/email', function(done) {
    	var account = {
	        userName:'sunny@sunny.com',
	        phone:'9999999',
	        email: 'sunny@sunny.com',
	        password: 'sunny'
		};
	    request({
		    method: 'POST',
		    url: url+'/register', //URL to hit
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify(account)
		}, function(err, response, body){
		    if (err) {
		    	console.log(err);
	            throw err;
	          }
	          // this is should.js syntax, very clear
	          //console.log(response.statusCode, body);
	          response.statusCode.should.equal(409);
	          var resBody = JSON.parse(response.body);
	          resBody.should.not.have.property("userId");
	          done();
		});
	});

	it('should allow login with correct username/password', function(done) {
    	var account = {
	        email: 'sunny@sunny.com',
	        password: 'sunny'
		};
	    request({
		    method: 'POST',
		    url: url+'/login', //URL to hit
		    headers: {'Content-Type': 'application/json'},
		    body: JSON.stringify(account)
		}, function(err, response, body){
		    if (err) {
		    	console.log(err);
	            throw err;
	          } 
	          // this is should.js syntax, very clear
	          //console.log(response.statusCode, body);
	          response.statusCode.should.equal(200);
	          done();
		});
	});

    it('should succeed if email exists', function(done) {
	    request({
	    	method: 'GET',
		    url: url+'/isAccountExist', //URL to hit
		    qs: {email: 'sunny@sunny.com'} //Query string data
		}, function(err, response, body){
		    if (err) {
		    	console.log(err);
	            throw err;
	          }

	          response.statusCode.should.equal(200);
	          var resBody = JSON.parse(response.body);
	          resBody['email.exist'].should.equal(true);
	          resBody.should.have.property("userId");
	          done();
		});
    });

    it('should succeed if invalid email is \'Not found\'', function(done) {
	    request({
	    	method: 'GET',
		    url: url+'/isAccountExist', //URL to hit
		    qs: {email: '1111sunny@sunny.com'} //Query string data
		}, function(err, response, body){
		    if (err) {
		    	console.log(err);
	            throw err;
	          }
	          response.statusCode.should.equal(200);
	          
	          response.body.should.be.json;
	          var resBody = JSON.parse(response.body);
	          log.debug('test response body: %s \nresBody[\'email.exist\']: %s', response.body, resBody['email.exist']);
	          resBody['email.exist'].should.equal(false);
	          //response.body.emailexist.should.be.a('string');
	          
	          done();
		});
    });


  });
});