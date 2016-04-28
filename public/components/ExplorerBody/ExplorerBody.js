var React = require('react');
var classNames = require('classnames');
var ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
var ExplorerTableView = require('../ExplorerTableView/ExplorerTableView');
var ExplorerCodeView = require('../ExplorerCodeView/ExplorerCodeView');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerBody = React.createClass({
  render: function() {
    var explorerBody;
    if (this.props.table.data.length || this.props.table.type === 'code') {
      if (this.props.table.type === 'tree') {
        explorerBody = (
          <div>
            <ExplorerTreeView table={this.props.table} />
          </div>
        );
      } else if (this.props.table.type === 'table') {
        explorerBody = (
          <div className="table-view-container">
            <ExplorerTableView table={this.props.table} className="data-table-main"/>
          </div>
        );
      } else if(this.props.table.type === 'code') {
        explorerBody = (
          <div>
            <ExplorerCodeView table={this.props.table} />
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
