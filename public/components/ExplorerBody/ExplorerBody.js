const React = require('react');
const ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
const ExplorerTableView = require('../ExplorerTableView/ExplorerTableView');
const ExplorerCodeView = require('../ExplorerCodeView/ExplorerCodeView');

const ExplorerBody = React.createClass({
  render: function() {
    let explorerBody;

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
