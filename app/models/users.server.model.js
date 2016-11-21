'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.profile.provider == 'local' && !this.profile.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.profile.provider == 'local' && (password && password.length >= 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	profile:{
		userName: {
			type: String,
			trim: true,
			unique:true,
			default: '',
			validate: [validateLocalStrategyProperty, 'Please fill in your unique userName']
		},
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
				/*unique: true,*/
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
					type: Number,
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
			}
		}
	},
	customer:{
		locations:[{
			name:{
				type: String,
				enum: ['source', 'destination']
			},
			address:String,
			geoLoc:[SchemaTypes.Double],
			landmark:String,
			isActive:{
				type:Boolean,
				default: true
			}
		}]
	},
	isCarrier: {
		type:Boolean,
		default: false
	},
	carrier:{
		photoPath:String,
		transportType:{
				type: String,
				enum: ['own','public']
		},
		identity:[{
			docPath:String,
			type:{
				type: String,
				enum: ['adhaar', 'voterCard','drivingLicense','rationCard','passport','panCard']
			},
			isActive:{
				type:Boolean,
				default: true
			}
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
			isActive:{
				type:Boolean,
				default: true
			}
		}]
	},
	isActive:{
		type:Boolean,
		default: true
	}
});

/**
 * Hook a pre save method to hash the password
 */
/*UserSchema.pre('save', function(next) {
	console.log('Inside save hook. this.profile.password='+this.profile.password);
	// DO your stuff here
	next();
});*/

UserSchema.methods.hashSaltPassword = function() {
	if (this.profile.password && this.profile.password.length >= 6) {
		this.profile.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.profile.password = this.hashPassword(this.profile.password);
	}
	//next();
	return;
//});
};

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.profile.salt && password) {
		return crypto.pbkdf2Sync(password, this.profile.salt, 10000, 64, 'sha512').toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.profile.password === this.hashPassword(password);
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


mongoose.model('User', UserSchema);