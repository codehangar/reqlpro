var RethinkDbClient = window.rethinkDbClient;
var React = require('react');
var Sidebar = require('../Sidebar/Sidebar');
var Explorer = require('../Explorer/Explorer');
var ConnectionForm = require('../ConnectionForm/ConnectionForm');
var Connection = require('../../models/Connection');

var App = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    var _this = this;
    // Event for toggling connection form
    RethinkDbClient.on('toggleConnectionForm', function() {
      _this.setState({
        rethinkDbClient: RethinkDbClient
      });
    });
    // Event for updating selected favorite
    RethinkDbClient.on('updateRehinkDbClient', function() {
      _this.setState({
        rethinkDbClient: RethinkDbClient
      });
    });
  },
  render: function() {
    return (
      <div className="row main-content-row">
        <Sidebar rethinkDbClient={this.state.rethinkDbClient} />
        <Explorer rethinkDbClient={this.state.rethinkDbClient} />
        <ConnectionForm connection={this.state.rethinkDbClient.connection.toJson()} show={this.state.rethinkDbClient.router.connectionForm.show} action={this.state.rethinkDbClient.router.connectionForm.action} />
      </div>
    );
  }
});

module.exports = App;