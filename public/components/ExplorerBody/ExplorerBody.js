var React = require('react');
var classNames = require('classnames');
var ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
var ExplorerTableView = require('../ExplorerTableView/ExplorerTableView');
var ExplorerCodeView = require('../ExplorerCodeView/ExplorerCodeView');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerBody = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  componentDidMount: function() {
    this.setupEvents(this.findDOMNode);
  },
  setupEvents: function() {
    var _this = this;
    // Event for updating selected table data
    console.log("   --> ExplorerBody updateSelectedTable")
    RethinkDbClient.on('updateSelectedTable', function() {
      _this.setState({
        table: RethinkDbClient.selectedTable
      });
    });
  },
  render: function() {
    var explorerBody;
    if (this.state.table.data.length || this.state.table.type === 'code') {
      if (this.state.table.type === 'tree') {
        explorerBody = (
          <div>
            <ExplorerTreeView table={this.state.table} />
          </div>
        );
      } else if (this.state.table.type === 'table') {
        explorerBody = (
          <div className="table-view-container">
            <ExplorerTableView table={this.state.table} className="data-table-main"/>
          </div>
        );
      } else if(this.state.table.type === 'code') {
        explorerBody = (
          <div>
            <ExplorerCodeView table={this.state.table} />
          </div>
        )
      }
    } else {
      explorerBody = (
          <div>
            <p className="empty-table">Table is empty!</p>
          </div>
        );
    }
    return (
      <div className="row explorer-body" id="explorer-body" style={{
        width: this.props.width
      }}>
          {explorerBody}
      </div>
    );
  }
});

module.exports = ExplorerBody;
