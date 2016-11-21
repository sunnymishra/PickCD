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
 * Delivery Schema
 */
var DeliverySchema = new Schema({
	customer:{
		userId: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		userName: String
	},
	carrier:{
		userId: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		userName: String
	},
	pickupDatetime:{
		expectedDate: {
			type: Date,
			default: Date.now
		},
		expectedFromTime: {
			type: Date,
			default: Date.now
		},
		expectedToTime: {
			type: Date,
			default: Date.now
		},
		actualDatetime: {
			type: Date,
			default: Date.now
		},
	},
	sourceLocation:{
		name:String,
		address:String,
		geoLoc:[SchemaTypes.Double]
	},
	destLocation:{
		name:String,
		address:String,
		geoLoc:[SchemaTypes.Double]
	},
	deliveryType:{
		type: {
			type: String,
			enum: ['landmark','doorstep','premium']
		}
	},
	parcel:{
		weight:SchemaTypes.Double,
		size:String,
		description:String,
		instruction:String
	},
	approxDistance:SchemaTypes.Double,
	deliveryStatus:{
		type: {
			type: String,
			enum: ['initiated','booked','inprogress','delivered','cancelledbycustomer']
		},
		default: ['initiated']
	},
	billing:{
		approxAmount:SchemaTypes.Double,
		actualAmount:SchemaTypes.Double,
		billingStatus:{
			type: String,
			enum: ['success','fail']
		},
		billDetail:[{
			payMode:String,
			status:{
				type: String,
				enum: ['success','fail']
			},
			created: {
				type: Date,
				default: Date.now
			}
		}]
	},
	custFeedback:{
		stars:Number,
		type:{
			type: String,
			enum: ['feedback','complain']
		},
		details:String,
		created: {
			type: Date,
			default: Date.now
		}
	},
	carrierFeedback:{
		stars:Number,
		type:{
			type: String,
			enum: ['feedback','complain']
		},
		details:String,
		created: {
			type: Date,
			default: Date.now
		}
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


/**
 * Create instance method for hashing a password
 */
/*UserSchema.methods.hashPassword = function(password) {
	if (this.profile.salt && password) {
		return crypto.pbkdf2Sync(password, this.profile.salt, 10000, 64, 'sha512').toString('base64');
	} else {
		return password;
	}
};*/



mongoose.model('Delivery', DeliverySchema);