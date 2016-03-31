var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ConnectionForm = React.createClass({
	getInitialState: function() {
    return this.props.connection;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.connection);
  },
  handleTextChange: function(key, e) {
  	var attribute = this.state;
  	attribute[key].value = e.target.value;
    this.setState(attribute);
  },
  handleValidation: function() {
  	var attributes = this.state;
  	attributes.name.valid = this.state.name.value ? true : false;
  	attributes.host.valid = this.state.host.value ? true : false;
  	attributes.port.valid = this.state.port.value ? true : false;
  	this.setState(attributes);
  },
	handleSubmit: function(e) {
    e.preventDefault();
    this.handleValidation();
    if(this.state.name.valid && this.state.host.valid && this.state.port.valid) {
      // Save new favorite and turn off form
      RethinkDbClient.addFavorite(this.state);
      RethinkDbClient.toggleConnectionForm();
    }
  },
  handleCancel: function(e) {
    e.preventDefault();
    RethinkDbClient.toggleConnectionForm();
  },
  render: function() {
    // this.props.show.show, dont like this but it does the same thing as angular where,
    // if you pass a primitive directly it doesnt detect the change
    var containerStyles = {
      display: this.props.show.show ? 'block' : 'none'
    };
  	// Validation Classes
  	var inputValidationClasses = {
  		name: classNames({
  			'form-group': true,
  			'has-error': !this.state.name.valid
  		}),
  		host: classNames({
				'form-group': true,
  			'has-error': !this.state.host.valid
  		}),
  		port: classNames({
  			'form-group': true,
  			'has-error': !this.state.port.valid
  		}),
  		database: classNames({
  			'form-group': true
  		}),
  		authKey: classNames({
  			'form-group': true
  		})
  	};
    return (
      <div className="connectionForm" style={containerStyles}>
      	<div className="row">
	      	<div className="col-sm-12">
		        <form>
			    		<div className={inputValidationClasses.name}>
					    	<label for="name">Connection Name</label>
					    	<input type="text" className="form-control" id="name" placeholder="Connection Name" value={this.state.name.value} onChange={this.handleTextChange.bind(this, 'name')} />
					  	</div>
					  	<div className={inputValidationClasses.host}>
					    	<label for="host">Host</label>
					    	<input type="text" className="form-control" id="host" placeholder="Host" value={this.state.host.value} onChange={this.handleTextChange.bind(this, 'host')} />
					  	</div>
					  	<div className={inputValidationClasses.port}>
					    	<label for="port">Port</label>
					    	<input type="text" className="form-control" id="port" placeholder="Port" value={this.state.port.value} onChange={this.handleTextChange.bind(this, 'port')} />
					  	</div>
					  	<div className={inputValidationClasses.database}>
					    	<label for="database">Database</label>
					    	<input type="text" className="form-control" id="database" placeholder="Database" value={this.state.database.value} onChange={this.handleTextChange.bind(this, 'database')} />
					  	</div>
					  	<div className={inputValidationClasses.authKey}>
					    	<label for="authKey">Auth Key</label>
					    	<input type="text" className="form-control" id="authKey" placeholder="Auth Key" value={this.state.authKey.value} onChange={this.handleTextChange.bind(this, 'authKey')} />
					  	</div>
							<button type="submit" className="btn btn-default" onClick={this.handleSubmit}>Add Connection</button>
              <button type="cancel" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
		        </form>
	        </div>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionForm;