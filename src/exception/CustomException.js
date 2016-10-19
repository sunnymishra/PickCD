exports.CustomException = function(){
	
	var DatabaseError = function DatabaseError(message) {
	    this.name = "DatabaseError";
	    this.message = (message || "");
	}
	
	DatabaseError.prototype = Error.prototype;

	// Add more exceptions here ......


	return {
		DatabaseError: DatabaseError
		// return more exceptions here
	}
}