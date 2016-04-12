var React = require('react');
var classNames = require('classnames');
var ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerBody = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  componentDidMount: function() {
    this.setupEvents();
  },
  setupEvents: function() {
    var _this = this;
    // Event for updating selected table data
    RethinkDbClient.on('updateSelectedTable', function() {
      _this.setState({
        selectedTable: RethinkDbClient.selectedTable
      });
    });
  },
  render: function() {
    var explorerBody;
    if(this.state.selectedTable.data.length) {
      if(this.state.selectedTable.type === 'tree') {
        explorerBody = <ExplorerTreeView data={this.state.selectedTable.data} />;
      }
    } else {
      explorerBody = <p className="empty-table">Table is empty!</p>;
    }
    return (
      <div className="row explorer-body">
        <div className="col-md-12">
          {explorerBody}
        </div>
      </div>
    );
  }
});

module.exports = ExplorerBody;