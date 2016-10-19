var crypto = require('crypto');
var nconf = require('nconf');
var path = require('path');
var log = require(path.join(path.dirname(require.main.filename),'../lib/logger.js'));

module.exports = function(){
	
	var encryptKey = function(key) {
	    var shaSum = crypto.createHash('sha256');
		//“salt” the hash by adding a secret key in front of the key before encrypting it. Saves from dictionary attack
		key=nconf.get('keySalt')+key;
		// Encrypting the salted key
		shaSum.update(key);
		return shaSum.digest('hex');
	};
	
	function verificationCode() {
		var high = 1, low = 9;
		var val="";
		for(i = 0 ; i < 6 ; i++){
			val += ""+Math.floor(random(high, low));
		}
	    return val;
	}

	function random (low, high) {
	    return Math.random() * (high - low) + low;
	}

	// Add more util functions here ......


	return {
		encryptKey: encryptKey,
		verificationCode: 	verificationCode
		// return more exceptions here
	}
}