var React = require('react');
var classNames = require('classnames');
var ExplorerHeader = require('../ExplorerHeader/ExplorerHeader');
var ExplorerBody = require('../ExplorerBody/ExplorerBody');

var Explorer = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  render: function() {
    var content = "Select a table";
    if(this.state.rethinkDbClient.selectedTable !== null) {
      content = <div><ExplorerHeader selectedTable={this.state.rethinkDbClient.selectedTable} /><ExplorerBody selectedTable={this.state.rethinkDbClient.selectedTable} /></div>;
    }
    return (
      <div className="col-md-9 main-content-col no-float">
        {content}
      </div>
    );
  }
});

module.exports = Explorer;