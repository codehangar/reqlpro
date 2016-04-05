var Model = require('./Model');

/** Setup Model Properties and tags **/
var Connection = new Model({
	name: {
		value: {
			value: '',
			valid: true
		},
		tags: ['config']
	},
	host: {
		value: {
			value: '',
			valid: true
		},
		tags: ['config']
	},
	port: {
		value: {
			value: '',
			valid: true
		},
		tags: ['config']
	},
	database: {
		value: {
			value: '',
			valid: true
		},
		tags: ['config']
	},
	authKey: {
		value: {
			value: '',
			valid: true
		},
		tags: ['config']
	},
	identicon: {
		value: null,
		tags: ['config']
	}
});

module.exports = Connection;
