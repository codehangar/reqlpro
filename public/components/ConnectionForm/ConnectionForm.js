const React = require('react');
const classNames = require('classnames');
const Segment = require('../../services/segment.service');

const ConnectionForm = React.createClass({
  getInitialState: function() {
    return {
      store: this.context.store,
      connection: this.context.store.connection,
      show: this.context.store.router.ConnectionForm.show,
      action: this.context.store.router.ConnectionForm.action
    };
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    const updateState = () => {
      this.setState({
        connection: this.context.store.connection,
        show: this.context.store.router.ConnectionForm.show,
        action: this.context.store.router.ConnectionForm.action
      });
    }

    this.state.store.on('updateRehinkDbClient', () => {
      updateState();
    });
    this.state.store.on('showConnectionForm', () => {
      updateState();
    });
    this.state.store.on('hideConnectionForm', () => {
      updateState();
    });
  },
  handleTextChange: function(key, e) {
    var attribute = this.state.connection;
    attribute[key].value = e.target.value;
    this.setState(attribute);
  },
  handleValidation: function() {
    var attributes = this.state.connection;
    attributes.name.valid = this.state.connection.name.value ? true : false;
    attributes.host.valid = this.state.connection.host.value ? true : false;
    attributes.port.valid = this.state.connection.port.value ? true : false;
    this.setState(attributes);
  },
  handleSubmit: function(e) {
    this.handleValidation();
    if (this.state.connection.name.valid && this.state.connection.host.valid && this.state.connection.port.valid) {
      // Save new favorite and turn off form
      if (this.state.action === 'Add') {
        this.state.store.addFavorite(this.state.connection);
        Segment.track({
          event: 'connection.add',
          properties: {}
        });
      } else {
        this.state.store.editFavorite(this.state.connection);
      }
      this.state.store.hideConnectionForm();
    }
  },
  handleCancel: function(e) {
    this.state.store.hideConnectionForm();
  },
  handleDelete: function(e) {
    this.state.store.deleteFavorite(this.state.connection);
    this.state.store.hideConnectionForm();
  },
  render: function() {
    var containerStyles = {
      display: this.state.show ? 'block' : 'none'
    };

    // Validation Classes
    const inputValidationClasses = {
      name: classNames({
        'form-group': true,
        'has-error': !this.state.connection.name.valid
      }),
      host: classNames({
        'form-group': true,
        'has-error': !this.state.connection.host.valid
      }),
      port: classNames({
        'form-group': true,
        'has-error': !this.state.connection.port.valid
      }),
      database: classNames({
        'form-group': true
      }),
      authKey: classNames({
        'form-group': true
      })
    };

    let deleteButton = '';
    if (this.state.action === 'Edit') {
      deleteButton = <button type="delete" className="btn btn-default" onClick={this.handleDelete}>Delete</button>
    }

    return (
      <div className="ConnectionForm" style={containerStyles}>
        <div className="panel panel-default">
          <div className="panel-heading">
            <strong>{this.state.action} RethinkDB Connection</strong>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-12">
                <form>
                  <div className={inputValidationClasses.name}>
                    <label htmlFor="name">Connection Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Connection Name" value={this.state.connection.name.value} onChange={this.handleTextChange.bind(this, 'name')} />
                  </div>
                  <div className={inputValidationClasses.host}>
                    <label htmlFor="host">Host</label>
                    <input type="text" className="form-control" id="host" placeholder="Host" value={this.state.connection.host.value} onChange={this.handleTextChange.bind(this, 'host')} />
                  </div>
                  <div className={inputValidationClasses.port}>
                    <label htmlFor="port">Port</label>
                    <input type="text" className="form-control" id="port" placeholder="Port" value={this.state.connection.port.value} onChange={this.handleTextChange.bind(this, 'port')} />
                  </div>
                  {/*<div className={inputValidationClasses.database}>
                    <label htmlFor="database">Database</label>
                    <input type="text" className="form-control" id="database" placeholder="Database" value={this.state.connection.database.value} onChange={this.handleTextChange.bind(this, 'database')} />
                  </div>
                  <div className={inputValidationClasses.authKey}>
                    <label htmlFor="authKey">Auth Key</label>
                    <input type="text" className="form-control" id="authKey" placeholder="Auth Key" value={this.state.connection.authKey.value} onChange={this.handleTextChange.bind(this, 'authKey')} />
                  </div>*/}
                </form>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <button type="submit" className="btn btn-primary pull-right" onClick={this.handleSubmit}>{this.state.action} Connection</button>
            <button type="cancel" className="btn btn-default pull-left" onClick={this.handleCancel}>Cancel</button>
            {deleteButton}
            <div className="clearfix"/>
          </div>
        </div>
      </div>
    );
  }
});
ConnectionForm.contextTypes = {
  store: React.PropTypes.object
};

module.exports = ConnectionForm;
