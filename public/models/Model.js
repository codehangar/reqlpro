var Model = function(attrs, data) {
	this.attrs = attrs;
	// Set Data if passed in and exists on object	
	this.setData(data);
	// Set up model properties to be accessed like normal
	this.setProps();
};

/**
 * Returns object properties with specified tag, if tag is undefined return all props
 */
Model.prototype.toJson = function(tag) {
	var props = {};
	var prop;
	if(tag) {
		// Return all props with specified tag
		for(prop in this.attrs) {
			if(this.attrs.hasOwnProperty(prop)) {
				if(this.attrs[prop].tags.indexOf(tag) !== -1) {
					props[prop] = this[prop];
				}
			}
		}
	} else {
		// Return all props
		for(prop in this) {
			if(this.attrs.hasOwnProperty(prop)) {
				props[prop] = this[prop];
			}
		}
	}
	// Remove the id field if its for the db and the id is null/undefined
	if(tag === 'db' && !props.id) {
		delete props.id;
	}
	return props;
};

/**
 * Set Data passed in
 */
Model.prototype.setData = function(data) {
	var prop;
	if(data && typeof data === 'object') {
		for(prop in data) {
			if (this.attrs.hasOwnProperty(prop)) this.attrs[prop].value = data[prop];
		}
	}
};

/**
 * Setup model properties
 */
Model.prototype.setProps = function() {
	var prop;
	for(prop in this.attrs) {
		if(this.attrs.hasOwnProperty(prop)) {
			this[prop] = this.attrs[prop].value;
		}
	}
};

/**
 * Create new instance of a specific model
 */
Model.prototype.create = function(data) {
	var attrs = JSON.parse(JSON.stringify(this.attrs));
	return new Model(attrs, data);
};

module.exports = Model;