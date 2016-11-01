'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	crypto = require('crypto');


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	profile:{
		firstName: {
			type: String,
			trim: true,
			default: '',
			validate: [validateLocalStrategyProperty, 'Please fill in your first name']
		},
		lastName: {
			type: String,
			trim: true,
			default: '',
			validate: [validateLocalStrategyProperty, 'Please fill in your last name']
		},
		username: {
			type: String,
			unique: true,
			required: 'Please fill in a username',
			trim: true
		},
		password: {
			type: String,
			default: '',
			validate: [validateLocalStrategyPassword, 'Password should be longer']
		},
		salt: {
			type: String
		},
		provider: {
			type: String,
			required: 'Provider is required'
		},
		providerData: {},
		additionalProvidersData: {},
		roles: {
			type: [{
				type: String,
				enum: ['user', 'admin']
			}],
			default: ['user']
		},
		updated: {
			type: Date
		},
		created: {
			type: Date,
			default: Date.now
		},
		contacts:{
			email: {
				type: String,
				unique: true,
				trim: true,
				default: '',
				validate: [validateLocalStrategyProperty, 'Please fill in your email'],
				match: [/.+\@.+\..+/, 'Please fill a valid email address']
			},
			isEmailVerified: {
				type: Boolean,
				default: false
			},
			mobile:{
				mCountryCode: {
					type: String,
					trim: true,
					default: '',
					validate: [validateLocalStrategyProperty, 'Empty country code'],
					match: [/^[\+]([0-9]{1,5})$/, 'Invalid country code']
					/*Use virtual to concatenate CountryCode-MobileNumber*/
				},
				mNumber: {
					type: String,
					trim: true,
					default: '',
					validate: [validateLocalStrategyProperty, 'Empty mobile no.'],
					match: [/^([0-9]{4,13})$/, 'Invalid mobile number']
					/*Use virtual to concatenate CountryCode-MobileNumber*/
				}
			},
			isMobileVerified: {
				type: Boolean,
				default: false
			},
		}
	},
	customer:{
		locations:[{
			type:{
				type: String,
				enum: ['source', 'destination']
			},
			name:String,
			address:String,
			lat:String,
			long:String,
			landmark:String,
			isActive:Boolean
		}]
	},
	isCarrier: Boolean,
	carrier:{
		photoPath:String,
		transportType:{
				type: String,
				enum: ['ownTransport', 'publicTransport']
		},
		identity:[{
			docPath:String,
			type:{
				type: String,
				enum: ['adhaar', 'voterCard','drivingLicense','rationCard','passport','panCard']
			},
			isActive:Boolean
		}],
		residence:[{
			docPath:String,
			address:{
				address1:String,
				address2:String,
				address3:String,
				landmark:String,
				city:String,
				state:String,
				pin:Number
			},
			isActive:Boolean
		}]
	},
	isActive:Boolean
	
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	console.log('Inside Hook save')
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	console.log('Inside hashPassword')
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

UserSchema.virtual('profile.contacts.mobile.fullMobileNo')
	.get(function() {
		return this.profile.contacts.mobile.mCountryCode + '-' + this.profile.contacts.mobile.mNumber;
	})
	.set(function(fullMobileNo) {
		var mobileParts = fullMobileNo.split('-');
		this.profile.contacts.mobile.mCountryCode = mobileParts[0];
		if(!mobileParts[1])
			throw new Error('Invalid mobile number format');
		this.profile.contacts.mobile.mNumber = mobileParts[1];
});

/*
var UserSchema = Schema({
	firstName: String,
	email: {type: String, unique: true, required: 'Please fill in a email',trim: true},
	age: {type: Number, min: 13, max: 100},
	createDate: {type: Date, default: Date.now},
	authorId : { type: ObjectId, required: true, validate: [validateLocalStrategyProperty, 'Please fill in your authorId correct'], }
});
*/

module.exports = mongoose.model('User', UserSchema);