var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ExplorerHeader = React.createClass({
  toggleExplorerBody: function(key, e) {
    e.preventDefault();
    RethinkDbClient.toggleExplorerBody(key);
  },
  toggleButtonClassNames: function (type) {
    var classNames = "btn fa";
    switch (type) {
      case 'tree':
        classNames += " fa-tree";
        classNames += this.props.table.type === type ? " active" : "";
      case 'table':
        classNames += " fa-th";
        classNames += this.props.table.type === type ? " active" : "";
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
              <p>{this.props.table.databaseName}</p>
              <i className="fa fa-arrow-right"></i>
              <p>{this.props.table.name}</p>
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