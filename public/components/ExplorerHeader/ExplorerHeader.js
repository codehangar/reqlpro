var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerHeader = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  toggleExplorerBody: function(key, e) {
    e.preventDefault();
    RethinkDbClient.toggleExplorerBody(key);
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="explorer-header">
            <div className="bread-crumbs">
              <p>{this.state.selectedTable.databaseName}</p> <i className="fa fa-arrow-right"></i> <p>{this.state.selectedTable.tableName}</p>
              <div className="pull-right">
                <button onClick={this.toggleExplorerBody.bind(this, 'tree')} className="btn fa fa-tree" />
                <button onClick={this.toggleExplorerBody.bind(this, 'table')} className="btn fa fa-th" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;