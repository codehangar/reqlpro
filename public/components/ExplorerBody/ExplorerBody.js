const React = require('react');
const ExplorerTreeView = require('../ExplorerTreeView/ExplorerTreeView');
const ExplorerTableView = require('../ExplorerTableView/ExplorerTableView');
const ExplorerCodeView = require('../ExplorerCodeView/ExplorerCodeView');

const ExplorerBody = React.createClass({
  render: function() {
    let explorerBody;
    console.log(" **** ExplorerBody this.props", this.props)
    if (this.props.table.loading) {
      explorerBody = (
        <div className="explorer-loading">
           <span className="fa fa-refresh fa-spin"></span>
        </div>
      );
    } else {
      if (this.props.table.data.length || this.props.table.type === 'code') {
        if (this.props.table.type === 'tree') {
          explorerBody = (
            <div>
              <ExplorerTreeView table={this.props.table} />
            </div>
          );
        } else if (this.props.table.type === 'table') {
          explorerBody = (
            <div style={{position:'relative'}}>
              <div className="table-view-container">
                <ExplorerTableView table={this.props.table} className="data-table-main"/>
              </div>
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
          <div className="explorer-container">
            <div className="explorer-full-message">
              <p className="super-large-text">Empty!</p>
              <p className="">Your table has no data. Try adding a new record.</p>
              <p className="small-text">Having trouble? Visit our <a href="http://utils.codehangar.io/rethink/support" target="_blank">Help Center</a> or <a onClick={function() { HS.beacon.open(); }}>send us a message</a>.</p>
              {/* <p className="text-danger small-text">{this.state.selectedFavorite.dbConnection.msg}</p> */}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="explorer-body" style={{
        width: this.props.width
      }}>
          {explorerBody}
      </div>
    );
  }
});

module.exports = ExplorerBody;
