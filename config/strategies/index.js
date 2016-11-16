module.exports = function() {
	require('./local')();
	require('./facebook')();
	require('./google')();
	require('./twitter')();
	require('./linkedin')();
};