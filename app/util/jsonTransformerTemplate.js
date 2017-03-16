'use strict';

module.exports = {
	userUpdateTemplate : {
		// This transformer Template is used to make sure that only below fields are allowed to be updated into DB. 
		// Any malicious attempt by User to update any additional sensitive fields will be thus ignored
	  "profile.firstName": '$.profile.firstName',
	  "profile.lastName": '$.profile.lastName',
	  "profile.updated": '$.profile.updated',
	  "profile.contacts.email": '$.profile.contacts.email',
	  "profile.contacts.emailVerification.isEmailVerified": '$.profile.contacts.emailVerification.isEmailVerified',
	  "profile.contacts.mobile.mCountryCode": '$.profile.contacts.mobile.mCountryCode',
	  "profile.contacts.mobile.mNumber": '$.profile.contacts.mobile.mNumber',
	  "profile.contacts.isMobileVerified": '$.profile.contacts.isMobileVerified'
	}

};