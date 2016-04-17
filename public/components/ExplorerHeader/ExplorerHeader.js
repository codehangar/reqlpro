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
  toggleButtonClassNames: function (type) {
    var classNames = "btn fa";
    switch (type) {
      case 'tree':
        classNames += " fa-tree";
        classNames += this.state.selectedTable.type === type ? " active" : "";
      case 'table':
        classNames += " fa-th";
        classNames += this.state.selectedTable.type === type ? " active" : "";
    }
    return classNames;
  },
  render: function() {
    let treeClasses = this.toggleButtonClassNames('tree');
    let tableClasses = this.toggleButtonClassNames('table');

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="explorer-header">
            <div className="bread-crumbs">
              <p>{this.state.selectedTable.databaseName}</p> <i className="fa fa-arrow-right"></i> <p>{this.state.selectedTable.tableName}</p>
              <div className="pull-right">
                <button onClick={this.toggleExplorerBody.bind(this, 'tree')} className={treeClasses} />
                <button onClick={this.toggleExplorerBody.bind(this, 'table')} className={tableClasses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplorerHeader;