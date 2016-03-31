var Model = require('./Model');

/** Setup Model Properties and tags **/
var Connection = new Model({
	name: {
		value: {
			value: '',
			valid: true
		},
		tags: []
	},
	host: {
		value: {
			value: '',
			valid: true
		},
		tags: []
	},
	port: {
		value: {
			value: '',
			valid: true
		},
		tags: []
	},
	database: {
		value: {
			value: '',
			valid: true
		},
		tags: []
	},
	authKey: {
		value: {
			value: '',
			valid: true
		},
		tags: []
	}
});

module.exports = Connection;
