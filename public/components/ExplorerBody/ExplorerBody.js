var React = require('react');
var classNames = require('classnames');
var ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
var ExplorerTableView = require('../ExplorerTableView/ExplorerTableView');
var ExplorerCodeView = require('../ExplorerCodeView/ExplorerCodeView');
var ExplorerFooter = require('../ExplorerFooter/ExplorerFooter');
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
    if (this.state.table.data.length) {
      if (this.state.table.type === 'tree') {
        explorerBody = (
          <div>
            <ExplorerTreeView table={this.state.table} />
            <ExplorerFooter table={this.state.table} />
          </div>
        );
      } else if (this.state.table.type === 'table') {
        explorerBody = (
          <div>
            <ExplorerTableView table={this.state.table} />
            <ExplorerFooter table={this.state.table} />
          </div>
        );
      } else if(this.state.table.type === 'add') {
        explorerBody = (
          <div>
            <ExplorerCodeView table={this.state.table} />
            <ExplorerFooter table={this.state.table} />
          </div>
        )
      }
    } else {
      explorerBody = (
          <div>
            <p className="empty-table">Table is empty!</p>
            <ExplorerFooter table={this.state.table} />
          </div>
        );
    }
    return (
      <div className="row explorer-body" id="explorer-body">
        <div className="col-md-12" style={{marginTop: '-15px'}}>
          {explorerBody}
        </div>
      </div>
    );
  }
});

module.exports = ExplorerBody;
